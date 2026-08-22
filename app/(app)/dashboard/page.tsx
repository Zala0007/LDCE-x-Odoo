import Link from "next/link";
import { ArrowRight, Compass, Map, Plus, Sparkles, WalletCards } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { toggleSavedCityAction } from "@/app/actions/discovery-actions";
import { DashboardTripCard } from "@/components/dashboard/dashboard-trip-card";
import { PageHeader } from "@/components/page-header";
import { dashboardData } from "@/lib/repositories/dashboard-repository";
import { savedCityIds } from "@/lib/repositories/discovery-repository";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const [data, saved] = await Promise.all([dashboardData(session.user.id), savedCityIds(session.user.id)]);
  const firstName = session.user.name?.split(" ")[0] ?? "Traveler";
  return <>
    <PageHeader eyebrow="Your travel desk" title={`Good to see you, ${firstName}.`} description="A clear view of what’s ahead—and a little inspiration for what comes after." action={<Link className="button button-primary" href="/trips/new"><Plus size={17} />Plan a trip</Link>} />
    <section className="dashboard-hero"><div><p className="eyebrow eyebrow-light">Ready when you are</p><h2>{data.upcoming[0] ? `Next up: ${data.upcoming[0].name}` : "Your next story needs a place."}</h2><p>{data.upcoming[0] ? "Keep shaping the stops, activities, and moments that will make it yours." : "Choose a destination, add your dates, and we’ll help you bring the journey together."}</p><Link className="button button-light" href={data.upcoming[0] ? `/trips/${data.upcoming[0].id}` : "/trips/new"}>{data.upcoming[0] ? "Continue planning" : "Start a new trip"}<ArrowRight size={17} /></Link></div><span className="dashboard-hero-compass"><Compass size={54} /></span></section>
    <section className="dashboard-stats"><article><span><Map /></span><div><small>Total trips</small><strong>{data.tripTotals._count}</strong></div></article><article><span><WalletCards /></span><div><small>Planned across trips</small><strong>{formatCurrency(data.tripTotals._sum.budget)}</strong></div></article><article><span><Sparkles /></span><div><small>Average trip budget</small><strong>{formatCurrency(data.tripTotals._avg.budget)}</strong></div></article></section>
    <section className="dashboard-section"><div className="section-heading"><div><p className="eyebrow">On the horizon</p><h2>Upcoming trips</h2></div><Link href="/trips">See all trips <ArrowRight size={15} /></Link></div>{data.upcoming.length ? <div className="dashboard-trip-list">{data.upcoming.map((trip) => <DashboardTripCard key={trip.id} trip={trip} />)}</div> : <div className="inline-empty"><p>No journeys on the calendar yet.</p><Link href="/trips/new">Plan one now →</Link></div>}</section>
    {data.recent.length ? <section className="dashboard-section dashboard-recent"><div className="section-heading"><div><p className="eyebrow">Back to the map</p><h2>Recently updated</h2></div></div><div className="dashboard-trip-list">{data.recent.map((trip) => <DashboardTripCard key={trip.id} trip={trip} />)}</div></section> : null}
    <section className="dashboard-section"><div className="section-heading"><div><p className="eyebrow">A little inspiration</p><h2>Places travelers love</h2></div><Link href="/explore">Explore every city <ArrowRight size={15} /></Link></div><div className="inspiration-grid">{data.popularCities.map((city) => <article key={city.id} className="inspiration-card" style={{ backgroundImage: `linear-gradient(0deg, rgba(9,35,28,.8), transparent 65%), url(${city.image})` }}><div><span>{city.country}</span><h3>{city.name}</h3><p>From {formatCurrency(city.estimatedStayCost)} / night</p></div><form action={toggleSavedCityAction.bind(null, city.id)}><button type="submit">{saved.has(city.id) ? "Saved ✓" : "Save"}</button></form></article>)}</div></section>
  </>;
}
