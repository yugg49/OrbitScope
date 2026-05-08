export function haversineDistance(pointA, pointB) {
  if (!pointA || !pointB) return 0;
  const toRad = (value) => (Number(value) * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(pointB.lat - pointA.lat);
  const dLon = toRad(pointB.lon - pointA.lon);
  const lat1 = toRad(pointA.lat);
  const lat2 = toRad(pointB.lat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateSpeed(previous, current) {
  if (!previous || !current || previous.timestamp === current.timestamp) return 0;
  const distanceKm = haversineDistance(previous, current);
  const hours = Math.abs(current.timestamp - previous.timestamp) / 3600;
  return hours > 0 ? Math.round(distanceKm / hours) : 0;
}

export function normalizeLongitude(lon) {
  const value = Number(lon);
  return ((((value + 180) % 360) + 360) % 360) - 180;
}
