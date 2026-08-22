import { db } from "@/lib/db";

export function getSharingSettings(tripId: string, ownerId: string) {
  return db.trip.findFirst({
    where: { id: tripId, ownerId },
    include: {
      publicLink: true,
      shares: {
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export function getPublicTrip(slug: string) {
  return db.publicShareLink.findFirst({
    where: { slug, isActive: true },
    include: {
      trip: {
        include: {
          owner: { select: { name: true, image: true } },
          stops: {
            orderBy: { position: "asc" },
            include: {
              city: true,
              itineraryActivities: {
                orderBy: { position: "asc" },
                include: { activity: true },
              },
            },
          },
        },
      },
    },
  });
}

export function listTripsSharedWithUser(userId: string) {
  return db.tripShare.findMany({
    where: { userId },
    include: {
      trip: {
        include: {
          owner: { select: { name: true } },
          _count: { select: { stops: true } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function getAccessibleItinerary(tripId: string, userId: string) {
  return db.trip.findFirst({
    where: { id: tripId, OR: [{ ownerId: userId }, { shares: { some: { userId } } }] },
    include: {
      shares: { where: { userId }, select: { role: true } },
      stops: {
        orderBy: { position: "asc" },
        include: {
          city: {
            include: {
              activities: { orderBy: [{ popularity: "desc" }, { name: "asc" }] },
            },
          },
          itineraryActivities: {
            orderBy: { position: "asc" },
            include: { activity: true },
          },
        },
      },
    },
  });
}
