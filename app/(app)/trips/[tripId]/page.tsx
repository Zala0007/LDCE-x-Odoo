import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Pencil, Route, Sparkles, WalletCards } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { DayTimeline } from "@/components/itinerary/day-timeline";
import { StatusBadge } from "@/components/trips/status-badge";
import { getOwnedItinerary } from "@/lib/repositories/itinerary-repository";
import { formatCurrency, formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { tripId } = await params;
  const trip = await getOwnedItinerary(tripId, session.user.id);
  if (!trip) notFound();
  return <div className="trip-detail">
    <Link className="back-link" href="/trips"><ArrowLeft size={16} />All trips</Link>
    <section className="trip-detail-hero" style={trip.coverImage ? { backgroundImage: `linear-gradient(90deg, rgba(13,35,30,.86), rgba(13,35,30,.25)), url(${trip.coverImage})` } : undefined}><div><StatusBadge status={trip.status} /><h1>{trip.name}</h1><p>{trip.description || "A new journey waiting for its details."}</p><div className="trip-detail-actions"><Link className="button button-light" href={`/trips/${trip.id}/edit`}><Pencil size={17} />Edit essentials</Link><Link className="button button-light" href={`/trips/${trip.id}/cities`}><MapPin size={17} />Add cities</Link><Link className="button button-light" href={`/trips/${trip.id}/activities`}><Sparkles size={17} />Find activities</Link></div></div></section>
    <section className="trip-facts"><article><span><CalendarDays /></span><div><small>Travel dates</small><strong>{formatDateRange(trip.startDate, trip.endDate)}</strong></div></article><article><span><MapPin /></span><div><small>Destinations</small><strong>{trip.stops.length} {trip.stops.length === 1 ? "city" : "cities"}</strong></div></article><article><span><WalletCards /></span><div><small>Planned budget</small><strong>{formatCurrency(trip.budget)}</strong></div></article></section>
    {trip.stops.length ? <section className="trip-stop-preview"><div className="section-heading"><div><p className="eyebrow">Your route so far</p><h2>Planned stops</h2></div><Link href={`/trips/${trip.id}/cities`}>Add another city →</Link></div><div className="stop-chip-row">{trip.stops.map((stop, index) => <span key={stop.id}><b>{index + 1}</b>{stop.city.name}</span>)}</div></section> : <section className="next-step-card"><div className="next-step-icon"><Route /></div><div><p className="eyebrow">Next planning step</p><h2>Choose the first stop.</h2><p>Explore destination ideas, add them to this trip, and then fill each place with memorable activities.</p><Link className="button button-primary" href={`/trips/${trip.id}/cities`}><MapPin size={17} />Explore cities</Link></div></section>}
    {trip.stops.length ? <section className="itinerary-section"><div className="section-heading"><div><p className="eyebrow">Day by day</p><h2>Your itinerary</h2></div><div className="itinerary-view-actions"><Link href={`/trips/${trip.id}/builder`}>Builder</Link><Link href={`/trips/${trip.id}/calendar`}>Calendar</Link><Link href={`/trips/${trip.id}/budget`}>Budget</Link></div></div><DayTimeline startDate={trip.startDate} endDate={trip.endDate} stops={trip.stops} /></section> : null}
  </div>;
}
