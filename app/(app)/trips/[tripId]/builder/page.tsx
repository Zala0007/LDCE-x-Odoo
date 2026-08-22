import Link from "next/link";
import { ArrowLeft, CalendarDays, Plus, WalletCards } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { createStopAction } from "@/app/actions/itinerary-actions";
import { ItineraryBuilder } from "@/components/itinerary/itinerary-builder";
import { PageHeader } from "@/components/page-header";
import { listCityChoices } from "@/lib/repositories/itinerary-repository";
import { getAccessibleItinerary } from "@/lib/repositories/sharing-repository";

export const dynamic = "force-dynamic";
function inputDate(date: Date) { return date.toISOString().slice(0, 10); }

export default async function BuilderPage({ params, searchParams }: { params: Promise<{ tripId: string }>; searchParams: Promise<{ error?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const [{ tripId }, query] = await Promise.all([params, searchParams]);
  const [trip, cities] = await Promise.all([getAccessibleItinerary(tripId, session.user.id), listCityChoices()]);
  if (!trip) notFound();
  const canEdit = trip.ownerId === session.user.id || trip.shares.some((share) => share.role === "EDITOR");
  if (!canEdit) notFound();
  return <><Link className="back-link" href={`/trips/${tripId}`}><ArrowLeft size={16} />Back to {trip.name}</Link><PageHeader eyebrow="The heart of the journey" title="Itinerary builder" description="Add stops, fill the days, and drag everything into the order that feels right." action={<div className="header-action-group"><Link className="button button-secondary" href={`/trips/${tripId}/budget`}><WalletCards size={17} />Budget</Link><Link className="button button-secondary" href={`/trips/${tripId}/calendar`}><CalendarDays size={17} />Calendar</Link></div>} />{query.error ? <p className="form-alert builder-alert">{query.error}</p> : null}<div className="builder-layout"><aside className="add-stop-panel"><p className="eyebrow">Grow the route</p><h2>Add another stop</h2><p>Dates must sit inside {inputDate(trip.startDate)} to {inputDate(trip.endDate)}.</p><form action={createStopAction.bind(null, tripId)}><label><span>City</span><select name="cityId" required defaultValue=""><option value="" disabled>Choose a destination</option>{cities.map((city) => <option key={city.id} value={city.id}>{city.name}, {city.country}</option>)}</select></label><div className="add-stop-dates"><label><span>Arrive</span><input name="startDate" type="date" min={inputDate(trip.startDate)} max={inputDate(trip.endDate)} defaultValue={inputDate(trip.startDate)} required /></label><label><span>Leave</span><input name="endDate" type="date" min={inputDate(trip.startDate)} max={inputDate(trip.endDate)} defaultValue={inputDate(trip.endDate)} required /></label></div><label><span>Transport estimate</span><input name="transportCost" type="number" min="0" defaultValue="0" /></label><label><span>Total stay cost</span><input name="stayCost" type="number" min="0" defaultValue="0" /><small>Leave zero to use the city estimate.</small></label><button className="button button-primary button-block" type="submit"><Plus size={17} />Add stop</button></form></aside><ItineraryBuilder tripId={tripId} initialStops={trip.stops} /></div></>;
}
