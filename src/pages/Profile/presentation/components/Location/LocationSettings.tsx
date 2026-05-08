"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocationContext } from "@/context/LocationContext";
import { useDynamicLocation } from "@/utils/useNotification";
import { useServiceTier } from "@/pages/Servicesettings/presentation/hooks/useServiceTier";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useServiceSettings } from "@/pages/Servicesettings/presentation/hooks/useServicesettings";

import { useProfile } from "@/pages/Profile/presentation/hooks/useProfile";

import {
  initLeafletIcons,
  normalize,
  reverseGeocode,
} from "@/components/common/CommonMap";

import EmployeeDetails from "./EmployeeDetails";
import LocationModal from "./LocationModal";
import type { WorkerPayload } from "@/pages/Servicesettings/domain/entities/workerpayload";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/core/store/auth";
import CommonSpinner from "@/components/common/CommonSpinner";

initLeafletIcons();

export default function LocationSettings({ setActiveTab }: any) {
  useDynamicLocation();
 const queryClient = useQueryClient();
  const { currentLocation } = useLocationContext();
  const { data: serviceTiers } = useServiceTier();
  const { data: serviceCategories } = useServiceCategory();
  const serviceSettingsMutation = useServiceSettings();

  // ✅ replaced auth store with react-query profile
  const { data: profile, isLoading } = useProfile();
  const updateWorker = useAuthStore((s) => s.updateWorker);

  const [status, setStatus] = useState("OFFLINE");
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tempLocation, setTempLocation] = useState<[number, number] | null>(null);
  const [locationName, setLocationName] = useState("");
  const [radius, setRadius] = useState(1000);
  const [modalOpen, setModalOpen] = useState(false);

  const [locationMode, setLocationMode] =
    useState<"CURRENT" | "MANUAL">("MANUAL");

  /* ---------------- INIT FROM PROFILE ---------------- */
useEffect(() => {
  if (!profile) return;

  const worker = profile.worker;

  setStatus(worker?.status ?? "OFFLINE");

  // ✅ FIX: convert km → meters
  const radiusKm = worker?.serviceRadius ?? 5;
  setRadius(radiusKm);

  // ✅ FIX: ensure correct mapping
    setSelectedCategories(
    (worker?.categories ?? []).map((c: any) => String(c._id))
  );

  setSelectedTiers(
    (worker?.serviceTiers ?? []).map((t: any) => String(t._id)));

  const coords = worker?.location?.coordinates;

  if (coords?.length === 2) {
    const [lng, lat] = coords;

    const nLat = normalize(lat);
    const nLng = normalize(lng);

    setTempLocation([nLat, nLng]);

    // ❗ FIX: detect correct mode
    setLocationMode("MANUAL");

    reverseGeocode(nLat, nLng).then(setLocationName);
  }
}, [profile?.worker]);

  /* ---------------- CURRENT LOCATION ---------------- */
 const handleUseCurrentLocation = () => {
  if (!currentLocation) {
    toast.error("Unable to fetch current location");
    return;
  }

  const lat = normalize(currentLocation.lat);
  const lng = normalize(currentLocation.lng);

  setLocationMode("CURRENT"); // ✅ correct
  setTempLocation([lat, lng]);

  reverseGeocode(lat, lng).then(setLocationName);
};

const handleManualLocation = (lat: number, lng: number) => {
  const nLat = normalize(lat);
  const nLng = normalize(lng);

  setLocationMode("MANUAL");

  setTempLocation([nLat, nLng]);

  reverseGeocode(nLat, nLng).then(setLocationName);
};

  /* ---------------- MANUAL LOCATION ---------------- */
 

  /* ---------------- SAVE ---------------- */
 const saveChanges = () => {
  if (!tempLocation) return;

  const [lat, lng] = tempLocation;

  if (lat === 0 && lng === 0) {
    toast.error("Please select a valid location");
    return;
  }

  const MAX_RADIUS_KM = 45;
  if (radius / 1000 > MAX_RADIUS_KM) {
    toast.error(`Service radius cannot exceed ${MAX_RADIUS_KM} km`);
    return;
  }

  const payload: WorkerPayload = {
    status,
    serviceTierIds: selectedTiers,
    categoryIds: selectedCategories,
    serviceRadius: radius,
    location: {
      type: "Point",
      coordinates: [lng, lat],
    },
  };

  serviceSettingsMutation.mutate(payload, {
  onSuccess: (res) => {
  toast.success("Updated successfully");

  // ✅ 1. Update React Query cache
  queryClient.setQueryData(["profile"], (old: any) => {
    if (!old) return old;

    return {
      ...old,
      worker: {
        ...old.worker,
        categories: res.categories,
        serviceTiers: res.serviceTiers,
        status: res.status,
        serviceRadius: res.serviceRadius,
        location: res.location,
      },
    };
  });

  // ✅ 2. Update Zustand (VERY IMPORTANT)
  updateWorker({
    categories: res.categories,
    serviceTiers: res.serviceTiers,
    status: res.status,
    serviceRadius: res.serviceRadius,
    location: res.location,
  });

  // ✅ 3. UI updates
  setModalOpen(false);
  setActiveTab("location");
},

    onError: (err: any) => {
  const message =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Update failed";

  toast.error(message);
  console.error(err);
},
  });
};

  /* ---------------- UI STATES ---------------- */
  if (isLoading) return <CommonSpinner/>;
  if (!profile) return <div className="p-6">No profile found</div>;
  if (!tempLocation) return <div className="p-6">Select location...</div>;

 

  return (
    <div className="max-w-3xl mx-auto p-6">
      <EmployeeDetails
        user={profile}
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
          serviceTiers={serviceTiers}
          serviceCategories={serviceCategories}
          selectedTiers={selectedTiers}
          setSelectedTiers={setSelectedTiers}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          saveChanges={saveChanges}
          onClose={() => setModalOpen(false)}
          onUseCurrentLocation={handleUseCurrentLocation}
          onManualLocation={handleManualLocation}
        />
      )}
    </div>
  );
}