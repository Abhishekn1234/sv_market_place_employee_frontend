import { useEffect, useRef, useState, useCallback } from "react";
import { useLocationContext } from "@/context/LocationContext";
import { getPlaceFromCoordinates } from "@/pages/Profile/presentation/components/LocationSettings";

export function useDynamicLocation(enabled: boolean = true) {
  const { setCurrentLocation, isTracking } = useLocationContext();

  const lastLocationRef = useRef<{ lat: number; lng: number } | null>(
    JSON.parse(localStorage.getItem("lastLocation") || "null")
  );

  const [lastNotifiedLocation, setLastNotifiedLocation] = useState<string | null>(
    () => localStorage.getItem("lastNotifiedLocation")
  );

  // Haversine distance
  const getDistanceKm = (loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }) => {
    const R = 6371;
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(loc2.lat - loc1.lat);
    const dLng = toRad(loc2.lng - loc1.lng);

    const lat1 = toRad(loc1.lat);
    const lat2 = toRad(loc2.lat);

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const getDirection = (loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const lat1 = toRad(loc1.lat);
    const lat2 = toRad(loc2.lat);
    const dLng = toRad(loc2.lng - loc1.lng);

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    let bearing = toDeg(Math.atan2(y, x));
    if (bearing < 0) bearing += 360;

    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(bearing / 45) % 8];
  };

  // Function to notify a location change (manual or geolocation)
  const notifyLocationChange = useCallback(async (loc: { lat: number; lng: number }) => {
    if (!enabled) return;

    setCurrentLocation(loc);

    const lastLoc = lastLocationRef.current;

    // Get place name
    let placeName = "Unknown location";
    try {
      const { shortName } = await getPlaceFromCoordinates(loc.lat, loc.lng);
      placeName = shortName;
    } catch {}

    let distanceText = "";
    if (lastLoc) {
      const distanceKm = getDistanceKm(lastLoc, loc);
      const direction = getDirection(lastLoc, loc);
      distanceText = `${distanceKm.toFixed(2)} km ${direction}`;
    }

    const fullBody = distanceText
      ? `${placeName} (${distanceText} from last location)`
      : placeName;

    // Notify SW or native
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "LOCATION_NOTIFICATION",
        payload: { title: "Location Changed", body: fullBody, placeName },
      });
    } else if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Location Changed", { body: fullBody });
    }

    // Save to state & localStorage
    setLastNotifiedLocation(placeName);
    localStorage.setItem("lastNotifiedLocation", placeName);

    lastLocationRef.current = loc;
    localStorage.setItem("lastLocation", JSON.stringify(loc));
  }, [enabled, setCurrentLocation]);

  // Expose manual updater
  const updateLocationManually = useCallback(
    (lat: number, lng: number) => {
      notifyLocationChange({ lat, lng });
    },
    [notifyLocationChange]
  );

  // Listen for SW messages
  useEffect(() => {
    if (!enabled || !navigator.serviceWorker) return;

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "UPDATE_LAST_NOTIFIED_LOCATION") {
        const { placeName } = event.data.payload;
        if (placeName) {
          localStorage.setItem("lastNotifiedLocation", placeName);
          setLastNotifiedLocation(placeName);
        }
      }
    };

    navigator.serviceWorker.addEventListener("message", onMessage);
    return () => {
      navigator.serviceWorker.removeEventListener("message", onMessage);
    };
  }, [enabled]);

  // Geolocation watcher
  useEffect(() => {
    if (!enabled || !navigator.geolocation || !isTracking) return;

    const handlePosition = (pos: GeolocationPosition) => {
      const current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      const lastLoc = lastLocationRef.current;

      if (!lastLoc || getDistanceKm(lastLoc, current) >= 0.005) {
        notifyLocationChange(current);
      }
    };

    const watchId = navigator.geolocation.watchPosition(handlePosition, console.error, {
      enableHighAccuracy: true,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled, isTracking, notifyLocationChange]);

  return { lastNotifiedLocation, updateLocationManually };
}
