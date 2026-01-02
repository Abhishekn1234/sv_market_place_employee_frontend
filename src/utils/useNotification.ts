// src/hooks/useDynamicLocation.ts
import { useEffect, useRef } from "react";
import { useLocationContext } from "@/context/LocationContext";
import { useNavigate } from "react-router-dom";

export function useDynamicLocation() {
  const { setCurrentLocation, isTracking } = useLocationContext();
  const lastLocationRef = useRef<{ lat: number; lng: number } | null>(null);
 
  const navigate = useNavigate();

  // Distance in meters
  const getDistance = (p1: { lat: number; lng: number }, p2: { lat: number; lng: number }) => {
    const R = 6371000;
    const toRad = (x: number) => (x * Math.PI) / 180;
    const dLat = toRad(p2.lat - p1.lat);
    const dLng = toRad(p2.lng - p1.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const notifyLocationChange = (loc: { lat: number; lng: number }) => {
  setCurrentLocation(loc);

  if (!("serviceWorker" in navigator)) return;
  if (Notification.permission !== "granted") return;

  navigator.serviceWorker.ready.then((registration) => {
    registration.active?.postMessage({
      type: "LOCATION_CHANGED",
      payload: {
        lat: loc.lat,
        lng: loc.lng,
      },
    });
  });
};


  useEffect(() => {
    if (!navigator.geolocation || !isTracking) return;

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const handlePosition = (pos: GeolocationPosition) => {
      const current = { lat: pos.coords.latitude, lng: pos.coords.longitude };

      // Only notify if distance > 5 meters or first time
      if (!lastLocationRef.current || getDistance(lastLocationRef.current, current) >= 5) {
        lastLocationRef.current = current;
        notifyLocationChange(current);
      }
    };

    // Initial location
    navigator.geolocation.getCurrentPosition(handlePosition, console.error, {
      enableHighAccuracy: true,
      maximumAge: 0,
    });

    // Watch position continuously
    const watchId = navigator.geolocation.watchPosition(handlePosition, console.error, {
      enableHighAccuracy: true,
      maximumAge: 0,
    });

    // Polling fallback
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
  }, [isTracking, setCurrentLocation, navigate]);
}
