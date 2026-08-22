import { describe, expect, it } from "vitest";
import { activitySearchSchema, citySearchSchema } from "@/lib/validators/discovery";

describe("discovery filters", () => {
  it("accepts empty city filters", () => {
    expect(citySearchSchema.parse({})).toEqual({ q: "", country: "", region: "" });
  });

  it("coerces activity cost and duration limits", () => {
    const value = activitySearchSchema.parse({ q: "food", maxCost: "2500", maxDuration: "180" });
    expect(value.maxCost).toBe(2500);
    expect(value.maxDuration).toBe(180);
  });

  it("rejects negative filter values", () => {
    expect(activitySearchSchema.safeParse({ maxCost: "-1" }).success).toBe(false);
  });
});
