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

initLeafletIcons();

export default function LocationSettings({ setActiveTab }: any) {
  useDynamicLocation();

  const { currentLocation } = useLocationContext();
  const { data: serviceTiers } = useServiceTier();
  const { data: serviceCategories } = useServiceCategory();
  const serviceSettingsMutation = useServiceSettings();

  const { user, hydrated } = useAuthStore();

  const [status, setStatus] = useState("OFFLINE");
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tempLocation, setTempLocation] = useState<[number, number] | null>(null);
  const [locationName, setLocationName] = useState("");
  const [radius, setRadius] = useState(1000);
  const [modalOpen, setModalOpen] = useState(false);

  // ✅ IMPORTANT: default MANUAL (from backend)
  const [locationMode, setLocationMode] = useState<"CURRENT" | "MANUAL">("MANUAL");

  /* ---------------- INIT FROM BACKEND ---------------- */
  useEffect(() => {
    if (!user) return;

    setStatus(user.worker?.status ?? "OFFLINE");
    setRadius(user.worker?.serviceRadius ?? 500);

    setSelectedTiers((user.worker?.serviceTierIds ?? []).map(String));
    setSelectedCategories((user.worker?.categoryIds ?? []).map(String));

    const coords = user.worker?.location?.coordinates;

    if (coords?.length === 2) {
      const [lng, lat] = coords; // ✅ GeoJSON format

      const nLat = normalize(lat);
      const nLng = normalize(lng);

      setTempLocation([nLat, nLng]);
      setLocationMode("MANUAL"); // ✅ always from backend

      reverseGeocode(nLat, nLng).then(setLocationName);
    }
  }, [user]);

  /* ---------------- HANDLERS (ONLY USER ACTION) ---------------- */

  // ✅ When user selects CURRENT LOCATION
  const handleUseCurrentLocation = () => {
    if (!currentLocation) {
      toast.error("Unable to fetch current location");
      return;
    }

    const lat = normalize(currentLocation.lat);
    const lng = normalize(currentLocation.lng);

    setLocationMode("CURRENT");
    setTempLocation([lat, lng]);

    reverseGeocode(lat, lng).then(setLocationName);

    localStorage.setItem("locationMode", "CURRENT"); // optional
  };

  // ✅ When user selects MANUAL LOCATION (map click)
  const handleManualLocation = (lat: number, lng: number) => {
    const nLat = normalize(lat);
    const nLng = normalize(lng);

    setLocationMode("MANUAL");
    setTempLocation([nLat, nLng]);

    reverseGeocode(nLat, nLng).then(setLocationName);

    localStorage.setItem("locationMode", "MANUAL"); // optional
  };

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
        coordinates: [lng, lat], // ✅ convert back to GeoJSON
      },
    };

    serviceSettingsMutation.mutate(payload, {
      onSuccess: () => {
        useAuthStore.getState().updateWorker(payload);

        toast.success("Updated successfully");
        setModalOpen(false);
        setActiveTab("location");
      },
      onError: () => toast.error("Update failed"),
    });
  };

  /* ---------------- UI ---------------- */

  if (!hydrated) return <div className="p-6">Loading...</div>;
  if (!tempLocation) return <div className="p-6">Select location...</div>;

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
          serviceTiers={serviceTiers}
          serviceCategories={serviceCategories}
          selectedTiers={selectedTiers}
          setSelectedTiers={setSelectedTiers}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          saveChanges={saveChanges}
          onClose={() => setModalOpen(false)}

          // ✅ PASS HANDLERS
          onUseCurrentLocation={handleUseCurrentLocation}
          onManualLocation={handleManualLocation}
        />
      )}
    </div>
  );
}