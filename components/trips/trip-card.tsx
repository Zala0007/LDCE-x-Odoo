import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import type { TripStatus } from "@prisma/client";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StatusBadge } from "@/components/trips/status-badge";
import { formatDateRange } from "@/lib/utils";

type TripCardData = {
  id: string;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  coverImage: string | null;
  status: TripStatus;
  _count: { stops: number };
};

export function TripCard({
  trip,
  deleteAction,
}: {
  trip: TripCardData;
  deleteAction: () => Promise<void>;
}) {
  return (
    <article className="trip-card">
      <Link
        className="trip-card-image"
        href={`/trips/${trip.id}`}
        style={
          trip.coverImage
            ? {
                backgroundImage: `linear-gradient(145deg,rgba(20,66,54,.2),rgba(20,66,54,.48)),url(${trip.coverImage})`,
              }
            : undefined
        }
        aria-label={`View ${trip.name}`}
      >
        {!trip.coverImage ? (
          <span className="trip-card-monogram">{trip.name.slice(0, 1)}</span>
        ) : null}
        <StatusBadge status={trip.status} />
      </Link>
      <div className="trip-card-body">
        <div className="trip-card-heading">
          <div>
            <h2>
              <Link href={`/trips/${trip.id}`}>{trip.name}</Link>
            </h2>
            <p>{trip.description || "A new journey waiting to take shape."}</p>
          </div>
          <details className="card-menu">
            <summary aria-label={`Actions for ${trip.name}`}>
              <MoreHorizontal size={20} />
            </summary>
            <div>
              <Link href={`/trips/${trip.id}/edit`}>
                <Pencil size={15} /> Edit
              </Link>
              <ConfirmDialog
                title={`Delete “${trip.name}”?`}
                description="This removes the trip and all of its itinerary data. This action cannot be undone."
                action={deleteAction}
                trigger={
                  <span>
                    <Trash2 size={15} /> Delete
                  </span>
                }
              />
            </div>
          </details>
        </div>
        <div className="trip-card-meta">
          <span>
            <CalendarDays size={16} />
            {formatDateRange(trip.startDate, trip.endDate)}
          </span>
          <span>
            <MapPin size={16} />
            {trip._count.stops} {trip._count.stops === 1 ? "city" : "cities"}
          </span>
        </div>
        <div className="trip-card-footer">
          <Link className="trip-view-link" href={`/trips/${trip.id}`}>
            View trip <span>→</span>
          </Link>
          <Link
            className="icon-link"
            href={`/trips/${trip.id}/edit`}
            aria-label={`Edit ${trip.name}`}
          >
            <Pencil size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}
