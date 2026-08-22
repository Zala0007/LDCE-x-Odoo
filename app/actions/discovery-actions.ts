"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { addActivityToOwnedTrip, addCityToOwnedTrip, removeActivityFromOwnedTrip, toggleSavedCity } from "@/lib/repositories/discovery-repository";
import { entityIdSchema } from "@/lib/validators/discovery";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

function validId(value: string) {
  const parsed = entityIdSchema.safeParse(value);
  if (!parsed.success) throw new Error("Invalid request");
  return parsed.data;
}

export async function toggleSavedCityAction(cityId: string) {
  const userId = await requireUserId();
  await toggleSavedCity(userId, validId(cityId));
  revalidatePath("/dashboard");
  revalidatePath("/explore");
  revalidatePath("/saved");
}

export async function addCityToTripAction(tripId: string, cityId: string) {
  const userId = await requireUserId();
  const result = await addCityToOwnedTrip(userId, validId(tripId), validId(cityId));
  if (!result) throw new Error("Trip or city was not found");
  revalidatePath(`/trips/${tripId}`);
  revalidatePath(`/trips/${tripId}/cities`);
  revalidatePath(`/trips/${tripId}/activities`);
}

export async function addActivityToTripAction(tripId: string, activityId: string) {
  const userId = await requireUserId();
  const result = await addActivityToOwnedTrip(userId, validId(tripId), validId(activityId));
  if (!result) throw new Error("Add the activity's city to your trip first");
  revalidatePath(`/trips/${tripId}/activities`);
}

export async function removeActivityFromTripAction(tripId: string, itineraryActivityId: string) {
  const userId = await requireUserId();
  await removeActivityFromOwnedTrip(userId, validId(tripId), validId(itineraryActivityId));
  revalidatePath(`/trips/${tripId}/activities`);
}
