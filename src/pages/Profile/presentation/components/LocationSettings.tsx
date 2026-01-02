import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PencilIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useServiceTier } from "@/pages/Servicesettings/presentation/hooks/useServiceTier";
import { useServiceSettings } from "@/pages/Servicesettings/presentation/hooks/useServicesettings";
import type { WorkerPayload } from "@/pages/Servicesettings/domain/entities/servicesettings";
import { useLocationContext } from "@/context/LocationContext";


export const getPlaceFromCoordinates = async (
  lat?: number,
  lng?: number
): Promise<{ shortName: string }> => {
  try {
    if (lat === undefined || lng === undefined) {
      const position: GeolocationPosition = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject("Geolocation not supported");
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          maximumAge: 0,
        });
      });
      lat = position.coords.latitude;
      lng = position.coords.longitude;
    }

    const res = await fetch(
      `/nominatim/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
    );
    if (!res.ok) throw new Error("Failed to fetch location");
    const data = await res.json();
    const addr = data.address || {};
    const shortName =
      addr.village ||
      addr.town ||
      addr.city ||
      addr.hamlet ||
      addr.road ||
      addr.county ||
      addr.state ||
      "Unknown location";
    return { shortName };
  } catch (err) {
    console.error("getPlaceFromCoordinates error:", err);
    return { shortName: "Unknown location" };
  }
};

/* ---------------- Leaflet marker fix ---------------- */
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

/* ---------------- Props ---------------- */
interface LocationSettingsProps {
  setActiveTab?: (tab: "profile" | "password" | "location") => void;
}

/* ---------------- RecenterMap ---------------- */
const RecenterMap = ({ location }: { location: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (!location) return;
    const center = map.getCenter();
    if (center.lat !== location[0] || center.lng !== location[1]) {
      map.setView(location, map.getZoom(), { animate: true });
    }
  }, [location, map]);
  return null;
};

/* ---------------- LocationPicker ---------------- */
function LocationPicker({
  location,
  setLocation,
  radius,
  setRadius,
  isManual,
  onLocationChange,
}: {
  location: [number, number];
  setLocation: (loc: [number, number]) => void;
  radius: number;
  setRadius: (r: number) => void;
  isManual: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
}) {
  const draggingRef = useRef(false);

  const MapEventsWrapper = () => {
    const map = useMap();
    useEffect(() => {
      if (!isManual) return;

      const onClick = (e: any) => {
        const newLoc: [number, number] = [e.latlng.lat, e.latlng.lng];
        setLocation(newLoc);
        onLocationChange?.(newLoc[0], newLoc[1]);
      };

      const onMouseDown = (e: any) => {
        if (Math.abs(L.latLng(location).distanceTo(e.latlng) - radius) <= EDGE_TOLERANCE) {
          draggingRef.current = true;
        }
      };

      const onMouseMove = (e: any) => {
        if (!draggingRef.current) return;
        setRadius(Math.min(L.latLng(location).distanceTo(e.latlng), MAX_RADIUS));
      };

      const onMouseUp = () => (draggingRef.current = false);

      map.on("click", onClick);
      map.on("mousedown", onMouseDown);
      map.on("mousemove", onMouseMove);
      map.on("mouseup", onMouseUp);

      return () => {
        map.off("click", onClick);
        map.off("mousedown", onMouseDown);
        map.off("mousemove", onMouseMove);
        map.off("mouseup", onMouseUp);
      };
    }, [map, location, radius, isManual]);

    return null;
  };

  return (
    <>
      <Marker
        position={location}
        draggable={isManual}
        eventHandlers={{
          dragend: (e) => {
            const newLoc: [number, number] = [
              e.target.getLatLng().lat,
              e.target.getLatLng().lng,
            ];
            setLocation(newLoc);
            onLocationChange?.(newLoc[0], newLoc[1]);
          },
        }}
      />
      <Circle center={location} radius={radius} />
      <Marker
        position={[location[0], location[1] + radius / 111000]}
        icon={L.divIcon({
          html: `<div style="background:white;padding:2px 6px;border-radius:4px;font-size:12px;font-weight:600">${
            (radius / 1000).toFixed(2)
          } km</div>`,
        })}
      />
      <MapEventsWrapper />
    </>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function LocationSettings({ setActiveTab }: LocationSettingsProps) {
  const { currentLocation } = useLocationContext();
  const [userData, setUserData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState<[number, number] | null>(null);
  const [locationMode, setLocationMode] = useState<"current" | "manual">("manual");
  const [radius, setRadius] = useState(500);
  const [lastNotifiedLocation, setLastNotifiedLocation] = useState<string>(
    localStorage.getItem("lastNotifiedLocation") || "-"
  );
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: serviceTiers } = useServiceTier();
  const { data: serviceCategories } = useServiceCategory();
  const serviceSettingsMutation = useServiceSettings();

  /* ---------------- Load user data ---------------- */
  useEffect(() => {
    const stored = localStorage.getItem("employeeData");
    if (!stored) return;
    const parsed = JSON.parse(stored).user;
    setUserData(parsed);
    setSelectedTiers(parsed.serviceTierIds || []);
    setSelectedCategories(parsed.categoryIds || []);
    if (parsed.location?.coordinates?.length === 2) {
      const [lng, lat] = parsed.location.coordinates;
      setTempLocation([lat, lng]);
    }
  }, []);

  /* ---------------- Sync with currentLocation ---------------- */
  useEffect(() => {
    if (locationMode === "current" && currentLocation) {
      setTempLocation([currentLocation.lat, currentLocation.lng]);
      updateLocation(currentLocation.lat, currentLocation.lng);
    }
  }, [currentLocation, locationMode]);

  /* ---------------- Update location name + localStorage ---------------- */
  const updateLocation = async (lat: number, lng: number) => {
    try {
      const { shortName } = await getPlaceFromCoordinates(lat, lng);
      setLastNotifiedLocation(shortName);
      localStorage.setItem("lastNotifiedLocation", shortName);

      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "LOCATION_NOTIFICATION",
          payload: {
            title: "Location Changed",
            body: shortName,
            placeName: shortName,
          },
        });
      }
    } catch (err) {
      console.error("Failed to update location name", err);
    }
  };

  /* ---------------- Save changes ---------------- */
  const saveChanges = () => {
    if (!userData || !tempLocation) return;

    const payload: WorkerPayload = {
      status: userData.status,
      serviceTierIds: selectedTiers,
      categoryIds: selectedCategories,
      location: { type: "Point", coordinates: [tempLocation[1], tempLocation[0]] },
      serviceRadius: radius,
    };

    serviceSettingsMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Updated successfully");
        setModalOpen(false);
        setActiveTab?.("profile");
      },
      onError: () => toast.error("Update failed"),
    });
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Employee Details</h2>
        <Button onClick={() => setModalOpen(true)}>
          <PencilIcon className="w-4 h-4 mr-2" /> Edit
        </Button>
      </div>

      {/* -------- Employee info -------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-medium capitalize">{userData.status || "-"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Location</p>
          <p className="font-medium">{lastNotifiedLocation || "-"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Service Tiers</p>
          <p className="font-medium">
            {serviceTiers
              ?.filter((t: any) => selectedTiers.includes(t._id))
              .map((t: any) => t.displayName)
              .join(", ") || "-"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Service Categories</p>
          <p className="font-medium">
            {serviceCategories
              ?.filter((c: any) => selectedCategories.includes(c._id))
              .map((c: any) => c.name)
              .join(", ") || "-"}
          </p>
        </div>
      </div>

      {/* -------- Edit modal -------- */}
      {modalOpen && tempLocation && (
        <div className="mt-4 border rounded p-4 space-y-4">
          {/* Location Mode */}
          <div className="flex gap-4">
            {["current", "manual"].map((m) => (
              <label key={m} className="flex gap-2 items-center">
                <input
                  type="radio"
                  checked={locationMode === m}
                  onChange={() => setLocationMode(m as any)}
                />
                {m}
              </label>
            ))}
          </div>

          {/* Map */}
          <MapContainer center={tempLocation} zoom={13} className="h-64">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <RecenterMap location={tempLocation} />
            <LocationPicker
              location={tempLocation}
              setLocation={setTempLocation}
              radius={radius}
              setRadius={setRadius}
              isManual={locationMode === "manual"}
              onLocationChange={updateLocation} // <-- manual updates
            />
          </MapContainer>

          {/* Service Tiers */}
          <div>
            <Label className="font-semibold">Service Tiers</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {serviceTiers?.map((tier: any) => (
                <button
                  key={tier._id}
                  onClick={() =>
                    setSelectedTiers((p) =>
                      p.includes(tier._id) ? p.filter((i) => i !== tier._id) : [...p, tier._id]
                    )
                  }
                  className={`px-3 py-1 rounded-full border ${
                    selectedTiers.includes(tier._id)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  {tier.displayName}
                </button>
              ))}
            </div>
          </div>

          {/* Service Categories */}
          <div>
            <Label className="font-semibold">Service Categories</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {serviceCategories?.map((cat: any) => (
                <button
                  key={cat._id}
                  onClick={() =>
                    setSelectedCategories((p) =>
                      p.includes(cat._id) ? p.filter((i) => i !== cat._id) : [...p, cat._id]
                    )
                  }
                  className={`px-3 py-1 rounded-full border ${
                    selectedCategories.includes(cat._id)
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveChanges}>Update</Button>
          </div>
        </div>
      )}
    </div>
  );
}
