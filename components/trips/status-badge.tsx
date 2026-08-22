import type { TripStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: TripStatus }) {
  const label = status === "COMPLETED" ? "Past" : status === "UPCOMING" ? "Upcoming" : "Draft";
  return <span className={cn("status-badge", `status-${status.toLowerCase()}`)}><span />{label}</span>;
}
