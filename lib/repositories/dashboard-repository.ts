import { db } from "@/lib/db";

export async function dashboardData(userId: string) {
  const now = new Date();
  const [upcoming, recent, popularCities, tripTotals] = await Promise.all([
    db.trip.findMany({ where: { ownerId: userId, endDate: { gte: now } }, include: { _count: { select: { stops: true } } }, orderBy: { startDate: "asc" }, take: 3 }),
    db.trip.findMany({ where: { ownerId: userId }, include: { _count: { select: { stops: true } } }, orderBy: { updatedAt: "desc" }, take: 3 }),
    db.city.findMany({ orderBy: { popularityScore: "desc" }, take: 4 }),
    db.trip.aggregate({ where: { ownerId: userId }, _sum: { budget: true }, _avg: { budget: true }, _count: true }),
  ]);
  return { upcoming, recent, popularCities, tripTotals };
}
