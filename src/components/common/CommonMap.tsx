import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMap,
  useMapEvents,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type LocationMode = "CURRENT" | "MANUAL";

interface CommonMapProps {
  location: [number, number]; // [lat, lng]
  setLocation: (coords: [number, number]) => void;
  locationMode: LocationMode;
  radius?: number; // meters
  setRadius?: (r: number) => void;
  onLocationNameChange?: (name: string) => void;
  draggableMarker?: boolean;
  height: string | number; // map height is now required
}

// ---------- Utils ----------
export const defaultIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});


export function initLeafletIcons() {
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

export const normalize = (n: number) => parseFloat(n.toFixed(6));

export const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
    );
    const data = await res.json();
    return data.display_name ?? `${lat}, ${lng}`;
  } catch {
    return `${lat}, ${lng}`;
  }
};

// ---------- Recenter Hook ----------
const RecenterMap = ({ location }: { location: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(location, map.getZoom(), { animate: true });
  }, [map, location]);
  return null;
};

// ---------- Manual Picker Hook ----------
const ManualLocationPicker = ({
  enabled,
  onPick,
}: {
  enabled: boolean;
  onPick: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click: enabled
      ? (e: L.LeafletMouseEvent) => {
          onPick(e.latlng.lat, e.latlng.lng);
        }
      : undefined,
  });
  return null;
};

// ---------- Main Component ----------
export const CommonMap: React.FC<CommonMapProps> = ({
  location,
  setLocation,
  locationMode,
  radius = 1000,
  setRadius,
  onLocationNameChange,
  draggableMarker = true,
  height, // now required, no default
}) => {
    console.log(setRadius);
  const [currentRadius, setCurrentRadius] = useState(radius);

  useEffect(() => setCurrentRadius(radius), [radius]);

  // Update location name automatically
  useEffect(() => {
    if (onLocationNameChange) {
      reverseGeocode(location[0], location[1]).then(onLocationNameChange);
    }
  }, [location, onLocationNameChange]);

  const handleMarkerDrag = async (e: L.DragEndEvent) => {
    const pos = e.target.getLatLng();
    const lat = normalize(pos.lat);
    const lng = normalize(pos.lng);
    setLocation([lat, lng]);

    if (onLocationNameChange) {
      const name = await reverseGeocode(lat, lng);
      onLocationNameChange(name);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    const nLat = normalize(lat);
    const nLng = normalize(lng);
    setLocation([nLat, nLng]);
  };

  return (
    <MapContainer
      center={location}
      zoom={13}
      style={{ width: "100%", height: height }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

      <RecenterMap location={location} />

      <ManualLocationPicker
        enabled={locationMode === "MANUAL"}
        onPick={handleMapClick}
      />

      <Marker
        position={location}
        icon={defaultIcon}
        draggable={draggableMarker && locationMode === "MANUAL"}
        eventHandlers={{ dragend: handleMarkerDrag }}
      >
        <Popup>
          Lat: {location[0].toFixed(5)}, Lng: {location[1].toFixed(5)}
          <br />
          Radius: {(currentRadius / 1000).toFixed(2)} km
        </Popup>
      </Marker>

      <Circle
        center={location}
        radius={currentRadius}
        pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.2 }}
      />
    </MapContainer>
  );
};
