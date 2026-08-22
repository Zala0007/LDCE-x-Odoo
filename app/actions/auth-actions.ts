"use server";

import { AuthError } from "next-auth";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import type { ActionState } from "@/lib/action-state";
import { hashPassword } from "@/lib/services/password-service";
import { consumePasswordResetToken, createPasswordResetToken } from "@/lib/services/password-reset-service";
import { forgotPasswordSchema, loginSchema, resetPasswordSchema, signupSchema } from "@/lib/validators/auth";

function fields(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function loginAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(fields(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  try {
    await signIn("credentials", { ...parsed.data, redirectTo: "/trips" });
  } catch (error) {
    if (error instanceof AuthError) return { message: "Email or password is incorrect." };
    throw error;
  }
  return {};
}

export async function signupAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse(fields(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  try {
    await db.user.create({
      data: {
        name: `${parsed.data.firstName} ${parsed.data.lastName}`,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        city: parsed.data.city || null,
        country: parsed.data.country || null,
        image: parsed.data.image || null,
        bio: parsed.data.bio || null,
        passwordHash: await hashPassword(parsed.data.password),
        preferences: { create: {} },
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { fieldErrors: { email: ["An account with this email already exists"] } };
    }
    throw error;
  }
  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: "/trips",
  });
  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function forgotPasswordAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse(fields(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  const token = await createPasswordResetToken(parsed.data.email);
  return {
    success: true,
    message: "If that account exists, a reset link has been prepared.",
    resetPath: process.env.NODE_ENV === "development" && token ? `/reset-password?token=${token}` : undefined,
  };
}

export async function resetPasswordAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse(fields(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  const success = await consumePasswordResetToken(parsed.data.token, parsed.data.password);
  if (!success) return { message: "This reset link is invalid or has expired." };
  redirect("/login?reset=success");
}
