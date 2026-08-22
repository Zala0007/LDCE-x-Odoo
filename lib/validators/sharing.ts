import { z } from "zod";

export const shareUserSchema = z.object({
  email: z.string().trim().email("Enter a registered user's email").toLowerCase(),
  role: z.enum(["VIEWER", "EDITOR"]),
});
