import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export type CityFilters = {
  q?: string;
  country?: string;
  region?: string;
  sort?: "popular" | "name" | "budget";
};
export type ActivityFilters = {
  q?: string;
  city?: string;
  cityIds?: string[];
  category?: string;
  maxCost?: number | "";
  maxDuration?: number | "";
  sort?: "popular" | "name" | "cost" | "duration";
};

export function listCities(filters: CityFilters = {}, take?: number) {
  const where: Prisma.CityWhereInput = {};
  if (filters.q)
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { country: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
    ];
  if (filters.country) where.country = filters.country;
  if (filters.region) where.region = filters.region;
  const orderBy: Prisma.CityOrderByWithRelationInput[] =
    filters.sort === "name"
      ? [{ name: "asc" }]
      : filters.sort === "budget"
        ? [{ estimatedStayCost: "asc" }, { name: "asc" }]
        : [{ popularityScore: "desc" }, { name: "asc" }];
  return db.city.findMany({ where, orderBy, take });
}

export async function cityFilterOptions() {
  const cities = await db.city.findMany({
    select: { country: true, region: true },
  });
  return {
    countries: [...new Set(cities.map((city) => city.country))].sort(),
    regions: [...new Set(cities.map((city) => city.region))].sort(),
  };
}

export function savedCityIds(userId: string) {
  return db.savedDestination
    .findMany({ where: { userId }, select: { cityId: true } })
    .then((rows) => new Set(rows.map((row) => row.cityId)));
}

export function listSavedCities(userId: string) {
  return db.savedDestination.findMany({
    where: { userId },
    include: { city: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function toggleSavedCity(userId: string, cityId: string) {
  const existing = await db.savedDestination.findUnique({
    where: { userId_cityId: { userId, cityId } },
  });
  if (existing) {
    await db.savedDestination.delete({ where: { id: existing.id } });
    return false;
  }
  await db.savedDestination.create({ data: { userId, cityId } });
  return true;
}

export function tripCityIds(tripId: string) {
  return db.tripStop
    .findMany({ where: { tripId }, select: { cityId: true } })
    .then((rows) => new Set(rows.map((row) => row.cityId)));
}

export async function addCityToOwnedTrip(
  userId: string,
  tripId: string,
  cityId: string,
) {
  return db.$transaction(async (tx) => {
    const trip = await tx.trip.findFirst({
      where: { id: tripId, ownerId: userId },
      select: { id: true, startDate: true, endDate: true },
    });
    if (!trip) return null;
    const city = await tx.city.findUnique({
      where: { id: cityId },
      select: { id: true },
    });
    if (!city) return null;
    const existing = await tx.tripStop.findFirst({ where: { tripId, cityId } });
    if (existing) return existing;
    const last = await tx.tripStop.aggregate({
      where: { tripId },
      _max: { position: true },
    });
    return tx.tripStop.create({
      data: {
        tripId,
        cityId,
        startDate: trip.startDate,
        endDate: trip.endDate,
        position: (last._max.position ?? -1) + 1,
      },
    });
  });
}

export function listActivities(filters: ActivityFilters = {}) {
  const where: Prisma.ActivityWhereInput = {};
  if (filters.q)
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
    ];
  if (filters.city) where.cityId = filters.city;
  else if (filters.cityIds?.length) where.cityId = { in: filters.cityIds };
  if (filters.category) where.category = filters.category;
  if (typeof filters.maxCost === "number")
    where.estimatedCost = { lte: filters.maxCost };
  if (typeof filters.maxDuration === "number")
    where.durationMinutes = { lte: filters.maxDuration };
  const orderBy: Prisma.ActivityOrderByWithRelationInput[] =
    filters.sort === "name"
      ? [{ name: "asc" }]
      : filters.sort === "cost"
        ? [{ estimatedCost: "asc" }, { popularity: "desc" }]
        : filters.sort === "duration"
          ? [{ durationMinutes: "asc" }, { popularity: "desc" }]
          : [{ popularity: "desc" }, { name: "asc" }];
  return db.activity.findMany({
    where,
    include: { city: { select: { id: true, name: true, country: true } } },
    orderBy,
  });
}

export async function activityFilterOptionsForTrip(
  tripId: string,
  userId: string,
) {
  const trip = await db.trip.findFirst({
    where: { id: tripId, ownerId: userId },
    select: {
      id: true,
      name: true,
      stops: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          cityId: true,
          city: { select: { name: true } },
          itineraryActivities: { select: { id: true, activityId: true } },
        },
      },
    },
  });
  if (!trip) return null;
  return trip;
}

export async function addActivityToOwnedTrip(
  userId: string,
  tripId: string,
  activityId: string,
) {
  return db.$transaction(async (tx) => {
    const activity = await tx.activity.findUnique({
      where: { id: activityId },
      select: { id: true, cityId: true, estimatedCost: true },
    });
    if (!activity) return null;
    const stop = await tx.tripStop.findFirst({
      where: { tripId, cityId: activity.cityId, trip: { ownerId: userId } },
      orderBy: { position: "asc" },
    });
    if (!stop) return null;
    const existing = await tx.itineraryActivity.findFirst({
      where: { tripStopId: stop.id, activityId },
    });
    if (existing) return existing;
    const last = await tx.itineraryActivity.aggregate({
      where: { tripStopId: stop.id },
      _max: { position: true },
    });
    return tx.itineraryActivity.create({
      data: {
        tripStopId: stop.id,
        activityId,
        date: stop.startDate,
        position: (last._max.position ?? -1) + 1,
        cost: activity.estimatedCost,
      },
    });
  });
}

export async function removeActivityFromOwnedTrip(
  userId: string,
  tripId: string,
  itineraryActivityId: string,
) {
  const result = await db.itineraryActivity.deleteMany({
    where: {
      id: itineraryActivityId,
      tripStop: { tripId, trip: { ownerId: userId } },
    },
  });
  return result.count === 1;
}
