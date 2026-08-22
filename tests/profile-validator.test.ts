import { describe, expect, it } from "vitest";
import { communityPostSchema, profileSchema } from "@/lib/validators/profile";

const validProfile = {
  firstName: "Asha",
  lastName: "Patel",
  email: "ASHA@EXAMPLE.COM",
  image: "",
  phone: "+91 98765 43210",
  city: "Ahmedabad",
  country: "India",
  bio: "I plan slower journeys around local food and architecture.",
  language: "en" as const,
  currency: "INR" as const,
  emailNotifications: true,
};

describe("profile validation", () => {
  it("normalizes a valid email address", () => {
    const result = profileSchema.parse(validProfile);
    expect(result.email).toBe("asha@example.com");
  });

  it("rejects an invalid phone number", () => {
    expect(profileSchema.safeParse({ ...validProfile, phone: "call me" }).success).toBe(false);
  });

  it("limits community stories to linked cuid trips", () => {
    const result = communityPostSchema.safeParse({
      title: "A useful day in Jaipur",
      content: "Book the first fort entry and carry water before the afternoon heat.",
      image: "",
      tripId: "not-a-cuid",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a detailed standalone community story", () => {
    expect(communityPostSchema.safeParse({
      title: "A useful day in Jaipur",
      content: "Book the first fort entry and carry water before the afternoon heat.",
      image: "",
      tripId: "",
    }).success).toBe(true);
  });
});
