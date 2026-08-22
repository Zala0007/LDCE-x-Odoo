import { Prisma, TripStatus } from "@prisma/client";
import { db } from "@/lib/db";
import type { TripInput } from "@/lib/validators/trip";

export const tripCardSelect = {
  id: true,
  name: true,
  description: true,
  startDate: true,
  endDate: true,
  coverImage: true,
  budget: true,
  status: true,
  updatedAt: true,
  _count: { select: { stops: true } },
} satisfies Prisma.TripSelect;

function inferredStatus(input: TripInput): TripStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (input.endDate < today) return TripStatus.COMPLETED;
  return TripStatus.UPCOMING;
}

export function listTripsForOwner(ownerId: string) {
  return db.trip.findMany({
    where: { ownerId },
    select: tripCardSelect,
    orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
  });
}

export function findOwnedTrip(id: string, ownerId: string) {
  return db.trip.findFirst({
    where: { id, ownerId },
    include: {
      stops: { include: { city: true }, orderBy: { position: "asc" } },
    },
  });
}

export async function createTrip(ownerId: string, input: TripInput) {
  const initialCity = input.initialCityId
    ? await db.city.findUnique({
        where: { id: input.initialCityId },
        select: { id: true, image: true },
      })
    : null;
  return db.trip.create({
    data: {
      ownerId,
      name: input.name,
      description: input.description || null,
      startDate: input.startDate,
      endDate: input.endDate,
      coverImage: input.coverImage || initialCity?.image || null,
      budget: input.budget,
      status: inferredStatus(input),
      stops: initialCity
        ? {
            create: {
              cityId: initialCity.id,
              startDate: input.startDate,
              endDate: input.endDate,
              position: 0,
            },
          }
        : undefined,
    },
  });
}

export async function updateOwnedTrip(
  id: string,
  ownerId: string,
  input: TripInput,
) {
  const result = await db.trip.updateMany({
    where: { id, ownerId },
    data: {
      name: input.name,
      description: input.description || null,
      startDate: input.startDate,
      endDate: input.endDate,
      coverImage: input.coverImage || null,
      budget: input.budget,
      status: inferredStatus(input),
    },
  });
  return result.count === 1;
}

export async function deleteOwnedTrip(id: string, ownerId: string) {
  const result = await db.trip.deleteMany({ where: { id, ownerId } });
  return result.count === 1;
}
