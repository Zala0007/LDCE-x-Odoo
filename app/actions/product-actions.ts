"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import type { ActionState } from "@/lib/action-state";
import { communityPostSchema, profileSchema } from "@/lib/validators/profile";
import { entityIdSchema } from "@/lib/validators/discovery";

async function requireUser() { const session = await auth(); if (!session?.user?.id) redirect("/login"); return session.user; }

export async function updateProfileAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({ firstName: formData.get("firstName"), lastName: formData.get("lastName"), email: formData.get("email"), image: formData.get("image"), phone: formData.get("phone"), city: formData.get("city"), country: formData.get("country"), bio: formData.get("bio"), language: formData.get("language"), currency: formData.get("currency"), emailNotifications: formData.get("emailNotifications") === "on" });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  try {
    await db.user.update({ where: { id: user.id }, data: { name: `${parsed.data.firstName} ${parsed.data.lastName}`, firstName: parsed.data.firstName, lastName: parsed.data.lastName, email: parsed.data.email, image: parsed.data.image || null, phone: parsed.data.phone || null, city: parsed.data.city || null, country: parsed.data.country || null, bio: parsed.data.bio || null, preferences: { upsert: { create: { language: parsed.data.language, currency: parsed.data.currency, emailNotifications: parsed.data.emailNotifications }, update: { language: parsed.data.language, currency: parsed.data.currency, emailNotifications: parsed.data.emailNotifications } } } } });
  } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return { fieldErrors: { email: ["That email is already in use"] } }; throw error; }
  revalidatePath("/profile");
  return { success: true, message: "Profile updated successfully." };
}

export async function deleteAccountAction() {
  const user = await requireUser();
  await db.user.delete({ where: { id: user.id } });
  await signOut({ redirectTo: "/?account=deleted" });
}

export async function createCommunityPostAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = communityPostSchema.safeParse({ title: formData.get("title"), content: formData.get("content"), image: formData.get("image"), tripId: formData.get("tripId") });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  if (parsed.data.tripId) { const owns = await db.trip.count({ where: { id: parsed.data.tripId, ownerId: user.id } }); if (!owns) return { message: "Choose one of your own trips" }; }
  await db.communityPost.create({ data: { authorId: user.id, title: parsed.data.title, content: parsed.data.content, image: parsed.data.image || null, tripId: parsed.data.tripId || null } });
  revalidatePath("/community");
  return { success: true, message: "Story published." };
}

export async function deleteCommunityPostAction(postId: string) {
  const user = await requireUser();
  await db.communityPost.deleteMany({ where: { id: entityIdSchema.parse(postId), authorId: user.id } });
  revalidatePath("/community");
}

export async function toggleUserActiveAction(userId: string) {
  const admin = await requireUser(); if (admin.role !== "ADMIN") throw new Error("Forbidden");
  const targetId = entityIdSchema.parse(userId);
  if (targetId === admin.id) return;
  const target = await db.user.findUnique({ where: { id: targetId }, select: { isActive: true } });
  if (!target) return;
  await db.user.update({ where: { id: targetId }, data: { isActive: !target.isActive } });
  revalidatePath("/admin");
}
