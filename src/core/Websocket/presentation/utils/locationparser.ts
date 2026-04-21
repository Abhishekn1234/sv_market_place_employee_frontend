import type { GeoPoint } from "@/pages/Profile/domain/entities/location";

export function parseLocation(loc: GeoPoint | string | undefined) {
  let lat: number | null = null;
  let lng: number | null = null;

  try {
    if (typeof loc === "string") {
      const [a, b] = loc.split(",").map(Number);
      lat = a;
      lng = b;
    } else if (loc?.type === "Point") {
      const [a, b] = loc.coordinates;
      lat = a;
      lng = b;
    }
  } catch {}

  return { lat, lng };
}