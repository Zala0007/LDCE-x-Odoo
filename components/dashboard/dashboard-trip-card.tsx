import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { Trip } from "@prisma/client";
import { formatDateRange } from "@/lib/utils";

export function DashboardTripCard({
  trip,
}: {
  trip: Trip & { _count: { stops: number } };
}) {
  return (
    <Link className="dashboard-trip" href={`/trips/${trip.id}`}>
      <div
        className="dashboard-trip-image"
        style={
          trip.coverImage
            ? {
                backgroundImage: `linear-gradient(145deg,rgba(20,66,54,.15),rgba(20,66,54,.42)),url(${trip.coverImage})`,
              }
            : undefined
        }
      >
        <span>{trip.name.slice(0, 1)}</span>
      </div>
      <div>
        <h3>{trip.name}</h3>
        <p>
          <CalendarDays size={14} />
          {formatDateRange(trip.startDate, trip.endDate)}
        </p>
        <p>
          <MapPin size={14} />
          {trip._count.stops} cities planned
        </p>
      </div>
      <span className="dashboard-arrow">→</span>
    </Link>
  );
}
