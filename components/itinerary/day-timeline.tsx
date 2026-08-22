import { eachDayOfInterval, format, isSameDay } from "date-fns";
import { MapPin, Route } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type TimelineStop = { id: string; startDate: Date; endDate: Date; city: { name: string; country: string }; itineraryActivities: Array<{ id: string; date: Date; startTime: string | null; cost: number | null; activity: { name: string; durationMinutes: number; estimatedCost: number; category: string } }> };

export function DayTimeline({ startDate, endDate, stops }: { startDate: Date; endDate: Date; stops: TimelineStop[] }) {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  return <div className="day-timeline">{days.map((day, index) => {
    const activeStops = stops.filter((stop) => day >= stop.startDate && day <= stop.endDate);
    const activities = activeStops.flatMap((stop) => stop.itineraryActivities.filter((item) => isSameDay(item.date, day)).map((item) => ({ ...item, city: stop.city.name })));
    const dayTotal = activities.reduce((sum, item) => sum + (item.cost ?? item.activity.estimatedCost), 0);
    return <article key={day.toISOString()} className="timeline-day"><div className="timeline-rail"><span>{index + 1}</span><i /></div><div className="timeline-day-content"><header><div><p>{format(day, "EEEE")}</p><h3>{format(day, "MMMM d")}</h3></div><div>{activeStops.map((stop) => <span key={stop.id}><MapPin size={13} />{stop.city.name}</span>)}</div></header>{activities.length ? <div className="timeline-activities">{activities.map((item) => <div key={item.id}><span className="timeline-time">{item.startTime || "Flexible"}</span><i /><div><strong>{item.activity.name}</strong><p>{item.city} · {item.activity.category} · {item.activity.durationMinutes} min</p></div><b>{formatCurrency(item.cost ?? item.activity.estimatedCost)}</b></div>)}</div> : <div className="timeline-open"><Route size={17} /><span>Open time to wander, rest, or add another experience.</span></div>}<footer><span>Activity total</span><strong>{formatCurrency(dayTotal)}</strong></footer></div></article>;
  })}</div>;
}
