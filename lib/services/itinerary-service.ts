import { db } from "@/lib/db";
import type { z } from "zod";
import type { itineraryActivityInputSchema, stopInputSchema } from "@/lib/validators/itinerary";

type StopInput = z.infer<typeof stopInputSchema>;
type ActivityInput = z.infer<typeof itineraryActivityInputSchema>;

export class ItineraryValidationError extends Error {}

function within(value: Date, start: Date, end: Date) {
  return value >= start && value <= end;
}

export async function createStop(ownerId: string, tripId: string, input: StopInput) {
  return db.$transaction(async (tx) => {
    const trip = await tx.trip.findFirst({ where: { id: tripId, OR: [{ ownerId }, { shares: { some: { userId: ownerId, role: "EDITOR" } } }] }, select: { id: true, startDate: true, endDate: true } });
    if (!trip) throw new ItineraryValidationError("Trip not found");
    if (!within(input.startDate, trip.startDate, trip.endDate) || !within(input.endDate, trip.startDate, trip.endDate)) throw new ItineraryValidationError("Stop dates must stay within the trip dates");
    const city = await tx.city.findUnique({ where: { id: input.cityId }, select: { id: true } });
    if (!city) throw new ItineraryValidationError("City not found");
    const last = await tx.tripStop.aggregate({ where: { tripId }, _max: { position: true } });
    return tx.tripStop.create({ data: { tripId, ...input, position: (last._max.position ?? -1) + 1 } });
  });
}

export async function updateStop(ownerId: string, tripId: string, stopId: string, input: StopInput) {
  return db.$transaction(async (tx) => {
    const trip = await tx.trip.findFirst({ where: { id: tripId, OR: [{ ownerId }, { shares: { some: { userId: ownerId, role: "EDITOR" } } }] }, select: { startDate: true, endDate: true } });
    if (!trip) throw new ItineraryValidationError("Trip not found");
    if (!within(input.startDate, trip.startDate, trip.endDate) || !within(input.endDate, trip.startDate, trip.endDate)) throw new ItineraryValidationError("Stop dates must stay within the trip dates");
    const stop = await tx.tripStop.findFirst({ where: { id: stopId, tripId }, select: { id: true } });
    if (!stop) throw new ItineraryValidationError("Stop not found");
    const invalidActivities = await tx.itineraryActivity.count({ where: { tripStopId: stopId, OR: [{ date: { lt: input.startDate } }, { date: { gt: input.endDate } }] } });
    if (invalidActivities) throw new ItineraryValidationError("Move scheduled activities inside the new date range first");
    const wrongCityActivities = await tx.itineraryActivity.count({ where: { tripStopId: stopId, activity: { cityId: { not: input.cityId } } } });
    if (wrongCityActivities) throw new ItineraryValidationError("Remove existing activities before changing this stop's city");
    return tx.tripStop.update({ where: { id: stopId }, data: input });
  });
}

export async function deleteStop(ownerId: string, tripId: string, stopId: string) {
  return db.$transaction(async (tx) => {
    const trip = await tx.trip.findFirst({ where: { id: tripId, OR: [{ ownerId }, { shares: { some: { userId: ownerId, role: "EDITOR" } } }] }, select: { id: true } });
    if (!trip) throw new ItineraryValidationError("Trip not found");
    const stop = await tx.tripStop.findFirst({ where: { id: stopId, tripId }, select: { id: true } });
    if (!stop) throw new ItineraryValidationError("Stop not found");
    await tx.tripStop.delete({ where: { id: stopId } });
    const remaining = await tx.tripStop.findMany({ where: { tripId }, orderBy: { position: "asc" }, select: { id: true } });
    for (const [position, item] of remaining.entries()) await tx.tripStop.update({ where: { id: item.id }, data: { position } });
  });
}

export async function reorderStops(ownerId: string, tripId: string, orderedIds: string[]) {
  return db.$transaction(async (tx) => {
    const trip = await tx.trip.findFirst({ where: { id: tripId, OR: [{ ownerId }, { shares: { some: { userId: ownerId, role: "EDITOR" } } }] }, select: { id: true } });
    if (!trip) throw new ItineraryValidationError("Trip not found");
    const existing = await tx.tripStop.findMany({ where: { tripId }, select: { id: true } });
    if (existing.length !== orderedIds.length || existing.some((item) => !orderedIds.includes(item.id))) throw new ItineraryValidationError("Stop order is incomplete");
    for (const [index, id] of orderedIds.entries()) await tx.tripStop.update({ where: { id }, data: { position: -(index + 1) } });
    for (const [position, id] of orderedIds.entries()) await tx.tripStop.update({ where: { id }, data: { position } });
  });
}

export async function addItineraryActivity(ownerId: string, tripId: string, stopId: string, input: ActivityInput) {
  return db.$transaction(async (tx) => {
    const stop = await tx.tripStop.findFirst({ where: { id: stopId, tripId, trip: { OR: [{ ownerId }, { shares: { some: { userId: ownerId, role: "EDITOR" } } }] } }, select: { id: true, cityId: true, startDate: true, endDate: true } });
    if (!stop) throw new ItineraryValidationError("Stop not found");
    if (!within(input.date, stop.startDate, stop.endDate)) throw new ItineraryValidationError("Activity date must stay within the stop dates");
    const activity = await tx.activity.findFirst({ where: { id: input.activityId, cityId: stop.cityId }, select: { id: true, estimatedCost: true } });
    if (!activity) throw new ItineraryValidationError("Choose an activity from this stop's city");
    const last = await tx.itineraryActivity.aggregate({ where: { tripStopId: stopId }, _max: { position: true } });
    return tx.itineraryActivity.create({ data: { tripStopId: stopId, activityId: input.activityId, date: input.date, startTime: input.startTime || null, cost: input.cost ?? activity.estimatedCost, notes: input.notes || null, position: (last._max.position ?? -1) + 1 } });
  });
}

export async function removeItineraryActivity(ownerId: string, tripId: string, itineraryActivityId: string) {
  const result = await db.itineraryActivity.deleteMany({ where: { id: itineraryActivityId, tripStop: { tripId, trip: { OR: [{ ownerId }, { shares: { some: { userId: ownerId, role: "EDITOR" } } }] } } } });
  if (!result.count) throw new ItineraryValidationError("Activity not found");
}

export async function reorderActivities(ownerId: string, tripId: string, stopId: string, orderedIds: string[]) {
  return db.$transaction(async (tx) => {
    const stop = await tx.tripStop.findFirst({ where: { id: stopId, tripId, trip: { OR: [{ ownerId }, { shares: { some: { userId: ownerId, role: "EDITOR" } } }] } }, select: { id: true } });
    if (!stop) throw new ItineraryValidationError("Stop not found");
    const existing = await tx.itineraryActivity.findMany({ where: { tripStopId: stopId }, select: { id: true } });
    if (existing.length !== orderedIds.length || existing.some((item) => !orderedIds.includes(item.id))) throw new ItineraryValidationError("Activity order is incomplete");
    for (const [index, id] of orderedIds.entries()) await tx.itineraryActivity.update({ where: { id }, data: { position: -(index + 1) } });
    for (const [position, id] of orderedIds.entries()) await tx.itineraryActivity.update({ where: { id }, data: { position } });
  });
}
