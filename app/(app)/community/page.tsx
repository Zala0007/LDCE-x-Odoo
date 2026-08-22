import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { MapPin, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  createCommunityPostAction,
  deleteCommunityPostAction,
} from "@/app/actions/product-actions";
import { CommunityFilters } from "@/components/community/community-filters";
import { CommunityPostForm } from "@/components/community/community-post-form";
import { PageHeader } from "@/components/page-header";
import { db } from "@/lib/db";
import { listCommunityPosts } from "@/lib/repositories/product-repository";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const query = await searchParams;
  const value = (key: string) =>
    typeof query[key] === "string" ? String(query[key]).slice(0, 100) : "";
  const values = {
    q: value("q"),
    country: value("country"),
    scope: ["trip", "standalone"].includes(value("scope"))
      ? value("scope")
      : "",
    sort: ["recent", "active", "oldest"].includes(value("sort"))
      ? value("sort")
      : "recent",
    group: value("group") === "country" ? "country" : "none",
  };
  const [posts, trips, countryRows] = await Promise.all([
    listCommunityPosts({
      q: values.q,
      country: values.country,
      scope:
        values.scope === "trip" || values.scope === "standalone"
          ? values.scope
          : undefined,
      sort:
        values.sort === "active" || values.sort === "oldest"
          ? values.sort
          : "recent",
    }),
    db.trip.findMany({
      where: { ownerId: session.user.id },
      select: { id: true, name: true },
      orderBy: { updatedAt: "desc" },
    }),
    db.user.findMany({
      where: {
        country: { not: null },
        communityPosts: { some: { isPublic: true } },
      },
      distinct: ["country"],
      select: { country: true },
      orderBy: { country: "asc" },
    }),
  ]);
  const countries = countryRows.flatMap((row) =>
    row.country ? [row.country] : [],
  );
  const renderPost = (post: (typeof posts)[number]) => {
    const tripHref = post.trip
      ? post.authorId === session.user.id
        ? `/trips/${post.trip.id}`
        : post.trip.publicLink?.isActive
          ? `/share/${post.trip.publicLink.slug}`
          : null
      : null;
    return (
      <article key={post.id} className="community-post">
        <header>
          <span className="avatar">{initials(post.author.name)}</span>
          <div>
            <strong>{post.author.name}</strong>
            <p>
              {[post.author.city, post.author.country]
                .filter(Boolean)
                .join(", ") || "GlobeTrotter traveler"}{" "}
              · {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </p>
          </div>
          {post.authorId === session.user.id ? (
            <form action={deleteCommunityPostAction.bind(null, post.id)}>
              <button aria-label={`Delete ${post.title}`}>
                <Trash2 size={16} />
              </button>
            </form>
          ) : null}
        </header>
        {post.image ? (
          <div
            aria-label={`Photo for ${post.title}`}
            className="community-image"
            role="img"
            style={{
              backgroundImage: `linear-gradient(145deg,rgba(20,66,54,.06),rgba(20,66,54,.3)),url(${post.image})`,
            }}
          />
        ) : null}
        <div className="community-post-body">
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {post.trip ? (
            tripHref ? (
              <Link href={tripHref}>
                <MapPin size={14} />
                Trip: {post.trip.name}
              </Link>
            ) : (
              <span className="community-trip-tag">
                <MapPin size={14} />
                Trip: {post.trip.name}
              </span>
            )
          ) : null}
        </div>
      </article>
    );
  };
  const groups =
    values.group === "country"
      ? Array.from(
          posts.reduce((grouped, post) => {
            const country = post.author.country || "Around the world";
            grouped.set(country, [...(grouped.get(country) ?? []), post]);
            return grouped;
          }, new Map<string, typeof posts>()),
        )
      : [];

  return (
    <>
      <PageHeader
        eyebrow="Stories from the road"
        title="Traveler community"
        description="Search, filter, group, and share practical experiences from journeys around the world."
      />
      <CommunityFilters countries={countries} values={values} />
      <div className="community-layout">
        <aside className="community-compose">
          <p className="eyebrow">Add to the map</p>
          <h2>Share a travel story</h2>
          <p>Practical, honest details are the most helpful.</p>
          <CommunityPostForm trips={trips} action={createCommunityPostAction} />
        </aside>
        <section className="community-feed">
          {posts.length ? (
            values.group === "country" ? (
              groups.map(([country, items]) => (
                <section className="community-group" key={country}>
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">Traveler stories</p>
                      <h2>{country}</h2>
                    </div>
                    <span>{items.length}</span>
                  </div>
                  {items.map(renderPost)}
                </section>
              ))
            ) : (
              posts.map(renderPost)
            )
          ) : (
            <div className="search-empty">
              <span className="search-empty-icon">✦</span>
              <h2>No stories found</h2>
              <p>Try another combination—or be the first to share one.</p>
              <Link className="button button-secondary" href="/community">
                Clear filters
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
