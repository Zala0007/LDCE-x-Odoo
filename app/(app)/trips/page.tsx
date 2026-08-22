import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { deleteTripAction } from "@/app/actions/trip-actions";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { TripCard } from "@/components/trips/trip-card";
import { listTripsForOwner } from "@/lib/repositories/trip-repository";

export const dynamic = "force-dynamic";

export default async function TripsPage({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const [trips, query] = await Promise.all([listTripsForOwner(session.user.id), searchParams]);
  return <><PageHeader eyebrow="Your travel journal" title="My Trips" description="Every journey begins as a small idea. Keep yours close." action={<Link className="button button-primary" href="/trips/new"><Plus size={17} /> Plan a trip</Link>} />{query.deleted ? <p className="toast-message">Trip deleted successfully.</p> : null}{trips.length ? <div className="trip-grid">{trips.map((trip) => <TripCard key={trip.id} trip={trip} deleteAction={deleteTripAction.bind(null, trip.id)} />)}</div> : <EmptyState />}</>;
}
