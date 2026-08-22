import { describe, expect, it } from "vitest";
import { tripSchema } from "@/lib/validators/trip";

const validTrip = {
  name: "Rajasthan winter trail",
  description: "Palaces and desert skies",
  startDate: "2027-01-04",
  endDate: "2027-01-10",
  coverImage: "",
  budget: "75000",
};

describe("trip validation", () => {
  it("coerces dates and budget", () => {
    const result = tripSchema.parse(validTrip);
    expect(result.startDate).toBeInstanceOf(Date);
    expect(result.budget).toBe(75000);
    expect(result.coverImage).toBeUndefined();
  });

  it("rejects an end date before the start date", () => {
    const result = tripSchema.safeParse({
      ...validTrip,
      endDate: "2027-01-03",
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.flatten().fieldErrors.endDate).toBeDefined();
  });

  it("rejects invalid image URLs and negative budgets", () => {
    const result = tripSchema.safeParse({
      ...validTrip,
      coverImage: "not-a-url",
      budget: "-50",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an optional starting city and rejects malformed identifiers", () => {
    expect(
      tripSchema.safeParse({
        ...validTrip,
        initialCityId: "clh1234567890abcdefghijk",
      }).success,
    ).toBe(true);
    const invalid = tripSchema.safeParse({
      ...validTrip,
      initialCityId: "not-a-city-id",
    });
    expect(invalid.success).toBe(false);
    if (!invalid.success)
      expect(invalid.error.flatten().fieldErrors.initialCityId).toBeDefined();
  });
});
