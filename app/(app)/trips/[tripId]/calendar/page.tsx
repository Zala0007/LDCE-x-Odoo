import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { CalendarTimeline } from "@/components/itinerary/calendar-timeline";
import { PageHeader } from "@/components/page-header";
import { getAccessibleItinerary } from "@/lib/repositories/sharing-repository";

export const dynamic = "force-dynamic";

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { tripId } = await params;
  const trip = await getAccessibleItinerary(tripId, session.user.id);
  if (!trip) notFound();
  const canEdit =
    trip.ownerId === session.user.id ||
    trip.shares.some((share) => share.role === "EDITOR");
  return (
    <>
      <Link className="back-link" href={`/trips/${tripId}`}>
        <ArrowLeft size={16} />
        Back to {trip.name}
      </Link>
      <PageHeader
        eyebrow="See the whole journey"
        title="Calendar & timeline"
        description="Zoom out to see the rhythm, or open the timeline and drag activities into a better order."
      />
      <CalendarTimeline
        tripId={tripId}
        startDate={trip.startDate}
        endDate={trip.endDate}
        initialStops={trip.stops}
        canEdit={canEdit}
      />
    </>
  );
}
