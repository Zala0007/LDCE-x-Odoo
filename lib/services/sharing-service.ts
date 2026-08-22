import { randomBytes } from "node:crypto";
import type { ShareRole } from "@prisma/client";
import { db } from "@/lib/db";

export async function setPublicSharing(ownerId: string, tripId: string, enabled: boolean) {
  return db.$transaction(async (tx) => {
    const trip = await tx.trip.findFirst({ where: { id: tripId, ownerId }, select: { id: true } });
    if (!trip) return null;
    const current = await tx.publicShareLink.findUnique({ where: { tripId } });
    if (current) return tx.publicShareLink.update({ where: { id: current.id }, data: { isActive: enabled } });
    if (!enabled) return null;
    return tx.publicShareLink.create({ data: { tripId, slug: randomBytes(12).toString("base64url"), isActive: true } });
  });
}

export async function shareTripWithUser(ownerId: string, tripId: string, email: string, role: ShareRole) {
  return db.$transaction(async (tx) => {
    const trip = await tx.trip.findFirst({ where: { id: tripId, ownerId }, select: { id: true } });
    if (!trip) return { ok: false, message: "Trip not found" } as const;
    const user = await tx.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return { ok: false, message: "No registered user has that email" } as const;
    if (user.id === ownerId) return { ok: false, message: "You already own this trip" } as const;
    await tx.tripShare.upsert({ where: { tripId_userId: { tripId, userId: user.id } }, update: { role, sharedById: ownerId }, create: { tripId, userId: user.id, sharedById: ownerId, role } });
    return { ok: true } as const;
  });
}

export async function removeTripShare(ownerId: string, tripId: string, shareId: string) {
  const result = await db.tripShare.deleteMany({ where: { id: shareId, tripId, trip: { ownerId } } });
  return result.count === 1;
}

export async function copyTripForUser(userId: string, sourceTripId: string) {
  return db.$transaction(async (tx) => {
    const source = await tx.trip.findFirst({
      where: { id: sourceTripId, OR: [{ ownerId: userId }, { publicLink: { isActive: true } }, { shares: { some: { userId } } }] },
      include: { stops: { orderBy: { position: "asc" }, include: { itineraryActivities: { orderBy: { position: "asc" } } } } },
    });
    if (!source) return null;
    return tx.trip.create({ data: { ownerId: userId, name: `${source.name} (Copy)`, description: source.description, startDate: source.startDate, endDate: source.endDate, coverImage: source.coverImage, budget: source.budget, status: "DRAFT", stops: { create: source.stops.map((stop) => ({ cityId: stop.cityId, startDate: stop.startDate, endDate: stop.endDate, position: stop.position, transportCost: stop.transportCost, stayCost: stop.stayCost, itineraryActivities: { create: stop.itineraryActivities.map((item) => ({ activityId: item.activityId, date: item.date, startTime: item.startTime, position: item.position, notes: item.notes, cost: item.cost })) } })) } } });
  });
}
