import { z } from "zod";

export const stopInputSchema = z
  .object({
    cityId: z.string().cuid(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    transportCost: z.coerce.number().min(0).max(100_000_000).default(0),
    stayCost: z.coerce.number().min(0).max(100_000_000).default(0),
  })
  .refine((data) => data.endDate >= data.startDate, { message: "Stop end date cannot be before its start date", path: ["endDate"] });

export const itineraryActivityInputSchema = z.object({
  activityId: z.string().cuid(),
  date: z.coerce.date(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid time").optional().or(z.literal("")),
  cost: z.coerce.number().min(0).max(100_000_000).optional(),
  notes: z.string().trim().max(500).optional(),
});

export const orderedIdsSchema = z.array(z.string().cuid()).min(1).max(100);
