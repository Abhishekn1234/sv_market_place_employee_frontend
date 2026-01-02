// src/hooks/useDynamicLocation.ts
import { useEffect, useRef } from "react";
import { useLocationContext } from "@/context/LocationContext";
import { useNavigate } from "react-router-dom";

// Interfaces
interface Location {
  lat: number;
  lng: number;
}

interface LocationData extends Location {
  placeName: string;
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

// Haversine formula for distance
const getDistance = (p1: Location, p2: Location): number => {
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
  const navigate = useNavigate();

  // Nominatim API
  const getPlaceName = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
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

  // Notify user
  const notifyLocationChange = (loc: Location, placeName: string) => {
    setCurrentLocation(loc);

    // Distance from last notified location
    const last = localStorage.getItem("lastNotifiedLocation");
    let lastLoc: Location | null = null;
    if (last) {
      try {
        const parsed = JSON.parse(last) as LocationData;
        lastLoc = { lat: parsed.lat, lng: parsed.lng };
      } catch {}
    }

    const distance = lastLoc ? getDistance(lastLoc, loc) : 0;

    // Save current location
    localStorage.setItem(
      "lastNotifiedLocation",
      JSON.stringify({ lat: loc.lat, lng: loc.lng, placeName })
    );

    if ("Notification" in window && Notification.permission === "granted") {
      const key = `${loc.lat.toFixed(6)}_${loc.lng.toFixed(6)}`;
      const count = notifCountRef.current[key] || 0;
      if (count >= 2) return;
      notifCountRef.current[key] = count + 1;

      // Cast options as any to allow `actions`
      const notif = new Notification("Location Changed", {
        body: `Lat: ${loc.lat.toFixed(4)}, Lng: ${loc.lng.toFixed(4)}
Place: ${placeName}
Distance from last: ${distance.toFixed(2)} meters`,
        requireInteraction: true,
        data: { lat: loc.lat, lng: loc.lng, placeName } as LocationData,
        actions: [
          { action: "update", title: "Update Location" },
          { action: "close", title: "Dismiss" },
        ],
      } as any);

      // onclick
      notif.onclick = function (ev: Event) {
        ev.preventDefault();
        window.focus();
        navigate("/settings/profile", { state: { fromNotification: true } });
      };

      // onaction (Chrome only)
      (notif as any).onaction = function (ev: { action: string }) {
        if (ev.action === "update") {
          console.log("Update clicked:", loc);
        } else if (ev.action === "close") {
          notif.close();
        }
      };
    }
  };

  useEffect(() => {
    if (!navigator.geolocation || !isTracking) return;

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const handlePosition = async (pos: GeolocationPosition) => {
      const current: Location = { lat: pos.coords.latitude, lng: pos.coords.longitude };

      if (!lastLocationRef.current || getDistance(lastLocationRef.current, current) >= 5) {
        lastLocationRef.current = current;

        const placeName = await getPlaceName(current.lat, current.lng);

        notifyLocationChange(current, placeName);
      }
    };

    // Initial location
    navigator.geolocation.getCurrentPosition(handlePosition, console.error, {
      enableHighAccuracy: true,
      maximumAge: 0,
    });

    // Watch continuously
    const watchId = navigator.geolocation.watchPosition(handlePosition, console.error, {
      enableHighAccuracy: true,
      maximumAge: 0,
    });

    // Optional polling fallback (1s)
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
