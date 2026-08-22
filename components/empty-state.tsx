import Link from "next/link";
import { ArrowRight, Luggage } from "lucide-react";

export function EmptyState() {
  return <section className="empty-state"><div className="empty-illustration"><span className="empty-sun" /><span className="empty-hill hill-one" /><span className="empty-hill hill-two" /><Luggage size={38} /></div><p className="eyebrow">A blank map</p><h2>Where will you go first?</h2><p>Start with the dates and a dream. You can shape every stop as the journey unfolds.</p><Link className="button button-primary" href="/trips/new">Plan your first trip <ArrowRight size={17} /></Link></section>;
}
