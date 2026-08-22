import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().trim().min(2).max(40),
  lastName: z.string().trim().min(2).max(40),
  email: z.string().trim().email().toLowerCase(),
  image: z.string().trim().url("Enter a valid photo URL").optional().or(z.literal("")),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number").optional().or(z.literal("")),
  city: z.string().trim().max(80).optional(),
  country: z.string().trim().max(80).optional(),
  bio: z.string().trim().max(500).optional(),
  language: z.enum(["en", "hi", "gu", "fr", "es"]),
  currency: z.enum(["INR", "USD", "EUR", "GBP", "JPY"]),
  emailNotifications: z.boolean(),
});

export const communityPostSchema = z.object({
  title: z.string().trim().min(4, "Add a descriptive title").max(120),
  content: z.string().trim().min(20, "Share at least a few helpful details").max(3000),
  image: z.string().trim().url("Enter a valid image URL").optional().or(z.literal("")),
  tripId: z.string().cuid().optional().or(z.literal("")),
});
