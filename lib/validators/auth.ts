import { z } from "zod";

const email = z.string().trim().email("Enter a valid email address").toLowerCase();
const password = z
  .string()
  .min(8, "Use at least 8 characters")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[0-9]/, "Add a number");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(2, "Enter your first name").max(40),
    lastName: z.string().trim().min(2, "Enter your last name").max(40),
    email,
    phone: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number").optional().or(z.literal("")),
    city: z.string().trim().max(80).optional(),
    country: z.string().trim().max(80).optional(),
    image: z.string().trim().url("Enter a valid photo URL").optional().or(z.literal("")),
    bio: z.string().trim().max(500, "Keep additional information under 500 characters").optional(),
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    token: z.string().min(20, "Reset link is invalid"),
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
