import { z } from "zod";

export const entityIdSchema = z.string().cuid("Invalid record identifier");

export const citySearchSchema = z.object({
  q: z.string().trim().max(100).optional().default(""),
  country: z.string().trim().max(80).optional().default(""),
  region: z.string().trim().max(80).optional().default(""),
  group: z.enum(["none", "country", "region"]).optional().default("none"),
  sort: z.enum(["popular", "name", "budget"]).optional().default("popular"),
});

export const activitySearchSchema = z.object({
  q: z.string().trim().max(100).optional().default(""),
  city: z.string().trim().max(100).optional().default(""),
  category: z.string().trim().max(60).optional().default(""),
  maxCost: z.coerce.number().positive().optional().or(z.literal("")),
  maxDuration: z.coerce.number().int().positive().optional().or(z.literal("")),
  group: z.enum(["none", "city"]).optional().default("none"),
  sort: z
    .enum(["popular", "name", "cost", "duration"])
    .optional()
    .default("popular"),
});
