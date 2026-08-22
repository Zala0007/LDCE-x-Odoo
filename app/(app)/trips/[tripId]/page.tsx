import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Pencil, Route, WalletCards } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { StatusBadge } from "@/components/trips/status-badge";
import { findOwnedTrip } from "@/lib/repositories/trip-repository";
import { formatCurrency, formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { tripId } = await params;
  const trip = await findOwnedTrip(tripId, session.user.id);
  if (!trip) notFound();
  return <div className="trip-detail"><Link className="back-link" href="/trips"><ArrowLeft size={16} /> All trips</Link><section className="trip-detail-hero" style={trip.coverImage ? { backgroundImage: `linear-gradient(90deg, rgba(13,35,30,.86), rgba(13,35,30,.25)), url(${trip.coverImage})` } : undefined}><div><StatusBadge status={trip.status} /><h1>{trip.name}</h1><p>{trip.description || "A new journey waiting for its details."}</p><div className="trip-detail-actions"><Link className="button button-light" href={`/trips/${trip.id}/edit`}><Pencil size={17} /> Edit essentials</Link></div></div></section><section className="trip-facts"><article><span><CalendarDays /></span><div><small>Travel dates</small><strong>{formatDateRange(trip.startDate, trip.endDate)}</strong></div></article><article><span><MapPin /></span><div><small>Destinations</small><strong>{trip.stops.length} {trip.stops.length === 1 ? "city" : "cities"}</strong></div></article><article><span><WalletCards /></span><div><small>Planned budget</small><strong>{formatCurrency(trip.budget)}</strong></div></article></section><section className="next-step-card"><div className="next-step-icon"><Route /></div><div><p className="eyebrow">Next planning step</p><h2>Build the route, day by day.</h2><p>Your trip essentials are saved. K’s itinerary module will add stops, activities, ordering, budget calculations, and a visual calendar here.</p></div></section></div>;
}
