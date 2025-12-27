"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import type { GeoPoint } from "@/pages/Profile/domain/entities/profile";
import { LocationPicker } from "./components/Location";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface LocationPageProps {
  onChange: (point: GeoPoint) => void;
}

function FlyToLocation({ coords }: { coords: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 13);
  }, [coords, map]);
  return null;
}

// Marker icon
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export default function LocationPage({ onChange }: LocationPageProps) {
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [defaultCenter, setDefaultCenter] = useState<LatLngExpression>([20, 97]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setDefaultCenter([pos.coords.latitude, pos.coords.longitude]),
      () => console.warn("Geolocation not allowed, using default center")
    );
  }, []);

  return (
    <div className="w-full h-full relative">
    <MapContainer
  center={defaultCenter}
  zoom={5}
  style={{ height: "100%", width: "100%" }}
>
  <TileLayer
    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    attribution="© OpenStreetMap contributors © CARTO"
  />

  {location && (
    <>
      <FlyToLocation
        coords={[location.coordinates[1], location.coordinates[0]]}
      />
      <Marker
        position={[location.coordinates[1], location.coordinates[0]]}
        icon={markerIcon}
      >
        <Popup>
          Lat: {location.coordinates[1].toFixed(5)}, Lng:{" "}
          {location.coordinates[0].toFixed(5)}
        </Popup>
      </Marker>
    </>
  )}

  <LocationPicker
    onChange={(point) => {
      setLocation(point);
      onChange(point);
    }}
  />
</MapContainer>

    </div>
  );
}
