import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => !value || z.string().url().safeParse(value).success, "Enter a valid image URL")
  .transform((value) => value || undefined);

export const tripSchema = z
  .object({
    name: z.string().trim().min(3, "Trip name must be at least 3 characters").max(100),
    description: z.string().trim().max(1000, "Keep the description under 1,000 characters").optional(),
    startDate: z.coerce.date({ message: "Choose a start date" }),
    endDate: z.coerce.date({ message: "Choose an end date" }),
    coverImage: optionalUrl,
    budget: z
      .union([z.literal(""), z.coerce.number().positive("Budget must be greater than zero").max(100_000_000)])
      .optional()
      .transform((value) => (value === "" ? undefined : value)),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date cannot be before the start date",
    path: ["endDate"],
  });

export type TripInput = z.infer<typeof tripSchema>;
