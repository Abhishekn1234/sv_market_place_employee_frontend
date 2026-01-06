// src/hooks/useDynamicLocation.ts
import { useEffect, useRef } from "react";
import { useLocationContext } from "@/context/LocationContext";

/* ------------------ Types ------------------ */
interface Location {
  lat: number;
  lng: number;
}
interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

interface LocationData extends Location {
  placeName: string;
}

/* ------------------ Utils ------------------ */
// Haversine distance in meters
const getDistance = (p1: Location, p2: Location) => {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(p2.lat - p1.lat);
  const dLng = toRad(p2.lng - p1.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(p1.lat)) *
      Math.cos(toRad(p2.lat)) *
      Math.sin(dLng / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

/* ======================================================= */

export function useDynamicLocation() {
  const { setCurrentLocation, isTracking } = useLocationContext();

  const lastLocationRef = useRef<Location | null>(null);
  const lastGeocodeAtRef = useRef(0);
  const notifCountRef = useRef<Record<string, number>>({});
  const watchIdRef = useRef<number | null>(null);

  /* ------------------ Reverse Geocoding ------------------ */
  const getPlaceName = async (lat: number, lng: number): Promise<string> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`,
        { signal: controller.signal }
      );

      clearTimeout(timeout);

      if (!res.ok) throw new Error("Reverse geocode failed");

      const data = await res.json();
      return data.display_name ?? "Unknown location";
    } catch {
      return "Location unavailable";
    }
  };

  /* ------------------ Notification ------------------ */
  const notifyLocationChange = async (
    loc: Location,
    placeName: string,
    distanceMeters: number
  ) => {
    setCurrentLocation(loc);

    // reduce precision to avoid GPS jitter lock
    const key = `${loc.lat.toFixed(4)}_${loc.lng.toFixed(4)}`;
    const count = notifCountRef.current[key] || 0;

    if (count >= 2) return;
    notifCountRef.current[key] = count + 1;

    lastLocationRef.current = loc;

    localStorage.setItem(
      "lastNotifiedLocation",
      JSON.stringify({ ...loc, placeName })
    );

    // 🔔 Notification
    if ("serviceWorker" in navigator && Notification.permission === "granted") {
      const sw = await navigator.serviceWorker.ready;

    await sw.showNotification(
  "Location Changed",
  {
    body: `📍 ${placeName}\nMoved ${(distanceMeters / 1000).toFixed(2)} km`,
    data: {
      url: "/settings/profile",
      tab: "location",
      loc,
    },
    actions: [
      { action: "update", title: "Update" },
      { action: "close", title: "Dismiss" },
    ],
  } as NotificationOptions & {
    actions: NotificationAction[];
  }
);

    }
  };

  /* ------------------ Effect ------------------ */
  useEffect(() => {
    if (!navigator.geolocation || !isTracking) return;

    let cancelled = false;

    const init = async () => {
      // 🔐 Ensure permission BEFORE tracking
      if ("Notification" in window) {
        const permission =
          Notification.permission === "default"
            ? await Notification.requestPermission()
            : Notification.permission;

        if (permission !== "granted") {
          console.warn("❌ Notification permission denied");
          return;
        }
      }

      if (cancelled) return;

      watchIdRef.current = navigator.geolocation.watchPosition(
        async (pos) => {
          const current: Location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          const last: Location | null =
            lastLocationRef.current ??
            (() => {
              const stored = localStorage.getItem("lastNotifiedLocation");
              if (!stored) return null;
              try {
                const parsed = JSON.parse(stored) as LocationData;
                return { lat: parsed.lat, lng: parsed.lng };
              } catch {
                return null;
              }
            })();

          const distanceMeters = last
            ? getDistance(last, current)
            : Infinity;

          // 🚫 Ignore tiny GPS drift
          if (distanceMeters < 25) return;

          // 🚫 Reverse-geocode throttle (1 min)
          if (Date.now() - lastGeocodeAtRef.current < 60_000) return;
          lastGeocodeAtRef.current = Date.now();

          const placeName = await getPlaceName(
            current.lat,
            current.lng
          );

          await notifyLocationChange(
            current,
            placeName,
            distanceMeters
          );
        },
        (err) => {
          console.error("Geolocation error:", err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
        }
      );
    };

    init();

    return () => {
      cancelled = true;
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isTracking, setCurrentLocation]);
}
