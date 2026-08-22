import Link from "next/link";
import { AlertTriangle, ArrowLeft, CalendarRange, Gauge, IndianRupee, TrendingDown, WalletCards } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { BudgetCharts } from "@/components/budget/budget-charts";
import { PageHeader } from "@/components/page-header";
import { getOwnedItinerary } from "@/lib/repositories/itinerary-repository";
import { calculateTripBudget } from "@/lib/services/budget-service";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BudgetPage({ params }: { params: Promise<{ tripId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { tripId } = await params;
  const trip = await getOwnedItinerary(tripId, session.user.id);
  if (!trip) notFound();
  const budget = calculateTripBudget(trip);
  return <><Link className="back-link" href={`/trips/${tripId}`}><ArrowLeft size={16} />Back to {trip.name}</Link><PageHeader eyebrow="Spend with intention" title="Trip budget" description="A living estimate built from every stop, stay, meal, journey, and experience." action={<Link className="button button-secondary" href={`/trips/${tripId}/builder`}>Edit itinerary</Link>} />{!trip.budget ? <div className="budget-warning neutral"><WalletCards /><div><strong>Set a trip budget</strong><p>Add a total budget in trip essentials to unlock remaining and percentage insights.</p></div><Link href={`/trips/${tripId}/edit`}>Set budget →</Link></div> : budget.overBudget ? <div className="budget-warning"><AlertTriangle /><div><strong>You’re {formatCurrency(Math.abs(budget.remaining))} over budget</strong><p>Review the largest categories below and adjust the itinerary while there’s still time.</p></div></div> : null}<section className="budget-metrics"><article className="metric-primary"><span><WalletCards /></span><small>Total budget</small><strong>{formatCurrency(budget.totalBudget)}</strong><div className="budget-progress"><i style={{ width: `${Math.min(100, budget.percentageUsed)}%` }} /></div><em>{budget.percentageUsed.toFixed(0)}% planned</em></article><article><span><IndianRupee /></span><small>Estimated cost</small><strong>{formatCurrency(budget.total)}</strong></article><article><span><TrendingDown /></span><small>Remaining</small><strong className={budget.remaining < 0 ? "negative" : ""}>{trip.budget ? formatCurrency(budget.remaining) : "Set budget"}</strong></article><article><span><CalendarRange /></span><small>Average per day</small><strong>{formatCurrency(budget.averagePerDay)}</strong></article><article><span><Gauge /></span><small>Trip length</small><strong>{budget.tripDays} days</strong></article></section><BudgetCharts categories={budget.categories} days={budget.days} /><section className="daily-budget-list"><div className="section-heading"><div><p className="eyebrow">Every day accounted for</p><h2>Daily breakdown</h2></div></div><div>{budget.days.map((day) => <article key={day.date}><strong>{day.date}</strong><span>Transport <b>{formatCurrency(day.transport)}</b></span><span>Stay <b>{formatCurrency(day.stay)}</b></span><span>Meals <b>{formatCurrency(day.meals)}</b></span><span>Activities <b>{formatCurrency(day.activities)}</b></span><em>{formatCurrency(day.total)}</em></article>)}</div></section></>;
}
