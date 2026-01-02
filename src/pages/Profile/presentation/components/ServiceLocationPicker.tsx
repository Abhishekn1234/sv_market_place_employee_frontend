import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { toast } from "react-toastify";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MAX_RADIUS = 12000;
const EDGE_TOLERANCE = 25;

export function destinationPoint(
  lat: number,
  lng: number,
  distance: number,
  bearing: number
): [number, number] {
  const R = 6371000;
  const brng = (bearing * Math.PI) / 180;
  const lat1 = (lat * Math.PI) / 180;
  const lon1 = (lng * Math.PI) / 180;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distance / R) +
      Math.cos(lat1) * Math.sin(distance / R) * Math.cos(brng)
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(distance / R) * Math.cos(lat1),
      Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2)
    );

  return [(lat2 * 180) / Math.PI, (lon2 * 180) / Math.PI];
}

export function Picker({
  location,
  setLocation,
  radius,
  setRadius,
  isManual,
}: any) {
  const draggingRef = useRef(false);

  useMapEvents({
    click(e) {
      if (isManual) {
        setLocation([e.latlng.lat, e.latlng.lng]);
      }
    },
    mousedown(e) {
      if (!location) return;
      const center = L.latLng(location);
      const d = center.distanceTo(e.latlng);
      if (Math.abs(d - radius) <= EDGE_TOLERANCE) {
        draggingRef.current = true;
      }
    },
    mousemove(e) {
      if (!draggingRef.current || !location) return;
      const center = L.latLng(location);
      let r = center.distanceTo(e.latlng);
      if (r > MAX_RADIUS) r = MAX_RADIUS;
      setRadius(r);
    },
    mouseup() {
      draggingRef.current = false;
    },
  });

  if (!location) return null;

  return (
    <>
      <Marker
        position={location}
        draggable={isManual}
        eventHandlers={{
          dragend: (e) => {
            const ll = e.target.getLatLng();
            setLocation([ll.lat, ll.lng]);
          },
        }}
      />

      <Circle
        center={location}
        radius={radius}
        pathOptions={{
          color: "#2563eb",
          fillColor: "#3b82f6",
          fillOpacity: 0.25,
        }}
      />

      <Marker
        position={destinationPoint(location[0], location[1], radius, 90)}
        icon={L.divIcon({
          className: "",
          html: `<div style="background:#fff;padding:2px 6px;border-radius:4px;font-size:12px;font-weight:600;color:#2563eb;">
            ${(radius / 1000).toFixed(2)} km
          </div>`,
        })}
        interactive={false}
      />
    </>
  );
}

type Props = {
  location: [number, number] | null;
  setLocation: (v: [number, number]) => void;
  radius: number;
  setRadius: (v: number) => void;
  mode: "current" | "manual";
  onCurrentLocation?: (loc: [number, number]) => void;
};

export default function ServiceLocationPicker({
  location,
  setLocation,
  radius,
  setRadius,
  mode,
  onCurrentLocation,
}: Props) {
  useEffect(() => {
    if (mode !== "current") return;

    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setLocation(loc);
        onCurrentLocation?.(loc);
      },
      () => toast.error("Unable to fetch location")
    );
  }, [mode]);

  return (
    <div className="h-64 rounded overflow-hidden border">
      <MapContainer
        center={location || [20, 78]}
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="© OpenStreetMap contributors © CARTO"
        />
        <Picker
          location={location}
          setLocation={setLocation}
          radius={radius}
          setRadius={setRadius}
          isManual={mode === "manual"}
        />
      </MapContainer>
    </div>
  );
}
