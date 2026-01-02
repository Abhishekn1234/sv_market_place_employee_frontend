// src/hooks/useDynamicLocation.ts
import { useEffect, useRef } from "react";
import { useLocationContext } from "@/context/LocationContext";

// Interfaces
interface Location {
  lat: number;
  lng: number;
}

interface LocationData extends Location {
  placeName: string;
}

// Haversine formula: distance in meters
const getDistance = (p1: Location, p2: Location) => {
  const R = 6371000; // meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(p2.lat - p1.lat);
  const dLng = toRad(p2.lng - p1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};


export function useDynamicLocation() {
  const { setCurrentLocation, isTracking } = useLocationContext();
  const lastLocationRef = useRef<Location | null>(null);
  const notifCountRef = useRef<Record<string, number>>({});

  // Fetch place name from Nominatim (English)
  const getPlaceName = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`
      );
      const data = await res.json();
      if (data.display_name) return data.display_name;
      if (data.address) {
        const addr = data.address;
        const parts = [
          addr.village || addr.town || addr.city,
          addr.suburb,
          addr.district,
          addr.state,
          addr.postcode,
          addr.country,
        ].filter(Boolean);
        return parts.join(", ");
      }
      return "Unknown location";
    } catch (err) {
      console.error("Failed to fetch place name:", err);
      return "Unknown location";
    }
  };

  // Notify user via Service Worker
  const notifyLocationChange = async (loc: Location, placeName: string) => {
    setCurrentLocation(loc);

    // Last notified location
    const last = localStorage.getItem("lastNotifiedLocation");
    let lastLoc: Location | null = null;
    if (last) {
      try {
        const parsed = JSON.parse(last) as LocationData;
        lastLoc = { lat: parsed.lat, lng: parsed.lng };
      } catch {}
    }

    // Distance in km
    const distance = lastLoc ? getDistance(lastLoc, loc) / 1000 : 0;

    // Save current location
    localStorage.setItem(
      "lastNotifiedLocation",
      JSON.stringify({ lat: loc.lat, lng: loc.lng, placeName })
    );

    // Limit max 2 notifications per coordinate
    const key = `${loc.lat.toFixed(6)}_${loc.lng.toFixed(6)}`;
    const count = notifCountRef.current[key] || 0;
    if (count >= 2) return;
    notifCountRef.current[key] = count + 1;

    if ("serviceWorker" in navigator && Notification.permission === "granted") {
      const sw = await navigator.serviceWorker.ready;
      sw.showNotification("Location Changed", {
        body: `Lat: ${loc.lat.toFixed(4)}, Lng: ${loc.lng.toFixed(4)}
Place: ${placeName}
Distance from last: ${distance.toFixed(2)} km`,
        requireInteraction: true,
        data: { loc, placeName, url: "/settings/profile", tab: "location" },
        actions: [
          { action: "update", title: "Update" },
          { action: "close", title: "Dismiss" },
        ],
      } as any);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation || !isTracking) return;

    // Request notification permission if needed
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const handlePosition = async (pos: GeolocationPosition) => {
      const current: Location = { lat: pos.coords.latitude, lng: pos.coords.longitude };

      // Notify if distance > 5 meters or first time
      if (!lastLocationRef.current || getDistance(lastLocationRef.current, current) >= 5) {
        lastLocationRef.current = current;
        const placeName = await getPlaceName(current.lat, current.lng);
        notifyLocationChange(current, placeName);
      }
    };

    // Initial fetch
    navigator.geolocation.getCurrentPosition(handlePosition, console.error, {
      enableHighAccuracy: true,
      maximumAge: 0,
    });

    // Continuous watch
    const watchId = navigator.geolocation.watchPosition(handlePosition, console.error, {
      enableHighAccuracy: true,
      maximumAge: 0,
    });

    // Poll fallback
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(handlePosition, console.error, {
        enableHighAccuracy: true,
        maximumAge: 0,
      });
    }, 1000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(interval);
    };
  }, [isTracking, setCurrentLocation]);
}
