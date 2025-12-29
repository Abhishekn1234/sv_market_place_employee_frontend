import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useServiceTier } from "@/pages/Servicesettings/presentation/hooks/useServiceTier";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PencilIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useServiceSettings } from "@/pages/Servicesettings/presentation/hooks/useServicesettings";
import type { WorkerPayload } from "@/pages/Servicesettings/domain/entities/servicesettings";

// Fix default marker icon for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});


async function getPlaceFromCoordinates(lat: number, lng: number) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch location data");

    const data = await res.json();

    // Extract display_name (full address)
    const fullName: string = data.display_name || "Unknown location";

    // Extract a short name (prefer city, village, hamlet, road, etc.)
    const addr = data.address;
    const shortName =
      addr?.city ||
      addr?.town ||
      addr?.village ||
      addr?.hamlet ||
      addr?.road ||
      "Unknown location";

    return { fullName, shortName };
  } catch (err) {
    console.error("Error fetching location:", err);
    return { fullName: "Unknown location", shortName: "Unknown location" };
  }
}




function destinationPoint(
  lat: number,
  lng: number,
  distance: number, // in meters
  bearing: number // in degrees
): [number, number] {
  const R = 6371000; // Earth radius in meters
  const bearingRad = (bearing * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;

  const newLat = Math.asin(
    Math.sin(latRad) * Math.cos(distance / R) +
      Math.cos(latRad) * Math.sin(distance / R) * Math.cos(bearingRad)
  );
  const newLng =
    lngRad +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(distance / R) * Math.cos(latRad),
      Math.cos(distance / R) - Math.sin(latRad) * Math.sin(newLat)
    );

  return [(newLat * 180) / Math.PI, (newLng * 180) / Math.PI];
}

// Map picker component
function LocationPicker({
  location,
  setLocation,
  radius,
  setRadius,
  isManual = true,
}: {
  location: [number, number] | null;
  setLocation: (loc: [number, number]) => void;
  radius?: number;
  setRadius?: (r: number) => void;
  isManual?: boolean;
}) {
  const draggingRef = useRef(false);
  const MAX_RADIUS = 12000; // 12 km in meters

  useMapEvents({
    click(e) {
      if (isManual) setLocation([e.latlng.lat, e.latlng.lng]);
    },
    mousedown(e) {
      if (!radius || !setRadius || !location) return;
      const dist = L.latLng(location).distanceTo(e.latlng);
      if (Math.abs(dist - radius) < 20) draggingRef.current = true; // 20m tolerance
    },
    mouseup() {
      draggingRef.current = false;
    },
    mousemove(e) {
      if (draggingRef.current && radius && setRadius && location) {
        let newRadius = L.latLng(location).distanceTo(e.latlng);
        if (newRadius > MAX_RADIUS) newRadius = MAX_RADIUS;
        setRadius(newRadius);
      }
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
            const latlng = e.target.getLatLng();
            setLocation([latlng.lat, latlng.lng]);
          },
        }}
      />

     {radius && (
  <>
    <Circle
      center={location}
      radius={radius}
      pathOptions={{ color: "blue", fillOpacity: 0.2 }}
    />
    <Marker
      position={destinationPoint(location[0], location[1], radius, 90)} // east side
      icon={L.divIcon({
        className: "text-blue-800 font-bold bg-white p-1 rounded",
        html: `${(radius / 1000).toFixed(2)} km`,
      })}
      interactive={false}
    />
  </>
)}

    </>
  );
}

export default function LocationSettings() {
  const [userData, setUserData] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState<[number, number] | null>(null);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [locationMode, setLocationMode] = useState<"current" | "manual">("manual");

  const { data: serviceTiers } = useServiceTier();
  const { data: serviceCategories } = useServiceCategory();
// const setCurrentLocation = () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setTempLocation([latitude, longitude]);
//         getPlaceFromCoordinates(latitude, longitude).then(({ shortName }) => setLocationName(shortName));
//       },
//       (err) => {
//         console.error(err);
//         alert("Unable to get current location.");
//       }
//     );
//   } else {
//     alert("Geolocation is not supported by your browser.");
//   }
// };

  const getTierNames = (ids: string[]) => {
    if (!serviceTiers) return [];
    return serviceTiers.filter((tier: any) => ids.includes(tier._id)).map((tier: any) => tier.displayName);
  };

  const getCategoryNames = (ids: string[]) => {
    if (!serviceCategories) return [];
    return serviceCategories.filter((cat: any) => ids.includes(cat._id)).map((cat: any) => cat.name);
  };

  useEffect(() => {
    const employeeData = localStorage.getItem("employeeData");
    if (employeeData) {
      const parsedData = JSON.parse(employeeData);
      const user = parsedData.user;
      if (user) {
        setUserData(user);
        setSelectedTiers(user.serviceTierIds || []);
        setSelectedCategories(user.categoryIds || []);

        if (user.location?.coordinates?.length === 2) {
          const [lng, lat] = user.location.coordinates;
          setTempLocation([lat, lng]);
          getPlaceFromCoordinates(lat, lng).then(({ shortName }) => setLocationName(shortName));
        }
      }
    }
  }, []);
const [radius, setRadius] = useState<number>(500); 
  const openEditModal = () => {
    setModalOpen(true);
  };
const serviceSettingsMutation=useServiceSettings();
const saveChanges = () => {
  if (!userData) return;

 const payload: WorkerPayload = {
  categoryIds: selectedCategories,
  serviceTierIds: selectedTiers,
  status: userData.status,
  location: tempLocation
    ? {
        type: "Point",
        coordinates: [tempLocation[1], tempLocation[0]], // lng, lat
      }
    : undefined,
  serviceRadius: radius /100, // save radius in meters
};
console.log(payload);


  serviceSettingsMutation.mutate(payload, {
    onSuccess: () => {
      // update UI state
      setUserData((prev: any) => ({
        ...prev,
        ...payload,
      }));

      if (tempLocation) {
        getPlaceFromCoordinates(
          tempLocation[0],
          tempLocation[1]
        ).then(({ shortName }) => setLocationName(shortName));
      }

      setModalOpen(false);
    },
  });
};
const handleCurrentLocation = () => {
  if (!navigator.geolocation) {
    toast.error("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    const newLocation: [number, number] = [latitude, longitude];

    // Previous location from user data
    const prevCoordinates = userData.location?.coordinates;
    const prevLocation: [number, number] | null = prevCoordinates
      ? [prevCoordinates[1], prevCoordinates[0]] // stored as [lng, lat]
      : null;

    if (
      prevLocation &&
      (prevLocation[0] !== newLocation[0] || prevLocation[1] !== newLocation[1])
    ) {
      // Show toast notification with action
      toast.info(
        <div>
          Your previous location is different.{" "}
          <button
            onClick={async () => {
              setTempLocation(prevLocation);
              const { shortName } = await getPlaceFromCoordinates(
                prevLocation[0],
                prevLocation[1]
              );
              setLocationName(shortName);
              toast.dismiss(); // close the toast
            }}
            className="underline ml-2 text-blue-600 hover:text-blue-800"
          >
            Revert
          </button>
        </div>,
        {
          autoClose: false, // keep the notification until user clicks
          closeOnClick: false,
        }
      );
    }

    // Set current location anyway
    setTempLocation(newLocation);
    const { shortName } = await getPlaceFromCoordinates(latitude, longitude);
    setLocationName(shortName);
  });
};



  if (!userData) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
    {/* Header */}
    <div className="flex items-center justify-between border-b pb-4 mb-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Employee Details
      </h2>

      <Button
        onClick={openEditModal}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
      >
        <PencilIcon className="w-4 h-4" />
        Edit
      </Button>
    </div>

    {/* Details Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
      <div>
        <p className="text-sm text-gray-500">Status</p>
        <p className="text-base font-medium text-gray-900">
          {userData.status}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Location</p>
        <p className="text-base font-medium text-gray-900">
          {locationName || "No location available"}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Service Tiers</p>
        <p className="text-base font-medium text-gray-900">
          {getTierNames(userData.serviceTierIds).join(", ") || "-"}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Service Categories</p>
        <p className="text-base font-medium text-gray-900">
          {getCategoryNames(userData.categoryIds).join(", ") || "-"}
        </p>
      </div>
    </div>

      {/* Modal */}
    {/* Modal */}
{modalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative border border-gray-200">
      <h3 className="text-xl font-bold mb-4">Edit Employee Details</h3>
           <div className="mb-4 flex gap-4 items-center">
  <label className="flex items-center gap-2">
   <input
  type="radio"
  name="locationMode"
  value="current"
  checked={locationMode === "current"}
  onChange={() => {
    setLocationMode("current");
    handleCurrentLocation();
  }}
/>

    Use Current Location
  </label>

  <label className="flex items-center gap-2">
    <input
      type="radio"
      name="locationMode"
      value="manual"
      checked={locationMode === "manual"}
      onChange={() => setLocationMode("manual")}
    />
    Pick Location on Map
  </label>
</div>
      {/* Location Map */}
      <div className="mb-6 h-64 rounded overflow-hidden border">
       

      <MapContainer
          center={tempLocation || [20, 78]}
          zoom={13}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="© OpenStreetMap contributors © CARTO"
          />
       <LocationPicker
            location={tempLocation}
            setLocation={setTempLocation}
            radius={radius}
            setRadius={setRadius}
            isManual={locationMode === "manual"}
          />



        </MapContainer>
      </div>

      {/* Radius Input */}
    


      {/* Service Tiers */}
      <div className="mb-4">
        <Label className="block font-semibold mb-2">Service Tiers</Label>
        <div className="flex flex-wrap gap-2">
          {serviceTiers?.map((tier: any) => (
            <label
              key={tier._id}
              className={`flex items-center gap-2 px-3 py-1 border rounded-full cursor-pointer
                ${selectedTiers.includes(tier._id) ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-800 border-gray-300"}`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={selectedTiers.includes(tier._id)}
                onChange={() => {
                  setSelectedTiers((prev) =>
                    prev.includes(tier._id)
                      ? prev.filter((id) => id !== tier._id)
                      : [...prev, tier._id]
                  );
                }}
              />
              {tier.displayName}
            </label>
          ))}
        </div>
      </div>

      {/* Service Categories */}
      <div className="mb-6">
        <Label className="block font-semibold mb-2">Service Categories</Label>
        <div className="flex flex-wrap gap-2">
          {serviceCategories?.map((cat: any) => (
            <label
              key={cat._id}
              className={`flex items-center gap-2 px-3 py-1 border rounded-full cursor-pointer
                ${selectedCategories.includes(cat._id) ? "bg-green-600 text-white border-green-600" : "bg-gray-100 text-gray-800 border-gray-300"}`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={selectedCategories.includes(cat._id)}
                onChange={() => {
                  setSelectedCategories((prev) =>
                    prev.includes(cat._id)
                      ? prev.filter((id) => id !== cat._id)
                      : [...prev, cat._id]
                  );
                }}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => setModalOpen(false)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </Button>
        <Button
          onClick={saveChanges}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </Button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
