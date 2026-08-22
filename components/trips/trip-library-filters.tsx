import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";

export function TripLibraryFilters({
  values,
}: {
  values: { q: string; status: string; sort: string; group: string };
}) {
  const active =
    values.q ||
    values.status ||
    values.sort !== "start" ||
    values.group !== "status";
  return (
    <form
      action="/trips"
      className="search-filters trip-library-filters"
      method="get"
    >
      <label className="search-input">
        <Search size={18} />
        <span className="sr-only">Search trips</span>
        <input
          defaultValue={values.q}
          name="q"
          placeholder="Search trips by name or story…"
        />
      </label>
      <label>
        <span className="sr-only">Trip status</span>
        <select defaultValue={values.status} name="status">
          <option value="">All stages</option>
          <option value="ongoing">Ongoing</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="draft">Drafts</option>
        </select>
      </label>
      <label>
        <span className="sr-only">Group trips</span>
        <select defaultValue={values.group} name="group">
          <option value="status">Group by stage</option>
          <option value="none">No grouping</option>
        </select>
      </label>
      <label>
        <span className="sr-only">Sort trips</span>
        <select defaultValue={values.sort} name="sort">
          <option value="start">Start date</option>
          <option value="updated">Recently updated</option>
          <option value="name">Trip name</option>
          <option value="budget">Highest budget</option>
        </select>
      </label>
      <button className="button button-primary" type="submit">
        <SlidersHorizontal size={16} />
        Apply
      </button>
      {active ? (
        <Link
          aria-label="Clear trip filters"
          className="clear-filters"
          href="/trips"
        >
          <X size={17} />
        </Link>
      ) : null}
    </form>
  );
}
