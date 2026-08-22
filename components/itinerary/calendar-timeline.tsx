"use client";

import { useEffect, useState, useTransition } from "react";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { eachDayOfInterval, eachMonthOfInterval, endOfMonth, format, getDay, isSameDay, startOfMonth } from "date-fns";
import { CalendarDays, Clock3, GripVertical, List, MapPin, Pencil } from "lucide-react";
import Link from "next/link";
import { reorderActivitiesAction } from "@/app/actions/itinerary-actions";
import { formatCurrency } from "@/lib/utils";

type CalendarActivity = { id: string; date: Date; startTime: string | null; cost: number | null; activity: { name: string; category: string; estimatedCost: number; durationMinutes: number } };
type CalendarStop = { id: string; startDate: Date; endDate: Date; city: { name: string }; itineraryActivities: CalendarActivity[] };

export function CalendarTimeline({ tripId, startDate, endDate, initialStops }: { tripId: string; startDate: Date; endDate: Date; initialStops: CalendarStop[] }) {
  const [mode, setMode] = useState<"calendar" | "timeline">("calendar");
  const days = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) });
  const months = eachMonthOfInterval({ start: new Date(startDate), end: new Date(endDate) });
  return <div><div className="view-switch" role="group" aria-label="Itinerary view"><button className={mode === "calendar" ? "active" : ""} onClick={() => setMode("calendar")}><CalendarDays size={16} />Calendar</button><button className={mode === "timeline" ? "active" : ""} onClick={() => setMode("timeline")}><List size={16} />Timeline</button></div>{mode === "calendar" ? <div className="calendar-months">{months.map((month) => <CalendarMonth key={month.toISOString()} month={month} tripStart={new Date(startDate)} tripEnd={new Date(endDate)} stops={initialStops} />)}</div> : <div className="calendar-timeline-list">{initialStops.map((stop) => <StopTimelineOrder key={stop.id} tripId={tripId} stop={stop} />)}{!initialStops.length ? <p className="activity-empty">Add a stop in the builder to begin the timeline.</p> : null}</div>}<div className="calendar-edit"><Link className="button button-primary" href={`/trips/${tripId}/builder`}><Pencil size={16} />Quick edit in builder</Link><span>{days.length} travel days</span></div></div>;
}

function CalendarMonth({ month, tripStart, tripEnd, stops }: { month: Date; tripStart: Date; tripEnd: Date; stops: CalendarStop[] }) {
  const first = startOfMonth(month);
  const monthDays = eachDayOfInterval({ start: first, end: endOfMonth(month) });
  const blanks = Array.from({ length: getDay(first) });
  return <section className="calendar-month"><h2>{format(month, "MMMM yyyy")}</h2><div className="calendar-weekdays">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{blanks.map((_, index) => <span key={`blank-${index}`} className="calendar-blank" />)}{monthDays.map((day) => {
    const inTrip = day >= tripStart && day <= tripEnd;
    const dayStops = stops.filter((stop) => day >= new Date(stop.startDate) && day <= new Date(stop.endDate));
    const activities = dayStops.flatMap((stop) => stop.itineraryActivities.filter((item) => isSameDay(new Date(item.date), day)));
    return <article key={day.toISOString()} className={inTrip ? "calendar-day in-trip" : "calendar-day"}><span className="calendar-number">{format(day,"d")}</span>{dayStops.slice(0,2).map((stop) => <small key={stop.id}><MapPin size={10} />{stop.city.name}</small>)}{activities.length ? <strong>{activities.length} {activities.length === 1 ? "plan" : "plans"}</strong> : null}</article>;
  })}</div></section>;
}

function StopTimelineOrder({ tripId, stop }: { tripId: string; stop: CalendarStop }) {
  const [items, setItems] = useState(stop.itineraryActivities);
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  useEffect(() => setItems(stop.itineraryActivities), [stop.itineraryActivities]);
  function onDragEnd(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) return;
    const next = arrayMove(items, items.findIndex((item) => item.id === event.active.id), items.findIndex((item) => item.id === event.over?.id));
    setItems(next);
    startTransition(() => reorderActivitiesAction(tripId, stop.id, next.map((item) => item.id)));
  }
  return <details className="timeline-stop" open><summary><span><MapPin size={17} />{stop.city.name}</span><small>{format(new Date(stop.startDate), "MMM d")} – {format(new Date(stop.endDate), "MMM d")}</small></summary>{items.length ? <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}><SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}><div className={pending ? "timeline-sort-list builder-saving" : "timeline-sort-list"}>{items.map((item) => <SortableCalendarActivity key={item.id} item={item} />)}</div></SortableContext></DndContext> : <p className="activity-empty">No activities planned for this stop.</p>}</details>;
}

function SortableCalendarActivity({ item }: { item: CalendarActivity }) {
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id: item.id });
  return <article ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}><button type="button" aria-label={`Reorder ${item.activity.name}`} {...attributes} {...listeners}><GripVertical size={17} /></button><time><b>{format(new Date(item.date), "MMM d")}</b><span><Clock3 size={12} />{item.startTime || "Flexible"}</span></time><div><strong>{item.activity.name}</strong><p>{item.activity.category} · {item.activity.durationMinutes} minutes</p></div><em>{formatCurrency(item.cost ?? item.activity.estimatedCost)}</em></article>;
}
