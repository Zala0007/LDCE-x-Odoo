import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { MapPin, Search, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createCommunityPostAction, deleteCommunityPostAction } from "@/app/actions/product-actions";
import { CommunityPostForm } from "@/components/community/community-post-form";
import { PageHeader } from "@/components/page-header";
import { db } from "@/lib/db";
import { listCommunityPosts } from "@/lib/repositories/product-repository";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CommunityPage({ searchParams }: { searchParams: Promise<{ q?: string; sort?: string }> }) {
  const session = await auth(); if (!session?.user?.id) redirect("/login"); const query = await searchParams; const q = query.q?.slice(0,100) ?? "";
  const [posts,trips] = await Promise.all([listCommunityPosts({ q, sort: query.sort === "popular" ? "popular" : "recent" }),db.trip.findMany({ where: { ownerId: session.user.id }, select: { id: true, name: true }, orderBy: { updatedAt: "desc" } })]);
  return <><PageHeader eyebrow="Stories from the road" title="Traveler community" description="Share lived experience, find useful details, and let another traveler’s story shape your next one." /><form className="community-search"><label><Search size={17} /><input name="q" defaultValue={q} placeholder="Search stories, travelers, or places…" /></label><select name="sort" defaultValue={query.sort ?? "recent"}><option value="recent">Most recent</option><option value="popular">Recently active</option></select><button className="button button-primary">Search</button></form><div className="community-layout"><aside className="community-compose"><p className="eyebrow">Add to the map</p><h2>Share a travel story</h2><p>Practical, honest details are the most helpful.</p><CommunityPostForm trips={trips} action={createCommunityPostAction} /></aside><section className="community-feed">{posts.length ? posts.map((post) => <article key={post.id} className="community-post"><header><span className="avatar">{initials(post.author.name)}</span><div><strong>{post.author.name}</strong><p>{[post.author.city,post.author.country].filter(Boolean).join(", ") || "GlobeTrotter traveler"} · {formatDistanceToNow(post.createdAt,{addSuffix:true})}</p></div>{post.authorId === session.user.id ? <form action={deleteCommunityPostAction.bind(null,post.id)}><button aria-label={`Delete ${post.title}`}><Trash2 size={16} /></button></form> : null}</header>{post.image ? <div className="community-image" style={{backgroundImage:`url(${post.image})`}} /> : null}<div className="community-post-body"><h2>{post.title}</h2><p>{post.content}</p>{post.trip ? <Link href={`/trips/${post.trip.id}`}><MapPin size={14} />Trip: {post.trip.name}</Link> : null}</div></article>) : <div className="search-empty"><span className="search-empty-icon">✦</span><h2>No stories found</h2><p>Try another search—or be the first to share one.</p></div>}</section></div></>;
}
