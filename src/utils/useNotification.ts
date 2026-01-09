import { useEffect, useRef } from "react";
import { useLocationContext } from "@/context/LocationContext";

/* ---------- Types ---------- */
interface Location {
  lat: number;
  lng: number;
}
// types/notification.d.ts (or near your hook)
interface ExtendedNotificationOptions extends NotificationOptions {
  renotify?: boolean;
}

/* ---------- Distance ---------- */
const getDistance = (a: Location, b: Location) => {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) *
      Math.cos(toRad(b.lat)) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

/* ================================================= */

export function useDynamicLocation() {
  const { setCurrentLocation, isTracking } = useLocationContext();

  const lastLocationRef = useRef<Location | null>(null);
  const lastNotifyRef = useRef(0);

  /* ---------- Reverse Geocode ---------- */
  const getPlaceName = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      return data.display_name || "Unknown location";
    } catch {
      return "Location unavailable";
    }
  };

  /* ---------- Notify ---------- */
  const notify = async (loc: Location, place: string, distance: number) => {
    setCurrentLocation(loc);

    if (Date.now() - lastNotifyRef.current < 10000) return; // 10s throttle
    lastNotifyRef.current = Date.now();

    if (Notification.permission !== "granted") return;
    if (!("serviceWorker" in navigator)) return;

    const sw = await navigator.serviceWorker.ready;

    await sw.showNotification("📍 Location Changed", {
  body: `${place}\nMoved ${(distance / 1000).toFixed(2)} km`,
  tag: "location-change",
  renotify: true,
  data: {
    url: "/settings/profile",
    tab: "location",
  },
  actions: [
    { action: "update", title: "Update" },
    { action: "close", title: "Dismiss" },
  ],
} as ExtendedNotificationOptions);

  };

  /* ---------- Effect ---------- */
  useEffect(() => {
    if (!isTracking || !navigator.geolocation) return;

    let intervalId: number;

    const poll = async () => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const current = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          const last = lastLocationRef.current;
          const distance = last ? getDistance(last, current) : Infinity;

          if (distance < 25) return; // ignore drift

          lastLocationRef.current = current;

          const place = await getPlaceName(current.lat, current.lng);
          await notify(current, place, distance);
        },
        console.error,
        { enableHighAccuracy: true }
      );
    };

    poll(); // immediate
    intervalId = window.setInterval(poll, 5000); // every 5 sec

    return () => clearInterval(intervalId);
  }, [isTracking]);
}
