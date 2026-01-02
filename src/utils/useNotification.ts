// src/hooks/useDynamicLocation.ts
import { useEffect, useRef } from "react";
import { useLocationContext } from "@/context/LocationContext";

type LatLng = { lat: number; lng: number };

// Haversine formula for distance in meters
const getDistance = (p1: LatLng, p2: LatLng) => {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(p2.lat - p1.lat);
  const dLng = toRad(p2.lng - p1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export function useDynamicLocation() {
  const { setCurrentLocation, isTracking } = useLocationContext();
  const lastLocationRef = useRef<LatLng | null>(null);

  // Notify SW about new location
  const notifyLocationChange = (loc: LatLng) => {
    setCurrentLocation(loc);

    if (!("serviceWorker" in navigator) || Notification.permission !== "granted") return;

    // Send to service worker
    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage({
        type: "LOCATION_CHANGED",
        payload: {
          lat: loc.lat,
          lng: loc.lng,
        },
      });
    });

    // Update last saved location
    localStorage.setItem("lastSavedCurrentLocation", JSON.stringify(loc));
  };

  useEffect(() => {
    if (!navigator.geolocation || !isTracking) return;

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const handlePosition = (pos: GeolocationPosition) => {
      const current = { lat: pos.coords.latitude, lng: pos.coords.longitude };

      if (!lastLocationRef.current || getDistance(lastLocationRef.current, current) >= 5) {
        lastLocationRef.current = current;
        notifyLocationChange(current);
      }
    };

    navigator.geolocation.getCurrentPosition(handlePosition, console.error, {
      enableHighAccuracy: true,
      maximumAge: 0,
    });

    const watchId = navigator.geolocation.watchPosition(handlePosition, console.error, {
      enableHighAccuracy: true,
      maximumAge: 0,
    });

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
