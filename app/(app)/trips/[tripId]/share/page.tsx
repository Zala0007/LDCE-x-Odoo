import Link from "next/link";
import { ArrowLeft, Copy, Globe2, ShieldCheck, Trash2, Users } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { copyTripAction, removeTripShareAction, setPublicSharingAction, shareUserAction } from "@/app/actions/sharing-actions";
import { PageHeader } from "@/components/page-header";
import { ShareUserForm } from "@/components/sharing/share-user-form";
import { getSharingSettings } from "@/lib/repositories/sharing-repository";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TripSharePage({ params }: { params: Promise<{ tripId: string }> }) {
  const session = await auth(); if (!session?.user?.id) redirect("/login");
  const { tripId } = await params; const trip = await getSharingSettings(tripId, session.user.id); if (!trip) notFound();
  const publicUrl = trip.publicLink ? `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/share/${trip.publicLink.slug}` : null;
  return <><Link className="back-link" href={`/trips/${tripId}`}><ArrowLeft size={16} />Back to {trip.name}</Link><PageHeader eyebrow="Bring others along" title="Share this journey" description="Publish a beautiful read-only itinerary or invite registered travelers with precise access." /><div className="sharing-grid"><section className="sharing-card public-sharing-card"><span className="sharing-icon"><Globe2 /></span><div><h2>Public itinerary</h2><p>Anyone with the link can view the trip, understand its estimated cost, and copy it into their own account.</p></div><form action={setPublicSharingAction.bind(null, tripId)}><input type="hidden" name="enabled" value={trip.publicLink?.isActive ? "false" : "true"} /><button className={trip.publicLink?.isActive ? "button button-secondary" : "button button-primary"} type="submit">{trip.publicLink?.isActive ? "Make private" : "Publish trip"}</button></form>{trip.publicLink?.isActive && publicUrl ? <div className="public-url"><input readOnly value={publicUrl} aria-label="Public itinerary URL" /><Link href={`/share/${trip.publicLink.slug}`} target="_blank">Open ↗</Link></div> : null}</section><section className="sharing-card"><span className="sharing-icon"><Users /></span><div><h2>Invite a traveler</h2><p>Viewers get a private read-only view. Editors can add, update, remove, and reorder itinerary details.</p></div><ShareUserForm action={shareUserAction.bind(null, tripId)} /></section></div><section className="collaborator-list"><div className="section-heading"><div><p className="eyebrow">Private access</p><h2>People with this trip</h2></div></div>{trip.shares.length ? trip.shares.map((share) => <article key={share.id}><span className="avatar">{initials(share.user.name)}</span><div><strong>{share.user.name}</strong><p>{share.user.email}</p></div><span className="role-pill"><ShieldCheck size={13} />{share.role.toLowerCase()}</span><form action={removeTripShareAction.bind(null, tripId, share.id)}><button aria-label={`Remove ${share.user.name}`}><Trash2 size={17} /></button></form></article>) : <p className="activity-empty">Only you can access this private trip right now.</p>}</section><section className="copy-own-card"><Copy /><div><strong>Need a variation?</strong><p>Copy this trip and experiment without changing the original.</p></div><form action={copyTripAction.bind(null, tripId)}><button className="button button-secondary">Duplicate trip</button></form></section></>;
}
