import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { toggleSavedCityAction } from "@/app/actions/discovery-actions";
import { CitySearchFilters } from "@/components/discovery/city-search-filters";
import { DestinationCard } from "@/components/discovery/destination-card";
import { PageHeader } from "@/components/page-header";
import {
  cityFilterOptions,
  listCities,
  savedCityIds,
} from "@/lib/repositories/discovery-repository";
import { citySearchSchema } from "@/lib/validators/discovery";

export const dynamic = "force-dynamic";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const raw = await searchParams;
  const value = (key: string) =>
    typeof raw[key] === "string" ? (raw[key] as string) : "";
  const filters = citySearchSchema.parse({
    q: value("q"),
    country: value("country"),
    region: value("region"),
    group: value("group") || undefined,
    sort: value("sort") || undefined,
  });
  const [cities, options, saved] = await Promise.all([
    listCities(filters),
    cityFilterOptions(),
    savedCityIds(session.user.id),
  ]);
  const groups =
    filters.group === "none"
      ? []
      : Array.from(
          cities.reduce((grouped, city) => {
            const key =
              filters.group === "country" ? city.country : city.region;
            grouped.set(key, [...(grouped.get(key) ?? []), city]);
            return grouped;
          }, new Map<string, typeof cities>()),
        );
  const renderCity = (city: (typeof cities)[number]) => (
    <DestinationCard
      key={city.id}
      city={city}
      saved={saved.has(city.id)}
      saveAction={toggleSavedCityAction.bind(null, city.id)}
    />
  );
  return (
    <>
      <PageHeader
        eyebrow="Find your next place"
        title="Explore destinations"
        description="Search by place or feeling, then save the cities that stay with you."
      />
      <CitySearchFilters
        action="/explore"
        query={filters.q}
        country={filters.country}
        region={filters.region}
        group={filters.group}
        sort={filters.sort}
        countries={options.countries}
        regions={options.regions}
      />
      {cities.length && filters.group !== "none" ? (
        <div className="discovery-group-list">
          {groups.map(([label, groupCities]) => (
            <section className="discovery-group" key={label}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Destination collection</p>
                  <h2>{label}</h2>
                </div>
                <span>{groupCities.length} places</span>
              </div>
              <div className="destination-grid">
                {groupCities.map(renderCity)}
              </div>
            </section>
          ))}
        </div>
      ) : cities.length ? (
        <div className="destination-grid">{cities.map(renderCity)}</div>
      ) : (
        <div className="search-empty">
          <span className="search-empty-icon">⌖</span>
          <h2>No places found</h2>
          <p>Try a broader search or clear one of the filters.</p>
        </div>
      )}
    </>
  );
}
