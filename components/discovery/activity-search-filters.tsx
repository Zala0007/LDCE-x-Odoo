import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";

export function ActivitySearchFilters({
  action,
  values,
  cities,
}: {
  action: string;
  values: Record<string, string | undefined>;
  cities: Array<{ id: string; name: string }>;
}) {
  const active = Object.entries(values).some(([key, value]) =>
    key === "group"
      ? value !== "none"
      : key === "sort"
        ? value !== "popular"
        : Boolean(value),
  );
  return (
    <form
      className="search-filters activity-filters"
      action={action}
      method="get"
    >
      <label className="search-input">
        <Search size={18} />
        <span className="sr-only">Search activities</span>
        <input
          name="q"
          defaultValue={values.q}
          placeholder="Try food, temples, cycling…"
        />
      </label>
      <label>
        <span className="sr-only">City</span>
        <select name="city" defaultValue={values.city}>
          <option value="">Every trip city</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Category</span>
        <select name="category" defaultValue={values.category}>
          <option value="">All interests</option>
          {["Culture", "Food", "Nature", "Adventure"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Maximum cost</span>
        <select name="maxCost" defaultValue={values.maxCost}>
          <option value="">Any cost</option>
          <option value="1000">Under ₹1,000</option>
          <option value="2500">Under ₹2,500</option>
          <option value="5000">Under ₹5,000</option>
        </select>
      </label>
      <label>
        <span className="sr-only">Maximum duration</span>
        <select name="maxDuration" defaultValue={values.maxDuration}>
          <option value="">Any duration</option>
          <option value="120">Up to 2 hours</option>
          <option value="180">Up to 3 hours</option>
          <option value="300">Up to 5 hours</option>
        </select>
      </label>
      <label>
        <span className="sr-only">Group activities</span>
        <select name="group" defaultValue={values.group}>
          <option value="none">No grouping</option>
          <option value="city">Group by city</option>
        </select>
      </label>
      <label>
        <span className="sr-only">Sort activities</span>
        <select name="sort" defaultValue={values.sort}>
          <option value="popular">Most popular</option>
          <option value="name">Activity name</option>
          <option value="cost">Lowest cost</option>
          <option value="duration">Shortest duration</option>
        </select>
      </label>
      <button className="button button-primary" type="submit">
        <SlidersHorizontal size={16} />
        Filter
      </button>
      {active ? (
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
