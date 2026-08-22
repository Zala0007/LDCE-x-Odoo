import Link from "next/link";
import { Bookmark, Compass } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { toggleSavedCityAction } from "@/app/actions/discovery-actions";
import { DestinationCard } from "@/components/discovery/destination-card";
import { PageHeader } from "@/components/page-header";
import { listSavedCities } from "@/lib/repositories/discovery-repository";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const saved = await listSavedCities(session.user.id);
  return <><PageHeader eyebrow="Your someday list" title="Saved destinations" description="A personal shelf of places that caught your eye." action={<Link className="button button-secondary" href="/explore"><Compass size={17} />Explore more</Link>} />{saved.length ? <div className="destination-grid">{saved.map(({ city }) => <DestinationCard key={city.id} city={city} saved saveAction={toggleSavedCityAction.bind(null, city.id)} />)}</div> : <section className="empty-state"><div className="saved-empty-icon"><Bookmark size={32} /></div><p className="eyebrow">Nothing tucked away yet</p><h2>Save a place for later.</h2><p>Browse hand-picked cities and tap the bookmark when somewhere feels right.</p><Link className="button button-primary" href="/explore">Explore destinations →</Link></section>}</>;
}
