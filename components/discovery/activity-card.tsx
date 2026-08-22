import { Clock3, IndianRupee, MapPin, Plus, Trash2 } from "lucide-react";
import type { Activity } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";

type ActivityWithCity = Activity & { city: { id: string; name: string; country: string } };

export function ActivityCard({ activity, addedId, canAdd, addAction, removeAction }: { activity: ActivityWithCity; addedId?: string; canAdd: boolean; addAction: () => Promise<void>; removeAction?: () => Promise<void> }) {
  return <article className="activity-card">
    <div className="activity-image" style={{ backgroundImage: `url(${activity.image})` }}><span>{activity.category}</span></div>
    <div className="activity-body">
      <p className="activity-location"><MapPin size={14} />{activity.city.name}, {activity.city.country}</p>
      <h2>{activity.name}</h2><p>{activity.description}</p>
      <div className="activity-meta"><span><Clock3 size={15} />{Math.floor(activity.durationMinutes / 60)}h {activity.durationMinutes % 60 ? `${activity.durationMinutes % 60}m` : ""}</span><span><IndianRupee size={15} />{formatCurrency(activity.estimatedCost)}</span></div>
      {addedId && removeAction ? <form action={removeAction}><button className="button button-secondary button-block activity-remove" type="submit"><Trash2 size={16} />Remove</button></form> : <form action={addAction}><button className="button button-primary button-block" type="submit" disabled={!canAdd}>{canAdd ? <><Plus size={16} />Add to itinerary</> : "Add city first"}</button></form>}
    </div>
  </article>;
}
