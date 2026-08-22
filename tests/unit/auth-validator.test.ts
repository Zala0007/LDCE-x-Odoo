import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "@/lib/validators/auth";

describe("authentication validation", () => {
  it("normalizes email addresses", () => {
    const result = loginSchema.parse({ email: "  TRAVELER@Example.COM ", password: "secret" });
    expect(result.email).toBe("traveler@example.com");
  });

  it("rejects weak signup passwords", () => {
    const result = signupSchema.safeParse({ firstName: "Aarav", lastName: "Patel", email: "a@example.com", password: "password", confirmPassword: "password" });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched passwords", () => {
    const result = signupSchema.safeParse({ firstName: "Aarav", lastName: "Patel", email: "a@example.com", password: "Strongpass1", confirmPassword: "Strongpass2" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.flatten().fieldErrors.confirmPassword).toContain("Passwords do not match");
  });

  it("accepts a complete signup", () => {
    expect(signupSchema.safeParse({ firstName: "Aarav", lastName: "Patel", email: "a@example.com", phone: "+91 98765 43210", city: "Ahmedabad", country: "India", image: "", bio: "Slow travel fan", password: "Strongpass1", confirmPassword: "Strongpass1" }).success).toBe(true);
  });
});
