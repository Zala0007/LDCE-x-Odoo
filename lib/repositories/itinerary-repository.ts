import { db } from "@/lib/db";

export function getOwnedItinerary(tripId: string, ownerId: string) {
  return db.trip.findFirst({
    where: { id: tripId, ownerId },
    include: {
      stops: {
        orderBy: { position: "asc" },
        include: {
          city: { include: { activities: { orderBy: [{ popularity: "desc" }, { name: "asc" }] } } },
          itineraryActivities: { orderBy: { position: "asc" }, include: { activity: true } },
        },
      },
    },
  });
}

export function listCityChoices() {
  return db.city.findMany({ orderBy: [{ popularityScore: "desc" }, { name: "asc" }], select: { id: true, name: true, country: true } });
}
