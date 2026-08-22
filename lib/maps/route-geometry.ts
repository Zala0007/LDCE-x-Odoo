export type RouteCoordinate = { latitude: number; longitude: number };

const EARTH_RADIUS_KM = 6371;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function haversineDistanceKm(
  from: RouteCoordinate,
  to: RouteCoordinate,
) {
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function routeDistanceKm(points: RouteCoordinate[]) {
  return points
    .slice(1)
    .reduce(
      (total, point, index) =>
        total + haversineDistanceKm(points[index], point),
      0,
    );
}

export function segmentDistancesKm(points: RouteCoordinate[]) {
  return points.map((point, index) =>
    index === 0 ? 0 : haversineDistanceKm(points[index - 1], point),
  );
}
