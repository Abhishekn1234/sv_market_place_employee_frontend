import { useEffect, useRef } from "react";
import { useLocationContext } from "@/context/presentation/components/LocationContext";
import { useAuthStore } from "@/core/store/auth";
import { reverseGeocode } from "@/components/common/CommonMap";

interface Location {
  lat: number;
  lng: number;
}
interface NotificationOption extends NotificationOptions {
    renotify?: boolean;
  }

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

export function useDynamicLocation() {
  const { setCurrentLocation, isTracking } = useLocationContext();
   
  const lastLocationRef = useRef<Location | null>(null);
  const notifyCountRef = useRef(0);
  const lastNotifyRef = useRef(0);

  const notify = async (
    _loc: Location,
    place: string,
    distance: number
  ) => {
    // console.log("Notify location change:", loc, place, distance);
    if (notifyCountRef.current >= 2) return;
    if (Date.now() - lastNotifyRef.current < 15000) return;

    if (Notification.permission !== "granted") return;
    if (!("serviceWorker" in navigator)) return;

    lastNotifyRef.current = Date.now();
    notifyCountRef.current++;

    const sw = await navigator.serviceWorker.ready;

    await sw.showNotification("📍 Location Changed", {
      body: `${place}\nMoved ${(distance / 1000).toFixed(2)} km`,
      tag: "location-change",
      renotify: false, 
     data: {
  url: "/location/service/settings",
},
      actions: [
        { action: "update", title: "Update" },
        { action: "close", title: "Dismiss" },
      ],
    } as NotificationOption);
  };

  useEffect(() => {
    if (!isTracking || !navigator.geolocation) return;

    let intervalId: number;

    const poll = () => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const current = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

       
          if (!lastLocationRef.current) {
            lastLocationRef.current = current;
            setCurrentLocation(current);
            return;
          }

          const distance = getDistance(
            lastLocationRef.current,
            current
          );

        
          if (distance < 100) return;

          const place = await reverseGeocode(current.lat, current.lng);
          if (!place) return; 
            useAuthStore.getState().setUserLocation({
              type: "Point",
              coordinates: [current.lng, current.lat],
            });
          lastLocationRef.current = current;
          setCurrentLocation(current);

          await notify(current, place, distance);
        },
        console.error,
        { enableHighAccuracy: true }
      );
    };

    poll();
    intervalId = window.setInterval(poll, 5000);

    return () => clearInterval(intervalId);
  }, [isTracking]);
}