import { describe, expect, it } from "vitest";
import { haversineDistanceKm, routeDistanceKm, segmentDistancesKm } from "@/lib/maps/route-geometry";

const tokyo = { latitude: 35.6762, longitude: 139.6503 };
const kyoto = { latitude: 35.0116, longitude: 135.7681 };
const osaka = { latitude: 34.6937, longitude: 135.5023 };

describe("route geometry", () => {
  it("calculates a realistic great-circle distance", () => {
    expect(haversineDistanceKm(tokyo, kyoto)).toBeGreaterThan(350);
    expect(haversineDistanceKm(tokyo, kyoto)).toBeLessThan(380);
  });

  it("totals ordered route segments without inventing an origin leg", () => {
    const points = [tokyo, kyoto, osaka];
    const segments = segmentDistancesKm(points);
    expect(segments[0]).toBe(0);
    expect(segments[1]).toBeCloseTo(haversineDistanceKm(tokyo, kyoto), 5);
    expect(routeDistanceKm(points)).toBeCloseTo(segments[1] + segments[2], 5);
  });

  it("returns zero for empty and single-stop routes", () => {
    expect(routeDistanceKm([])).toBe(0);
    expect(routeDistanceKm([tokyo])).toBe(0);
  });
});
