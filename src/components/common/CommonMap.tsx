import React, { useEffect, useState, useRef } from "react";
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
  location: [number, number];
  setLocation: (coords: [number, number]) => void;
  locationMode: LocationMode;
  radius?: number;
  setRadius?: (r: number) => void;
  onLocationNameChange?: (name: string) => void;
  draggableMarker?: boolean;
  height?: string | number;
}

/* ---------------- ICON ---------------- */

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

/* ---------------- UTILS ---------------- */

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

/* ---------------- CACHE ---------------- */

const geoCache = new Map<string, string>();

const getLocationName = async (lat: number, lng: number) => {
  const key = `${lat.toFixed(5)}-${lng.toFixed(5)}`;

  if (geoCache.has(key)) {
    return geoCache.get(key)!;
  }

  const name = await reverseGeocode(lat, lng);

  geoCache.set(key, name);

  return name;
};

/* ---------------- MAP HELPERS ---------------- */

const RecenterMap = ({ location }: { location: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(location, map.getZoom(), { animate: true });
  }, [map, location]);

  return null;
};

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

/* ---------------- MAIN COMPONENT ---------------- */

export const CommonMap: React.FC<CommonMapProps> = ({
  location,
  setLocation,
  locationMode,
  radius = 1000,
  setRadius,
  onLocationNameChange,
  draggableMarker = true,
  height,
}) => {
  const [currentRadius, setCurrentRadius] = useState(radius);

  const debounceRef = useRef<number| null>(null);



  useEffect(() => {
    setCurrentRadius(radius);
  }, [radius]);

  /* Cleanup debounce */

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  /* -------- Optimized Reverse Geocode -------- */

  useEffect(() => {
    if (!onLocationNameChange) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      getLocationName(location[0], location[1]).then(onLocationNameChange);
    }, 400);
  }, [location, onLocationNameChange]);

  /* -------- Marker Drag -------- */

  const handleMarkerDrag = (e: L.DragEndEvent) => {
    const pos = e.target.getLatLng();

    const lat = normalize(pos.lat);
    const lng = normalize(pos.lng);

    setLocation([lat, lng]);
  };

  /* -------- Map Click -------- */

  const handleMapClick = (lat: number, lng: number) => {
    const nLat = normalize(lat);
    const nLng = normalize(lng);

    setLocation([nLat, nLng]);
  };

  /* -------- Radius Change -------- */

  const handleRadiusChange = (r: number) => {
    setCurrentRadius(r);
    setRadius?.(r);
  };

  return (
    <div
      className="w-full rounded-md overflow-hidden border"
      style={{ height: height ?? undefined }}
    >
      <MapContainer
        center={location}
        zoom={13}
        style={{
          width: "100%",
          height: height ? height : "14rem",
        }}
        className="sm:h-64 md:h-72 lg:h-80 xl:h-96 2xl:h-[600px]"
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
          pathOptions={{
            color: "blue",
            fillColor: "blue",
            fillOpacity: 0.2,
          }}
        />
      </MapContainer>

      {/* Optional Radius Slider */}

      {setRadius && (
        <div className="p-2 bg-white border-t">
          <label className="text-sm font-medium">
            Radius: {(currentRadius / 1000).toFixed(2)} km
          </label>

          <input
            type="range"
            min={100}
            max={5000}
            step={100}
            value={currentRadius}
            onChange={(e) => handleRadiusChange(Number(e.target.value))}
            className="w-full mt-1"
          />
        </div>
      )}
    </div>
  );
};