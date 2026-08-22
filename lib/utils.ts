import { format } from "date-fns";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDateRange(start: Date, end: Date) {
  const sameYear = start.getFullYear() === end.getFullYear();
  return `${format(start, sameYear ? "MMM d" : "MMM d, yyyy")} – ${format(end, "MMM d, yyyy")}`;
}

export function formatCurrency(value: number | null | undefined) {
  if (value == null) return "Not set";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function initials(name: string | null | undefined) {
  return (name ?? "Traveler")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
