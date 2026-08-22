"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { addItineraryActivity, createStop, deleteStop, ItineraryValidationError, removeItineraryActivity, reorderActivities, reorderStops, updateStop } from "@/lib/services/itinerary-service";
import { entityIdSchema } from "@/lib/validators/discovery";
import { itineraryActivityInputSchema, orderedIdsSchema, stopInputSchema } from "@/lib/validators/itinerary";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

function id(value: string) {
  const parsed = entityIdSchema.safeParse(value);
  if (!parsed.success) throw new ItineraryValidationError("Invalid record identifier");
  return parsed.data;
}

function refreshTrip(tripId: string) {
  revalidatePath(`/trips/${tripId}`);
  revalidatePath(`/trips/${tripId}/builder`);
  revalidatePath(`/trips/${tripId}/budget`);
  revalidatePath(`/trips/${tripId}/calendar`);
}

function stopFields(formData: FormData) {
  return stopInputSchema.safeParse({ cityId: formData.get("cityId"), startDate: formData.get("startDate"), endDate: formData.get("endDate"), transportCost: formData.get("transportCost") || 0, stayCost: formData.get("stayCost") || 0 });
}

function activityFields(formData: FormData) {
  return itineraryActivityInputSchema.safeParse({ activityId: formData.get("activityId"), date: formData.get("date"), startTime: formData.get("startTime"), cost: formData.get("cost") || undefined, notes: formData.get("notes") });
}

function fail(tripId: string, message: string): never {
  redirect(`/trips/${tripId}/builder?error=${encodeURIComponent(message)}`);
}

export async function createStopAction(tripId: string, formData: FormData) {
  const ownerId = await requireUserId();
  const parsed = stopFields(formData);
  if (!parsed.success) fail(tripId, parsed.error.issues[0]?.message ?? "Check the stop details");
  try { await createStop(ownerId, id(tripId), parsed.data); }
  catch (error) { fail(tripId, error instanceof ItineraryValidationError ? error.message : "Could not add stop"); }
  refreshTrip(tripId);
}

export async function updateStopAction(tripId: string, stopId: string, formData: FormData) {
  const ownerId = await requireUserId();
  const parsed = stopFields(formData);
  if (!parsed.success) fail(tripId, parsed.error.issues[0]?.message ?? "Check the stop details");
  try { await updateStop(ownerId, id(tripId), id(stopId), parsed.data); }
  catch (error) { fail(tripId, error instanceof ItineraryValidationError ? error.message : "Could not update stop"); }
  refreshTrip(tripId);
}

export async function deleteStopAction(tripId: string, stopId: string) {
  const ownerId = await requireUserId();
  try { await deleteStop(ownerId, id(tripId), id(stopId)); }
  catch (error) { fail(tripId, error instanceof ItineraryValidationError ? error.message : "Could not remove stop"); }
  refreshTrip(tripId);
}

export async function reorderStopsAction(tripId: string, orderedIds: string[]) {
  const ownerId = await requireUserId();
  const parsed = orderedIdsSchema.safeParse(orderedIds);
  if (!parsed.success) throw new Error("Invalid stop order");
  await reorderStops(ownerId, id(tripId), parsed.data);
  refreshTrip(tripId);
}

export async function addBuilderActivityAction(tripId: string, stopId: string, formData: FormData) {
  const ownerId = await requireUserId();
  const parsed = activityFields(formData);
  if (!parsed.success) fail(tripId, parsed.error.issues[0]?.message ?? "Check the activity details");
  try { await addItineraryActivity(ownerId, id(tripId), id(stopId), parsed.data); }
  catch (error) { fail(tripId, error instanceof ItineraryValidationError ? error.message : "Could not add activity"); }
  refreshTrip(tripId);
}

export async function removeBuilderActivityAction(tripId: string, itineraryActivityId: string) {
  const ownerId = await requireUserId();
  try { await removeItineraryActivity(ownerId, id(tripId), id(itineraryActivityId)); }
  catch (error) { fail(tripId, error instanceof ItineraryValidationError ? error.message : "Could not remove activity"); }
  refreshTrip(tripId);
}

export async function reorderActivitiesAction(tripId: string, stopId: string, orderedIds: string[]) {
  const ownerId = await requireUserId();
  const parsed = orderedIdsSchema.safeParse(orderedIds);
  if (!parsed.success) throw new Error("Invalid activity order");
  await reorderActivities(ownerId, id(tripId), id(stopId), parsed.data);
  refreshTrip(tripId);
}
