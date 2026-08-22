"use client";

import { useEffect, useState, useTransition } from "react";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, Clock3, GripVertical, MapPin, Plus, Save, Trash2 } from "lucide-react";
import { addBuilderActivityAction, deleteStopAction, removeBuilderActivityAction, reorderActivitiesAction, reorderStopsAction, updateStopAction } from "@/app/actions/itinerary-actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatCurrency, formatDateRange } from "@/lib/utils";

type BuilderActivity = { id: string; activityId: string; date: Date; startTime: string | null; cost: number | null; notes: string | null; activity: { id: string; name: string; durationMinutes: number; estimatedCost: number; category: string } };
type BuilderStop = { id: string; cityId: string; startDate: Date; endDate: Date; transportCost: number; stayCost: number; position: number; city: { id: string; name: string; country: string; activities: Array<{ id: string; name: string; category: string; estimatedCost: number }> }; itineraryActivities: BuilderActivity[] };

function inputDate(date: Date) { return new Date(date).toISOString().slice(0, 10); }

export function ItineraryBuilder({ tripId, initialStops }: { tripId: string; initialStops: BuilderStop[] }) {
  const [stops, setStops] = useState(initialStops);
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  useEffect(() => setStops(initialStops), [initialStops]);

  function onDragEnd(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) return;
    const oldIndex = stops.findIndex((stop) => stop.id === event.active.id);
    const newIndex = stops.findIndex((stop) => stop.id === event.over?.id);
    const next = arrayMove(stops, oldIndex, newIndex);
    setStops(next);
    startTransition(() => reorderStopsAction(tripId, next.map((stop) => stop.id)));
  }

  return <div className={pending ? "builder-list builder-saving" : "builder-list"}>
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={stops.map((stop) => stop.id)} strategy={verticalListSortingStrategy}>
        {stops.map((stop, index) => <SortableStop key={stop.id} tripId={tripId} stop={stop} index={index} />)}
      </SortableContext>
    </DndContext>
    {!stops.length ? <div className="builder-empty"><MapPin size={30} /><h2>Your route is wide open.</h2><p>Add the first city using the form, then shape the details here.</p></div> : null}
    {pending ? <span className="saving-indicator"><Save size={14} />Saving order…</span> : null}
  </div>;
}

function SortableStop({ tripId, stop, index }: { tripId: string; stop: BuilderStop; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stop.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? .6 : 1 };
  return <article ref={setNodeRef} style={style} className="builder-stop">
    <header className="builder-stop-header"><button className="drag-handle" type="button" aria-label={`Reorder ${stop.city.name}`} {...attributes} {...listeners}><GripVertical /></button><span className="stop-number">{String(index + 1).padStart(2, "0")}</span><div><p>{stop.city.country}</p><h2>{stop.city.name}</h2></div><div className="stop-date"><CalendarDays size={16} />{formatDateRange(new Date(stop.startDate), new Date(stop.endDate))}</div></header>
    <div className="builder-stop-content">
      <div className="stop-cost-row"><span>Transport <strong>{formatCurrency(stop.transportCost)}</strong></span><span>Stay <strong>{stop.stayCost ? formatCurrency(stop.stayCost) : "Auto estimate"}</strong></span></div>
      <ActivitySorter tripId={tripId} stopId={stop.id} initialActivities={stop.itineraryActivities} />
      <details className="builder-add"><summary><Plus size={17} />Add an activity</summary><form action={addBuilderActivityAction.bind(null, tripId, stop.id)} className="compact-form"><label><span>Experience</span><select name="activityId" required defaultValue=""><option value="" disabled>Choose in {stop.city.name}</option>{stop.city.activities.map((activity) => <option key={activity.id} value={activity.id}>{activity.name} · {formatCurrency(activity.estimatedCost)}</option>)}</select></label><label><span>Date</span><input name="date" type="date" min={inputDate(stop.startDate)} max={inputDate(stop.endDate)} defaultValue={inputDate(stop.startDate)} required /></label><label><span>Start time</span><input name="startTime" type="time" defaultValue="09:00" /></label><label><span>Custom cost</span><input name="cost" type="number" min="0" placeholder="Use estimate" /></label><label className="compact-wide"><span>Notes</span><input name="notes" placeholder="Tickets, meeting point, or a reminder" /></label><button className="button button-primary" type="submit"><Plus size={16} />Add</button></form></details>
      <details className="builder-edit"><summary>Edit stop details</summary><form action={updateStopAction.bind(null, tripId, stop.id)} className="compact-form"><input type="hidden" name="cityId" value={stop.cityId} /><label><span>Start date</span><input name="startDate" type="date" defaultValue={inputDate(stop.startDate)} required /></label><label><span>End date</span><input name="endDate" type="date" defaultValue={inputDate(stop.endDate)} required /></label><label><span>Transport</span><input name="transportCost" type="number" min="0" defaultValue={stop.transportCost} /></label><label><span>Total stay</span><input name="stayCost" type="number" min="0" defaultValue={stop.stayCost} /></label><button className="button button-secondary" type="submit"><Save size={16} />Save stop</button></form><div className="delete-stop-row"><ConfirmDialog title={`Remove ${stop.city.name}?`} description="Activities assigned to this stop will also be removed." action={deleteStopAction.bind(null, tripId, stop.id)} trigger={<span><Trash2 size={15} />Remove this stop</span>} /></div></details>
    </div>
  </article>;
}

function ActivitySorter({ tripId, stopId, initialActivities }: { tripId: string; stopId: string; initialActivities: BuilderActivity[] }) {
  const [items, setItems] = useState(initialActivities);
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  useEffect(() => setItems(initialActivities), [initialActivities]);
  function onDragEnd(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) return;
    const next = arrayMove(items, items.findIndex((item) => item.id === event.active.id), items.findIndex((item) => item.id === event.over?.id));
    setItems(next);
    startTransition(() => reorderActivitiesAction(tripId, stopId, next.map((item) => item.id)));
  }
  if (!items.length) return <p className="activity-empty">No activities yet. Add something memorable below.</p>;
  return <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}><SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}><div className={pending ? "builder-activities builder-saving" : "builder-activities"}>{items.map((item) => <SortableActivity key={item.id} tripId={tripId} item={item} />)}</div></SortableContext></DndContext>;
}

function SortableActivity({ tripId, item }: { tripId: string; item: BuilderActivity }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? .55 : 1 }} className="builder-activity"><button type="button" className="activity-drag" aria-label={`Reorder ${item.activity.name}`} {...attributes} {...listeners}><GripVertical size={17} /></button><span className="activity-category-dot" /><div><strong>{item.activity.name}</strong><p><Clock3 size={13} />{item.startTime || "Flexible"} · {item.activity.durationMinutes} min</p></div><span>{formatCurrency(item.cost ?? item.activity.estimatedCost)}</span><form action={removeBuilderActivityAction.bind(null, tripId, item.id)}><button type="submit" aria-label={`Remove ${item.activity.name}`}><Trash2 size={16} /></button></form></div>;
}
