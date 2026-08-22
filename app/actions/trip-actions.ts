"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { ActionState } from "@/lib/action-state";
import { createTrip, deleteOwnedTrip, updateOwnedTrip } from "@/lib/repositories/trip-repository";
import { tripSchema } from "@/lib/validators/trip";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

function parseTrip(formData: FormData) {
  return tripSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    coverImage: formData.get("coverImage"),
    budget: formData.get("budget"),
  });
}

export async function createTripAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await requireUserId();
  const parsed = parseTrip(formData);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  const trip = await createTrip(userId, parsed.data);
  revalidatePath("/trips");
  redirect(`/trips/${trip.id}`);
}

export async function updateTripAction(tripId: string, _state: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await requireUserId();
  const parsed = parseTrip(formData);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  const updated = await updateOwnedTrip(tripId, userId, parsed.data);
  if (!updated) return { message: "Trip not found or you do not have permission to edit it." };
  revalidatePath("/trips");
  revalidatePath(`/trips/${tripId}`);
  redirect(`/trips/${tripId}`);
}

export async function deleteTripAction(tripId: string) {
  const userId = await requireUserId();
  await deleteOwnedTrip(tripId, userId);
  revalidatePath("/trips");
  redirect("/trips?deleted=1");
}
