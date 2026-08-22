import Link from "next/link";
import { ArrowRight, MapPin, Plus, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { deleteTripAction } from "@/app/actions/trip-actions";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { TripCard } from "@/components/trips/trip-card";
import { listTripsForOwner } from "@/lib/repositories/trip-repository";
import { listTripsSharedWithUser } from "@/lib/repositories/sharing-repository";
import { formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TripsPage({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const [trips, sharedTrips, query] = await Promise.all([
    listTripsForOwner(session.user.id),
    listTripsSharedWithUser(session.user.id),
    searchParams,
  ]);
  return <><PageHeader eyebrow="Your travel journal" title="My Trips" description="Every journey begins as a small idea. Keep yours close." action={<Link className="button button-primary" href="/trips/new"><Plus size={17} /> Plan a trip</Link>} />{query.deleted ? <p className="toast-message">Trip deleted successfully.</p> : null}{trips.length ? <div className="trip-grid">{trips.map((trip) => <TripCard key={trip.id} trip={trip} deleteAction={deleteTripAction.bind(null, trip.id)} />)}</div> : <EmptyState />}{sharedTrips.length ? <section className="shared-trips-section"><div className="section-heading"><div><p className="eyebrow">Planning together</p><h2>Shared with you</h2></div><span>{sharedTrips.length} {sharedTrips.length === 1 ? "journey" : "journeys"}</span></div><div className="shared-trip-grid">{sharedTrips.map(({ trip, role }) => <Link className="shared-trip-card" href={`/trips/${trip.id}`} key={trip.id}><span className="shared-trip-cover" style={trip.coverImage ? { backgroundImage: `linear-gradient(0deg,rgba(12,39,31,.58),transparent),url(${trip.coverImage})` } : undefined}><ShieldCheck size={18} /><b>{role === "EDITOR" ? "Can edit" : "View only"}</b></span><div><p>Shared by {trip.owner.name}</p><h3>{trip.name}</h3><span><MapPin size={14} />{trip._count.stops} stops</span><span>{formatDateRange(trip.startDate, trip.endDate)}</span></div><ArrowRight className="shared-trip-arrow" size={18} /></Link>)}</div></section> : null}</>;
}
