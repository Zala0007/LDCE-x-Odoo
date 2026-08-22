import { describe, expect, it } from "vitest";
import { itineraryActivityInputSchema, orderedIdsSchema, stopInputSchema } from "@/lib/validators/itinerary";

describe("itinerary validation", () => {
  it("rejects reversed stop dates", () => {
    expect(stopInputSchema.safeParse({ cityId: "clh1234567890abcdefghijk", startDate: "2027-03-10", endDate: "2027-03-09", transportCost: "0", stayCost: "0" }).success).toBe(false);
  });

  it("accepts valid scheduled activity details", () => {
    expect(itineraryActivityInputSchema.safeParse({ activityId: "clh1234567890abcdefghijk", date: "2027-03-10", startTime: "09:30", cost: "1200", notes: "Meet at the gate" }).success).toBe(true);
  });

  it("rejects duplicate-incomplete identifier shapes", () => {
    expect(orderedIdsSchema.safeParse(["invalid-id"]).success).toBe(false);
  });
});
