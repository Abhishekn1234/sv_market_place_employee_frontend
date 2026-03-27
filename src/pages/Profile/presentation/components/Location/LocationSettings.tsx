"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocationContext } from "@/context/LocationContext";
import { useDynamicLocation } from "@/utils/useNotification";
import { useServiceTier } from "@/pages/Servicesettings/presentation/hooks/useServiceTier";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useServiceSettings } from "@/pages/Servicesettings/presentation/hooks/useServicesettings";
import { useAuthStore } from "@/core/store/auth";
import {
  initLeafletIcons,
  normalize,
  reverseGeocode,
} from "@/components/common/CommonMap";

import EmployeeDetails from "./EmployeeDetails";
import LocationModal from "./LocationModal";

import type { WorkerPayload } from "@/pages/Servicesettings/domain/entities/servicesettings";
import type { TabType } from "@/pages/Profile/domain/entities/tabtype";

initLeafletIcons();

interface Props {
  setActiveTab: (tab: TabType) => void;
}

export default function LocationSettings({ setActiveTab }: Props) {
  useDynamicLocation();

  const { currentLocation } = useLocationContext();
  const { data: serviceTiers } = useServiceTier();
  const { data: serviceCategories } = useServiceCategory();
  const serviceSettingsMutation = useServiceSettings();

  const user = useAuthStore((state) => state.user);

  // ✅ STATES
  const [status, setStatus] = useState("OFFLINE");
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tempLocation, setTempLocation] = useState<[number, number] | null>(null);
  const [locationName, setLocationName] = useState("");
  const [radius, setRadius] = useState(1000);
  const [modalOpen, setModalOpen] = useState(false);
  const [locationMode, setLocationMode] = useState<"CURRENT" | "MANUAL">(
    "CURRENT"
  );

  // ---------------- INIT ----------------
 useEffect(() => {
  if (!user) return;

  setStatus(user.worker?.status ?? "OFFLINE");
  setRadius(user.worker?.serviceRadius ?? 500);

  setSelectedTiers((user.worker?.serviceTierIds ?? []).map(String));
  setSelectedCategories((user.worker?.categoryIds ?? []).map(String));

  const coords = user.worker?.location?.coordinates;

  if (coords?.length === 2 && coords[0] !== 0 && coords[1] !== 0) {
    const [lng, lat] = coords;

    const nLat = normalize(lat);
    const nLng = normalize(lng);

    setTempLocation([nLat, nLng]);
    setLocationMode("MANUAL");

    reverseGeocode(nLat, nLng).then(setLocationName);
  }
}, [user]); // ✅ FIXED

  // ---------------- CURRENT LOCATION ----------------
  useEffect(() => {
    if (!currentLocation || locationMode !== "CURRENT" || !modalOpen) return;

    const lat = normalize(currentLocation.lat);
    const lng = normalize(currentLocation.lng);

    setTempLocation([lat, lng]);
    reverseGeocode(lat, lng).then(setLocationName);
  }, [currentLocation, locationMode, modalOpen]);

  // ---------------- SAVE ----------------
  const saveChanges = () => {
    if (!tempLocation) return;

    const [lat, lng] = tempLocation;

    const MAX_RADIUS_KM = 15;
    if (radius / 1000 > MAX_RADIUS_KM) {
      toast.error(`Service radius cannot exceed ${MAX_RADIUS_KM} km`);
      return;
    }

    const payload: WorkerPayload = {
      status,
      serviceTierIds: selectedTiers,
      categoryIds: selectedCategories,
      serviceRadius: radius,
      location: { type: "Point", coordinates: [lng, lat] },
    };

    serviceSettingsMutation.mutate(payload, {
      onSuccess: () => {
        // ✅ Sync Zustand store
        useAuthStore.getState().updateWorker({
          serviceTierIds: selectedTiers,
          categoryIds: selectedCategories,
          serviceRadius: radius,
          location: { type: "Point", coordinates: [lng, lat] },
        });

        toast.success("Updated successfully");
        setModalOpen(false);
        setActiveTab("location");
      },
      onError: () => toast.error("Update failed"),
    });
  };

  // ---------------- LOADING STATES ----------------
  if (!serviceTiers || !serviceCategories) {
    return <div className="p-6">Loading services...</div>;
  }

  if (!tempLocation) return null;

  // ---------------- UI ----------------
  return (
    <div className="max-w-3xl mx-auto p-6">
          <EmployeeDetails
        user={user}   
        status={status}
        locationName={locationName}
        serviceTiers={serviceTiers}
        serviceCategories={serviceCategories}
        selectedTiers={selectedTiers}
        selectedCategories={selectedCategories}
        onEdit={() => setModalOpen(true)}
      />
      {modalOpen && (
        <LocationModal
          tempLocation={tempLocation}
          locationMode={locationMode}
          setLocationMode={setLocationMode}
          setTempLocation={setTempLocation}
          locationName={locationName}
          setLocationName={setLocationName}
          radius={radius}
          setRadius={setRadius}

          // ✅ IMPORTANT (for selection UI)
          serviceTiers={serviceTiers}
          serviceCategories={serviceCategories}
          selectedTiers={selectedTiers}
          setSelectedTiers={setSelectedTiers}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}

          saveChanges={saveChanges}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}