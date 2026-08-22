import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { addCityToTripAction, toggleSavedCityAction } from "@/app/actions/discovery-actions";
import { CitySearchFilters } from "@/components/discovery/city-search-filters";
import { DestinationCard } from "@/components/discovery/destination-card";
import { PageHeader } from "@/components/page-header";
import { cityFilterOptions, listCities, savedCityIds, tripCityIds } from "@/lib/repositories/discovery-repository";
import { findOwnedTrip } from "@/lib/repositories/trip-repository";
import { citySearchSchema } from "@/lib/validators/discovery";

export const dynamic = "force-dynamic";

export default async function TripCitiesPage({ params, searchParams }: { params: Promise<{ tripId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const [{ tripId }, raw] = await Promise.all([params, searchParams]);
  const trip = await findOwnedTrip(tripId, session.user.id);
  if (!trip) notFound();
  const value = (key: string) => typeof raw[key] === "string" ? raw[key] as string : "";
  const filters = citySearchSchema.parse({ q: value("q"), country: value("country"), region: value("region") });
  const [cities, options, saved, added] = await Promise.all([listCities(filters), cityFilterOptions(), savedCityIds(session.user.id), tripCityIds(tripId)]);
  const route = `/trips/${tripId}/cities`;
  return <><Link className="back-link" href={`/trips/${tripId}`}><ArrowLeft size={16} />Back to {trip.name}</Link><PageHeader eyebrow="Shape the route" title="Add cities" description="Choose the places that belong in this journey. Initial dates follow the trip and can be refined in the itinerary builder." action={added.size ? <Link className="button button-secondary" href={`/trips/${tripId}/activities`}><Sparkles size={17} />Find activities</Link> : undefined} /><CitySearchFilters action={route} query={filters.q} country={filters.country} region={filters.region} countries={options.countries} regions={options.regions} /><div className="destination-grid">{cities.map((city) => <DestinationCard key={city.id} city={city} saved={saved.has(city.id)} added={added.has(city.id)} saveAction={toggleSavedCityAction.bind(null, city.id)} addAction={addCityToTripAction.bind(null, tripId, city.id)} />)}</div></>;
}
