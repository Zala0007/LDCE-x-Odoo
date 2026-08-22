import Link from "next/link";
import { ArrowLeft, MapPinned, Pencil, Plus } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { TripRouteMap } from "@/components/maps/trip-route-map";
import { PageHeader } from "@/components/page-header";
import { getAccessibleItinerary } from "@/lib/repositories/sharing-repository";

export const dynamic = "force-dynamic";

export default async function TripMapPage({
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
  const stops = trip.stops.flatMap((stop) =>
    stop.city.latitude == null || stop.city.longitude == null
      ? []
      : [
          {
            id: stop.id,
            name: stop.city.name,
            country: stop.city.country,
            latitude: stop.city.latitude,
            longitude: stop.city.longitude,
            startDate: stop.startDate.toISOString(),
            endDate: stop.endDate.toISOString(),
            image: stop.city.image,
            activityCount: stop.itineraryActivities.length,
            estimatedCost:
              stop.transportCost +
              stop.stayCost +
              stop.itineraryActivities.reduce(
                (sum, item) => sum + (item.cost ?? item.activity.estimatedCost),
                0,
              ),
          },
        ],
  );
  return (
    <>
      <Link className="back-link" href={`/trips/${tripId}`}>
        <ArrowLeft size={16} />
        Back to {trip.name}
      </Link>
      <PageHeader
        eyebrow="See the journey unfold"
        title="Interactive route map"
        description="Move across every destination, understand the distance between stops, and see where time and budget come together."
        action={
          canEdit ? (
            <Link
              className="button button-secondary"
              href={`/trips/${tripId}/builder`}
            >
              <Pencil size={16} />
              Edit itinerary
            </Link>
          ) : undefined
        }
      />
      {stops.length ? (
        <TripRouteMap tripName={trip.name} stops={stops} />
      ) : (
        <section className="route-map-empty">
          <span>
            <MapPinned />
          </span>
          <p className="eyebrow">Your map is waiting</p>
          <h2>Add a destination to draw the route.</h2>
          <p>
            Once a city is part of the itinerary, GlobeTrotter will place it
            here and connect the journey automatically.
          </p>
          {trip.ownerId === session.user.id ? (
            <Link
              className="button button-primary"
              href={`/trips/${tripId}/cities`}
            >
              <Plus size={17} />
              Add the first city
            </Link>
          ) : null}
        </section>
      )}
    </>
  );
}
