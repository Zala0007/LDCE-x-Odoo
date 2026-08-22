import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";

export function CitySearchFilters({
  action,
  query,
  country,
  region,
  group = "none",
  sort = "popular",
  countries,
  regions,
}: {
  action: string;
  query?: string;
  country?: string;
  region?: string;
  group?: string;
  sort?: string;
  countries: string[];
  regions: string[];
}) {
  return (
    <form className="search-filters city-filters" action={action} method="get">
      <label className="search-input">
        <Search size={18} />
        <span className="sr-only">Search destinations</span>
        <input
          name="q"
          defaultValue={query}
          placeholder="Search a city, country, or travel mood…"
        />
      </label>
      <label>
        <span className="sr-only">Group destinations</span>
        <select name="group" defaultValue={group}>
          <option value="none">No grouping</option>
          <option value="country">Group by country</option>
          <option value="region">Group by region</option>
        </select>
      </label>
      <label>
        <span className="sr-only">Sort destinations</span>
        <select name="sort" defaultValue={sort}>
          <option value="popular">Most popular</option>
          <option value="name">City name</option>
          <option value="budget">Lowest stay cost</option>
        </select>
      </label>
      <label>
        <span className="sr-only">Country</span>
        <select name="country" defaultValue={country}>
          <option value="">All countries</option>
          {countries.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Region</span>
        <select name="region" defaultValue={region}>
          <option value="">All regions</option>
          {regions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <button className="button button-primary" type="submit">
        <SlidersHorizontal size={16} />
        Filter
      </button>
      {query || country || region || group !== "none" || sort !== "popular" ? (
        <Link
          className="clear-filters"
          href={action}
          aria-label="Clear filters"
        >
          <X size={17} />
        </Link>
      ) : null}
    </form>
  );
}
