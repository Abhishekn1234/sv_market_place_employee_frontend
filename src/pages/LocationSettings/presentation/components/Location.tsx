import { useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { GeoPoint } from "@/pages/Profile/domain/entities/location";


import { defaultIcon } from "@/components/common/CommonMap";

export function LocationPicker({ onChange }: { onChange: (point: GeoPoint) => void }) {
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  useMapEvents({
    click(e) {
      const coords: [number, number] = [e.latlng.lng, e.latlng.lat]; // GeoJSON [lng, lat]
      setPosition([e.latlng.lat, e.latlng.lng]); // Leaflet [lat, lng]
      onChange({ type: "Point", coordinates: coords });
    },
  });

  return position ? <Marker position={position} icon={defaultIcon} /> : null;
}
