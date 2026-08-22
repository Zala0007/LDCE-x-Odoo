import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export function getProfile(userId: string) {
  return db.user.findUnique({ where: { id: userId }, include: { preferences: true, savedDestinations: { include: { city: true }, orderBy: { createdAt: "desc" } }, ownedTrips: { orderBy: { startDate: "desc" }, take: 6, include: { _count: { select: { stops: true } } } } } });
}

export function listCommunityPosts(filters: { q?: string; sort?: "popular" | "recent" } = {}) {
  const where: Prisma.CommunityPostWhereInput = { isPublic: true };
  if (filters.q) where.OR = [{ title: { contains: filters.q, mode: "insensitive" } }, { content: { contains: filters.q, mode: "insensitive" } }, { author: { name: { contains: filters.q, mode: "insensitive" } } }];
  return db.communityPost.findMany({ where, include: { author: { select: { id: true, name: true, image: true, city: true, country: true } }, trip: { select: { id: true, name: true } } }, orderBy: filters.sort === "popular" ? [{ updatedAt: "desc" }, { createdAt: "desc" }] : { createdAt: "desc" }, take: 50 });
}

export async function adminAnalytics(q = "") {
  const now = new Date();
  const [totalUsers, totalTrips, publicTrips, upcomingTrips, averageBudget, popularCities, popularActivities, users, tripsByMonth] = await Promise.all([
    db.user.count(),
    db.trip.count(),
    db.publicShareLink.count({ where: { isActive: true } }),
    db.trip.count({ where: { endDate: { gte: now } } }),
    db.trip.aggregate({ _avg: { budget: true } }),
    db.city.findMany({ take: 6, orderBy: { stops: { _count: "desc" } }, select: { name: true, country: true, _count: { select: { stops: true } } } }),
    db.activity.findMany({ take: 6, orderBy: { itineraryUses: { _count: "desc" } }, select: { name: true, category: true, _count: { select: { itineraryUses: true } } } }),
    db.user.findMany({ where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } : undefined, take: 30, orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, _count: { select: { ownedTrips: true } } } }),
    db.trip.findMany({ select: { createdAt: true } }),
  ]);
  const monthMap = new Map<string, number>();
  for (const trip of tripsByMonth) { const key = trip.createdAt.toLocaleDateString("en-US", { month: "short", year: "2-digit" }); monthMap.set(key, (monthMap.get(key) ?? 0) + 1); }
  return { totalUsers, totalTrips, publicTrips, upcomingTrips, averageBudget: averageBudget._avg.budget ?? 0, popularCities, popularActivities, users, tripsOverTime: [...monthMap].map(([month, trips]) => ({ month, trips })) };
}
