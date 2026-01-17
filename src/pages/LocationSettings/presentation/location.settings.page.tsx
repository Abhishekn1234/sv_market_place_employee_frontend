import { useEffect, useState } from "react";
import { CommonMap } from "@/components/common/CommonMap";

interface LocationPageProps {
  onChange: (point: [number, number]) => void; // [lat, lng]
  radius?: number;
  onRadiusChange?: (r: number) => void;
}

export default function LocationPage({
  onChange,
  radius = 1000,
  onRadiusChange,
}: LocationPageProps) {
  const [mapLocation, setMapLocation] = useState<[number, number] | null>(null);

  /* ================== GET CURRENT LOCATION ================== */
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setMapLocation([lat, lng]);
        onChange([lat, lng]); // ✅ sync with parent
      },
      (err) => {
        console.error("Location error:", err);
        // fallback location
        setMapLocation([20, 97]);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  if (!mapLocation) return null;

  return (
    <div className="w-full h-full">
      <CommonMap
        location={mapLocation}
        setLocation={(coords) => {
          setMapLocation(coords);
          onChange([coords[0], coords[1]]); // lat, lng
        }}
        locationMode="MANUAL"
        radius={radius}
        setRadius={onRadiusChange}
        height="100%"
        draggableMarker
      />
    </div>
  );
}
