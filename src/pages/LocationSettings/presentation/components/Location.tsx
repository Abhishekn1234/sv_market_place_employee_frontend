import { useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { GeoPoint } from "@/pages/Profile/domain/entities/profile";
import L from "leaflet";

// Marker icon
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export function LocationPicker({ onChange }: { onChange: (point: GeoPoint) => void }) {
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  useMapEvents({
    click(e) {
      const coords: [number, number] = [e.latlng.lng, e.latlng.lat]; // GeoJSON [lng, lat]
      setPosition([e.latlng.lat, e.latlng.lng]); // Leaflet [lat, lng]
      onChange({ type: "Point", coordinates: coords });
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}
