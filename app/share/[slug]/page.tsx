import Link from "next/link";
import { CalendarDays, Compass, Copy, MapPin, WalletCards } from "lucide-react";
import { notFound } from "next/navigation";
import { copyTripAction } from "@/app/actions/sharing-actions";
import { DayTimeline } from "@/components/itinerary/day-timeline";
import { ShareButtons } from "@/components/sharing/share-buttons";
import { getPublicTrip } from "@/lib/repositories/sharing-repository";
import { calculateTripBudget } from "@/lib/services/budget-service";
import { formatCurrency, formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PublicTripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const link = await getPublicTrip(slug); if (!link) notFound(); const { trip } = link; const budget = calculateTripBudget(trip);
  return <main className="public-trip"><header className="public-nav"><Link className="brand" href="/"><span className="brand-mark"><Compass size={21} /></span>GlobeTrotter</Link><Link className="button button-secondary" href="/signup">Plan your own trip</Link></header><section className="public-hero" style={trip.coverImage ? { backgroundImage: `linear-gradient(90deg,rgba(10,35,28,.88),rgba(10,35,28,.25)),url(${trip.coverImage})` } : undefined}><div><p className="eyebrow eyebrow-light">Shared by {trip.owner.name}</p><h1>{trip.name}</h1><p>{trip.description || "A thoughtfully planned journey shared with the GlobeTrotter community."}</p><ShareButtons title={trip.name} /></div></section><section className="public-facts"><article><CalendarDays /><span><small>Dates</small><strong>{formatDateRange(trip.startDate,trip.endDate)}</strong></span></article><article><MapPin /><span><small>Stops</small><strong>{trip.stops.length} cities</strong></span></article><article><WalletCards /><span><small>Estimate</small><strong>{formatCurrency(budget.total)}</strong></span></article></section><section className="public-content"><div className="section-heading"><div><p className="eyebrow">The journey</p><h2>Day-by-day itinerary</h2></div></div><DayTimeline startDate={trip.startDate} endDate={trip.endDate} stops={trip.stops} /><form className="public-copy" action={copyTripAction.bind(null, trip.id)}><div><Copy /><span><strong>Make this journey yours</strong><p>Copy every stop and activity, then personalize the dates, pace, and budget.</p></span></div><button className="button button-primary">Copy this trip</button></form></section></main>;
}
