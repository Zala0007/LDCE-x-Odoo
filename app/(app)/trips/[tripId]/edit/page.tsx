import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { updateTripAction } from "@/app/actions/trip-actions";
import { PageHeader } from "@/components/page-header";
import { TripForm } from "@/components/trips/trip-form";
import { findOwnedTrip } from "@/lib/repositories/trip-repository";

export const dynamic = "force-dynamic";

export default async function EditTripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { tripId } = await params;
  const trip = await findOwnedTrip(tripId, session.user.id);
  if (!trip) notFound();
  return <div className="form-page"><PageHeader eyebrow="Refine the plan" title={`Edit ${trip.name}`} description="Adjust the essentials while keeping the journey yours." /><TripForm trip={trip} action={updateTripAction.bind(null, trip.id)} /></div>;
}
