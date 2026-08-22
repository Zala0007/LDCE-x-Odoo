import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";

export function CommunityFilters({
  countries,
  values,
}: {
  countries: string[];
  values: {
    q: string;
    country: string;
    scope: string;
    sort: string;
    group: string;
  };
}) {
  const active =
    values.q ||
    values.country ||
    values.scope ||
    values.sort !== "recent" ||
    values.group !== "none";
  return (
    <form className="search-filters community-search" method="get">
      <label className="search-input">
        <Search size={17} />
        <span className="sr-only">Search community stories</span>
        <input
          name="q"
          defaultValue={values.q}
          placeholder="Search stories, travelers, or places…"
        />
      </label>
      <label>
        <span className="sr-only">Country</span>
        <select name="country" defaultValue={values.country}>
          <option value="">All countries</option>
          {countries.map((country) => (
            <option key={country}>{country}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Story type</span>
        <select name="scope" defaultValue={values.scope}>
          <option value="">All stories</option>
          <option value="trip">Linked trips</option>
          <option value="standalone">Travel tips</option>
        </select>
      </label>
      <label>
        <span className="sr-only">Group stories</span>
        <select name="group" defaultValue={values.group}>
          <option value="none">No grouping</option>
          <option value="country">Group by country</option>
        </select>
      </label>
      <label>
        <span className="sr-only">Sort stories</span>
        <select name="sort" defaultValue={values.sort}>
          <option value="recent">Most recent</option>
          <option value="active">Recently active</option>
          <option value="oldest">Oldest first</option>
        </select>
      </label>
      <button className="button button-primary" type="submit">
        <SlidersHorizontal size={16} />
        Apply
      </button>
      {active ? (
        <Link
          aria-label="Clear community filters"
          className="clear-filters"
          href="/community"
        >
          <X size={17} />
        </Link>
      ) : null}
    </form>
  );
}
