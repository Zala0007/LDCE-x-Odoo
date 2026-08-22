import Link from "next/link";
import { Bookmark, BookmarkCheck, MapPin, Plus } from "lucide-react";
import type { City } from "@prisma/client";
import { BudgetBadge, PopularityBadge } from "@/components/discovery/badges";
import { formatCurrency } from "@/lib/utils";

export function DestinationCard({ city, saved, added, saveAction, addAction, href }: { city: City; saved: boolean; added?: boolean; saveAction: () => Promise<void>; addAction?: () => Promise<void>; href?: string }) {
  return <article className="destination-card">
    <div className="destination-image" style={{ backgroundImage: `linear-gradient(0deg, rgba(13,38,31,.48), transparent 60%), url(${city.image})` }}>
      <form action={saveAction}><button className="save-button" type="submit" aria-label={saved ? `Remove ${city.name} from saved destinations` : `Save ${city.name}`}>{saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}</button></form>
      <div className="destination-place"><span><MapPin size={14} />{city.country}</span><h2>{city.name}</h2></div>
    </div>
    <div className="destination-body">
      <div className="badge-row"><BudgetBadge costIndex={city.costIndex} /><PopularityBadge score={city.popularityScore} /></div>
      <p>{city.description}</p>
      <div className="destination-costs"><span><small>Meals from</small><strong>{formatCurrency(city.estimatedMealCost)}</strong></span><span><small>Stays from</small><strong>{formatCurrency(city.estimatedStayCost)}</strong></span></div>
      {addAction ? <form action={addAction}><button className={added ? "button button-secondary button-block" : "button button-primary button-block"} type="submit" disabled={added}>{added ? "Added to trip" : <><Plus size={17} /> Add to trip</>}</button></form> : href ? <Link className="button button-secondary button-block" href={href}>Explore activities →</Link> : null}
    </div>
  </article>;
}
