import { describe, expect, it } from "vitest";
import { cityCoordinates } from "@/lib/data/city-coordinates";
import { buildActivities, citySeeds } from "@/lib/data/travel-data";

describe("travel seed integrity", () => {
  it("contains at least 25 unique, complete cities", () => {
    expect(citySeeds.length).toBeGreaterThanOrEqual(25);
    expect(new Set(citySeeds.map((city) => city.slug)).size).toBe(citySeeds.length);
    for (const city of citySeeds) {
      expect(city.description.length).toBeGreaterThan(60);
      expect(city.image).toMatch(/^https:\/\//);
      expect(city.costIndex).toBeGreaterThan(0);
      expect(city.popularityScore).toBeLessThanOrEqual(100);
      expect(city.estimatedMealCost).toBeGreaterThan(0);
      expect(city.estimatedStayCost).toBeGreaterThan(0);
      const coordinates = cityCoordinates[city.slug];
      expect(coordinates).toBeDefined();
      expect(coordinates.latitude).toBeGreaterThanOrEqual(-90);
      expect(coordinates.latitude).toBeLessThanOrEqual(90);
      expect(coordinates.longitude).toBeGreaterThanOrEqual(-180);
      expect(coordinates.longitude).toBeLessThanOrEqual(180);
    }
  });

  it("generates at least 80 useful activities with estimated pricing", () => {
    const activities = citySeeds.flatMap(buildActivities);
    expect(activities.length).toBeGreaterThanOrEqual(80);
    expect(activities).toHaveLength(100);
    for (const activity of activities) {
      expect(activity.description.length).toBeGreaterThan(80);
      expect(activity.durationMinutes).toBeGreaterThan(0);
      expect(activity.estimatedCost).toBeGreaterThan(0);
      expect(activity.popularity).toBeGreaterThanOrEqual(0);
    }
  });
});
