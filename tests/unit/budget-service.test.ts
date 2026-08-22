import { describe, expect, it } from "vitest";
import { calculateTripBudget } from "@/lib/services/budget-service";

const trip = {
  startDate: new Date("2027-01-01T00:00:00.000Z"),
  endDate: new Date("2027-01-03T00:00:00.000Z"),
  budget: 20000,
  stops: [{
    startDate: new Date("2027-01-01T00:00:00.000Z"),
    endDate: new Date("2027-01-03T00:00:00.000Z"),
    transportCost: 2000,
    stayCost: 6000,
    city: { name: "Udaipur", estimatedMealCost: 500, estimatedStayCost: 2500 },
    itineraryActivities: [{ date: new Date("2027-01-02T00:00:00.000Z"), cost: null, activity: { estimatedCost: 1500 } }],
  }],
};

describe("central budget engine", () => {
  it("calculates categories, totals, and remaining budget", () => {
    const result = calculateTripBudget(trip);
    expect(result.transport).toBe(2000);
    expect(result.stay).toBe(6000);
    expect(result.meals).toBe(1500);
    expect(result.activities).toBe(1500);
    expect(result.total).toBe(11000);
    expect(result.remaining).toBe(9000);
    expect(result.percentageUsed).toBeCloseTo(55);
  });

  it("keeps the daily breakdown reconciled with the total", () => {
    const result = calculateTripBudget(trip);
    expect(result.days.reduce((sum, day) => sum + day.total, 0)).toBe(result.total);
    expect(result.tripDays).toBe(3);
  });

  it("flags over-budget plans", () => {
    expect(calculateTripBudget({ ...trip, budget: 5000 }).overBudget).toBe(true);
  });
});
