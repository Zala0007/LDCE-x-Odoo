import { describe, expect, it } from "vitest";
import { shareUserSchema } from "@/lib/validators/sharing";

describe("trip sharing validation", () => {
  it("accepts the supported collaborator roles", () => {
    expect(shareUserSchema.safeParse({ email: "friend@example.com", role: "VIEWER" }).success).toBe(true);
    expect(shareUserSchema.safeParse({ email: "friend@example.com", role: "EDITOR" }).success).toBe(true);
  });

  it("normalizes collaborator email addresses", () => {
    expect(shareUserSchema.parse({ email: " FRIEND@EXAMPLE.COM ", role: "EDITOR" }).email).toBe("friend@example.com");
  });

  it("rejects arbitrary roles", () => {
    expect(shareUserSchema.safeParse({ email: "friend@example.com", role: "OWNER" }).success).toBe(false);
  });
});
