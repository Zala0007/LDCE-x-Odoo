import Link from "next/link";
import { ArrowRight, MapPin, Plus, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { deleteTripAction } from "@/app/actions/trip-actions";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { TripCard } from "@/components/trips/trip-card";
import { TripLibraryFilters } from "@/components/trips/trip-library-filters";
import { listTripsForOwner } from "@/lib/repositories/trip-repository";
import { listTripsSharedWithUser } from "@/lib/repositories/sharing-repository";
import { formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Trip = Awaited<ReturnType<typeof listTripsForOwner>>[number];
type Stage = "ongoing" | "upcoming" | "completed" | "draft";

function tripStage(trip: Trip): Stage {
  if (trip.status === "DRAFT") return "draft";
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (trip.endDate < now) return "completed";
  if (trip.startDate <= now) return "ongoing";
  return "upcoming";
}

const groupOrder: Stage[] = ["ongoing", "upcoming", "draft", "completed"];
const groupLabels: Record<Stage, string> = {
  ongoing: "Ongoing",
  upcoming: "Upcoming",
  draft: "Drafts",
  completed: "Completed",
};

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const [trips, sharedTrips, query] = await Promise.all([
    listTripsForOwner(session.user.id),
    listTripsSharedWithUser(session.user.id),
    searchParams,
  ]);
  const value = (key: string) =>
    typeof query[key] === "string" ? String(query[key]).slice(0, 100) : "";
  const values = {
    q: value("q"),
    status: ["ongoing", "upcoming", "completed", "draft"].includes(
      value("status"),
    )
      ? value("status")
      : "",
    sort: ["start", "updated", "name", "budget"].includes(value("sort"))
      ? value("sort")
      : "start",
    group: value("group") === "none" ? "none" : "status",
  };
  const phrase = values.q.toLocaleLowerCase();
  const filtered = trips.filter((trip) => {
    const matchesPhrase =
      !phrase ||
      `${trip.name} ${trip.description ?? ""}`
        .toLocaleLowerCase()
        .includes(phrase);
    const matchesStatus = !values.status || tripStage(trip) === values.status;
    return matchesPhrase && matchesStatus;
  });
  filtered.sort((a, b) => {
    if (values.sort === "updated")
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    if (values.sort === "name") return a.name.localeCompare(b.name);
    if (values.sort === "budget") return (b.budget ?? 0) - (a.budget ?? 0);
    return a.startDate.getTime() - b.startDate.getTime();
  });

  return (
    <>
      <PageHeader
        eyebrow="Your travel journal"
        title="My Trips"
        description="Search, group, filter, and sort every journey from one clear library."
        action={
          <Link className="button button-primary" href="/trips/new">
            <Plus size={17} /> Plan a trip
          </Link>
        }
      />
      {value("deleted") ? (
        <p className="toast-message">Trip deleted successfully.</p>
      ) : null}
      <TripLibraryFilters values={values} />
      {filtered.length ? (
        values.group === "status" ? (
          <div className="trip-group-list">
            {groupOrder.map((stage) => {
              const stageTrips = filtered.filter(
                (trip) => tripStage(trip) === stage,
              );
              return stageTrips.length ? (
                <section className="trip-library-group" key={stage}>
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">
                        {stage === "ongoing"
                          ? "Happening now"
                          : "Your journeys"}
                      </p>
                      <h2>{groupLabels[stage]}</h2>
                    </div>
                    <span>
                      {stageTrips.length}{" "}
                      {stageTrips.length === 1 ? "trip" : "trips"}
                    </span>
                  </div>
                  <div className="trip-grid">
                    {stageTrips.map((trip) => (
                      <TripCard
                        key={trip.id}
                        trip={trip}
                        deleteAction={deleteTripAction.bind(null, trip.id)}
                      />
                    ))}
                  </div>
                </section>
              ) : null;
            })}
          </div>
        ) : (
          <div className="trip-grid">
            <>
              {filtered.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  deleteAction={deleteTripAction.bind(null, trip.id)}
                />
              ))}
            </>
          </div>
        )
      ) : trips.length ? (
        <div className="search-empty">
          <span className="search-empty-icon">⌖</span>
          <h2>No matching trips</h2>
          <p>Try another search, stage, or sort combination.</p>
          <Link className="button button-secondary" href="/trips">
            Clear all filters
          </Link>
        </div>
      ) : (
        <EmptyState />
      )}
      {sharedTrips.length ? (
        <section className="shared-trips-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Planning together</p>
              <h2>Shared with you</h2>
            </div>
            <span>
              {sharedTrips.length}{" "}
              {sharedTrips.length === 1 ? "journey" : "journeys"}
            </span>
          </div>
          <div className="shared-trip-grid">
            {sharedTrips.map(({ trip, role }) => (
              <Link
                className="shared-trip-card"
                href={`/trips/${trip.id}`}
                key={trip.id}
              >
                <span
                  className="shared-trip-cover"
                  style={
                    trip.coverImage
                      ? {
                          backgroundImage: `linear-gradient(0deg,rgba(12,39,31,.58),transparent),url(${trip.coverImage})`,
                        }
                      : undefined
                  }
                >
                  <ShieldCheck size={18} />
                  <b>{role === "EDITOR" ? "Can edit" : "View only"}</b>
                </span>
                <div>
                  <p>Shared by {trip.owner.name}</p>
                  <h3>{trip.name}</h3>
                  <span>
                    <MapPin size={14} />
                    {trip._count.stops} stops
                  </span>
                  <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                </div>
                <ArrowRight className="shared-trip-arrow" size={18} />
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
