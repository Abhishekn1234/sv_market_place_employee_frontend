import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap, Popup } from "react-leaflet";
import type { GeoPoint } from "@/pages/Profile/domain/entities/profile";
import { LocationPicker } from "./components/Location";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface LocationPageProps {
  onChange: (point: [number, number]) => void; // [lng, lat]
  radius?: number;
  onRadiusChange?: (r: number) => void;
}

function FlyToLocation({ coords }: { coords: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 13);
  }, [coords, map]);
  return null;
}

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export default function LocationPage({ onChange, radius = 1000, onRadiusChange }: LocationPageProps) {
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [center, setCenter] = useState<GeoPoint | null>(null);
  const [currentRadius, setCurrentRadius] = useState<number>(radius);
  const [defaultCenter, setDefaultCenter] = useState<LatLngExpression>([20, 97]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setDefaultCenter([pos.coords.latitude, pos.coords.longitude]),
      () => console.warn("Geolocation not allowed, using default center")
    );
  }, []);

  // Calculate distance in meters between two points (Haversine formula approximation)
  const calcDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371000; // meters
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="w-full h-full relative flex flex-col">
      

      <MapContainer center={defaultCenter} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="© OpenStreetMap contributors © CARTO"
        />

        {location && center && (
          <>
            <FlyToLocation coords={[location.coordinates[1], location.coordinates[0]]} />
            <Marker
              position={[location.coordinates[1], location.coordinates[0]]}
              icon={markerIcon}
              draggable
              eventHandlers={{
                drag: (e) => {
                  const markerPos = e.target.getLatLng();
                  const newRadius = calcDistance(
                    center.coordinates[1],
                    center.coordinates[0],
                    markerPos.lat,
                    markerPos.lng
                  );
                  setCurrentRadius(newRadius);
                  if (onRadiusChange) onRadiusChange(newRadius);
                  // Optional: keep the marker itself as the new location
                  setLocation({
                    type: "Point",
                    coordinates: [markerPos.lng, markerPos.lat],
                  });
                  onChange([markerPos.lng, markerPos.lat]);
                },
              }}
            >
              <Popup>
                Lat: {location.coordinates[1].toFixed(5)}, Lng: {location.coordinates[0].toFixed(5)}
                <br />
                Radius: {(currentRadius / 1000).toFixed(2)} km
              </Popup>
            </Marker>

            <Circle
              center={[center.coordinates[1], center.coordinates[0]]}
              radius={currentRadius}
              pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.2 }}
            />
          </>
        )}

        <LocationPicker
          onChange={(point) => {
            if (!point) return;
            setLocation(point);
            setCenter(point); // initial center for radius calculation
            setCurrentRadius(radius);
            onChange([point.coordinates[0], point.coordinates[1]]);
            if (onRadiusChange) onRadiusChange(radius);
          }}
        />
      </MapContainer>
    </div>
  );
}
