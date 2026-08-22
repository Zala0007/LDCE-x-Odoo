import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { addActivityToTripAction, removeActivityFromTripAction } from "@/app/actions/discovery-actions";
import { ActivityCard } from "@/components/discovery/activity-card";
import { ActivitySearchFilters } from "@/components/discovery/activity-search-filters";
import { PageHeader } from "@/components/page-header";
import { activityFilterOptionsForTrip, listActivities } from "@/lib/repositories/discovery-repository";
import { activitySearchSchema } from "@/lib/validators/discovery";

export const dynamic = "force-dynamic";

export default async function TripActivitiesPage({ params, searchParams }: { params: Promise<{ tripId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const [{ tripId }, raw] = await Promise.all([params, searchParams]);
  const trip = await activityFilterOptionsForTrip(tripId, session.user.id);
  if (!trip) notFound();
  const value = (key: string) => typeof raw[key] === "string" ? raw[key] as string : "";
  const filters = activitySearchSchema.parse({ q: value("q"), city: value("city"), category: value("category"), maxCost: value("maxCost"), maxDuration: value("maxDuration") });
  const cityIds = new Set(trip.stops.map((stop) => stop.cityId));
  const activities = await listActivities({ ...filters, city: filters.city || undefined, cityIds: trip.stops.map((stop) => stop.cityId) });
  const added = new Map(trip.stops.flatMap((stop) => stop.itineraryActivities.map((item) => [item.activityId, item.id] as const)));
  const route = `/trips/${tripId}/activities`;
  return <><Link className="back-link" href={`/trips/${tripId}`}><ArrowLeft size={16} />Back to {trip.name}</Link><PageHeader eyebrow="Fill the days" title="Find memorable things to do" description="Filter by place, interest, time, or cost. Every selection is saved to your itinerary." action={!trip.stops.length ? <Link className="button button-primary" href={`/trips/${tripId}/cities`}><MapPin size={17} />Add a city first</Link> : undefined} /><ActivitySearchFilters action={route} values={{ q: filters.q, city: filters.city, category: filters.category, maxCost: String(filters.maxCost || ""), maxDuration: String(filters.maxDuration || "") }} cities={trip.stops.map((stop) => ({ id: stop.cityId, name: stop.city.name }))} />{activities.length ? <div className="activity-grid">{activities.map((activity) => { const addedId = added.get(activity.id); return <ActivityCard key={activity.id} activity={activity} addedId={addedId} canAdd={cityIds.has(activity.cityId)} addAction={addActivityToTripAction.bind(null, tripId, activity.id)} removeAction={addedId ? removeActivityFromTripAction.bind(null, tripId, addedId) : undefined} />; })}</div> : <div className="search-empty"><span className="search-empty-icon">✦</span><h2>No activities match</h2><p>Try widening the cost, duration, or interest filters.</p></div>}</>;
}
