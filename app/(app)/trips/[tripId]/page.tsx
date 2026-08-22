import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPinned,
  MapPin,
  Pencil,
  Route,
  Share2,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { DayTimeline } from "@/components/itinerary/day-timeline";
import { StatusBadge } from "@/components/trips/status-badge";
import { getAccessibleItinerary } from "@/lib/repositories/sharing-repository";
import { formatCurrency, formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { tripId } = await params;
  const trip = await getAccessibleItinerary(tripId, session.user.id);
  if (!trip) notFound();
  const isOwner = trip.ownerId === session.user.id;
  const canEdit =
    isOwner || trip.shares.some((share) => share.role === "EDITOR");
  return (
    <div className="trip-detail">
      <Link className="back-link" href="/trips">
        <ArrowLeft size={16} />
        All trips
      </Link>
      <section
        className="trip-detail-hero"
        style={
          trip.coverImage
            ? {
                backgroundImage: `linear-gradient(90deg, rgba(13,35,30,.86), rgba(13,35,30,.25)), url(${trip.coverImage})`,
              }
            : undefined
        }
      >
        <div>
          <StatusBadge status={trip.status} />
          <h1>{trip.name}</h1>
          <p>{trip.description || "A new journey waiting for its details."}</p>
          <div className="trip-detail-actions">
            {trip.stops.length ? (
              <Link
                className="button button-light"
                href={`/trips/${trip.id}/map`}
              >
                <MapPinned size={17} />
                View route map
              </Link>
            ) : null}
            {isOwner ? (
              <>
                <Link
                  className="button button-light"
                  href={`/trips/${trip.id}/edit`}
                >
                  <Pencil size={17} />
                  Edit essentials
                </Link>
                <Link
                  className="button button-light"
                  href={`/trips/${trip.id}/cities`}
                >
                  <MapPin size={17} />
                  Add cities
                </Link>
                <Link
                  className="button button-light"
                  href={`/trips/${trip.id}/activities`}
                >
                  <Sparkles size={17} />
                  Find activities
                </Link>
                <Link
                  className="button button-light"
                  href={`/trips/${trip.id}/share`}
                >
                  <Share2 size={17} />
                  Share
                </Link>
              </>
            ) : canEdit ? (
              <Link
                className="button button-light"
                href={`/trips/${trip.id}/builder`}
              >
                <Pencil size={17} />
                Collaborate
              </Link>
            ) : (
              <span className="shared-view-pill">Shared read-only view</span>
            )}
          </div>
        </div>
      </section>
      <section className="trip-facts">
        <article>
          <span>
            <CalendarDays />
          </span>
          <div>
            <small>Travel dates</small>
            <strong>{formatDateRange(trip.startDate, trip.endDate)}</strong>
          </div>
        </article>
        <article>
          <span>
            <MapPin />
          </span>
          <div>
            <small>Destinations</small>
            <strong>
              {trip.stops.length} {trip.stops.length === 1 ? "city" : "cities"}
            </strong>
          </div>
        </article>
        <article>
          <span>
            <WalletCards />
          </span>
          <div>
            <small>Planned budget</small>
            <strong>{formatCurrency(trip.budget)}</strong>
          </div>
        </article>
      </section>
      {trip.stops.length ? (
        <section className="trip-stop-preview">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your route so far</p>
              <h2>Planned stops</h2>
            </div>
            <Link className="route-preview-link" href={`/trips/${trip.id}/map`}>
              <MapPinned size={15} />Interactive route
            </Link>
            {isOwner ? (
              <Link href={`/trips/${trip.id}/cities`}>Add another city →</Link>
            ) : null}
          </div>
          <div className="stop-chip-row">
            {trip.stops.map((stop, index) => (
              <span key={stop.id}>
                <b>{index + 1}</b>
                {stop.city.name}
              </span>
            ))}
          </div>
        </section>
      ) : isOwner ? (
        <section className="next-step-card">
          <div className="next-step-icon">
            <Route />
          </div>
          <div>
            <p className="eyebrow">Next planning step</p>
            <h2>Choose the first stop.</h2>
            <p>
              Explore destination ideas, add them to this trip, and then fill
              each place with memorable activities.
            </p>
            <Link
              className="button button-primary"
              href={`/trips/${trip.id}/cities`}
            >
              <MapPin size={17} />
              Explore cities
            </Link>
          </div>
        </section>
      ) : null}
      {trip.stops.length ? (
        <section className="itinerary-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Day by day</p>
              <h2>Your itinerary</h2>
            </div>
            <div className="itinerary-view-actions">
              <Link href={`/trips/${trip.id}/map`}>Map</Link>
              {canEdit ? (
                <Link href={`/trips/${trip.id}/builder`}>Builder</Link>
              ) : null}
              <Link href={`/trips/${trip.id}/calendar`}>Calendar</Link>
              <Link href={`/trips/${trip.id}/budget`}>Budget</Link>
            </div>
          </div>
          <DayTimeline
            startDate={trip.startDate}
            endDate={trip.endDate}
            stops={trip.stops}
          />
        </section>
      ) : null}
    </div>
  );
}
