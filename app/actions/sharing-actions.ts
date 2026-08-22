"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { ActionState } from "@/lib/action-state";
import { copyTripForUser, removeTripShare, setPublicSharing, shareTripWithUser } from "@/lib/services/sharing-service";
import { entityIdSchema } from "@/lib/validators/discovery";
import { shareUserSchema } from "@/lib/validators/sharing";

async function requireUserId() { const session = await auth(); if (!session?.user?.id) redirect("/login"); return session.user.id; }
function id(value: string) { return entityIdSchema.parse(value); }

export async function setPublicSharingAction(tripId: string, formData: FormData) {
  const ownerId = await requireUserId();
  await setPublicSharing(ownerId, id(tripId), formData.get("enabled") === "true");
  revalidatePath(`/trips/${tripId}/share`);
}

export async function shareUserAction(tripId: string, _state: ActionState, formData: FormData): Promise<ActionState> {
  const ownerId = await requireUserId();
  const parsed = shareUserSchema.safeParse({ email: formData.get("email"), role: formData.get("role") });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  const result = await shareTripWithUser(ownerId, id(tripId), parsed.data.email, parsed.data.role);
  if (!result.ok) return { message: result.message };
  revalidatePath(`/trips/${tripId}/share`);
  return { success: true, message: "Traveler added successfully." };
}

export async function removeTripShareAction(tripId: string, shareId: string) {
  const ownerId = await requireUserId();
  await removeTripShare(ownerId, id(tripId), id(shareId));
  revalidatePath(`/trips/${tripId}/share`);
}

export async function copyTripAction(sourceTripId: string) {
  const userId = await requireUserId();
  const trip = await copyTripForUser(userId, id(sourceTripId));
  if (!trip) throw new Error("This trip is not available to copy");
  revalidatePath("/trips");
  redirect(`/trips/${trip.id}`);
}
