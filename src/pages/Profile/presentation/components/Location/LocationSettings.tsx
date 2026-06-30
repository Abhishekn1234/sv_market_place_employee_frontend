"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocationContext } from "@/context/presentation/components/LocationContext";
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
import { useLocation as useRouterLocation } from "react-router-dom";

initLeafletIcons();

export default function LocationSettings() {
  useDynamicLocation();

  const queryClient = useQueryClient();
  const { currentLocation } = useLocationContext();

  const { data: serviceTiers } = useServiceTier();
  const { data: serviceCategories } = useServiceCategory();
  const serviceSettingsMutation = useServiceSettings();

  const { data: profile, isLoading } = useProfile();
  const updateWorker = useAuthStore((s) => s.updateWorker);

  const routeLocation = useRouterLocation();

  const incomingLat = routeLocation.state?.lat;
  const incomingLng = routeLocation.state?.lng;

  const [status, setStatus] = useState("OFFLINE");
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tempLocation, setTempLocation] = useState<[number, number] | null>(null);
  const [locationName, setLocationName] = useState("");
  const [radius, setRadius] = useState(1000);
  const [modalOpen, setModalOpen] = useState(false);

  const worker = profile?.worker;

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    if (!worker) return;

    setStatus(worker?.status ?? "OFFLINE");
    setRadius(worker?.serviceRadius ?? 5);

    setSelectedCategories((worker?.categories ?? []).map((c: any) => String(c._id)));
    setSelectedTiers((worker?.serviceTiers ?? []).map((t: any) => String(t._id)));

    if (incomingLat && incomingLng) {
      const nLat = normalize(incomingLat);
      const nLng = normalize(incomingLng);

      setTempLocation([nLat, nLng]);
      reverseGeocode(nLat, nLng).then(setLocationName);
      return;
    }

    const coords = worker?.location?.coordinates;

    if (coords?.length === 2) {
      const [lng, lat] = coords;

      const nLat = normalize(lat);
      const nLng = normalize(lng);

      setTempLocation([nLat, nLng]);
      reverseGeocode(nLat, nLng).then(setLocationName);
    }
  }, [worker]);

  /* ---------------- CURRENT LOCATION ---------------- */
  const handleUseCurrentLocation = () => {
    if (!currentLocation) {
      toast.error("Unable to fetch current location");
      return;
    }

    const lat = normalize(currentLocation.lat);
    const lng = normalize(currentLocation.lng);

    setTempLocation([lat, lng]);
    reverseGeocode(lat, lng).then(setLocationName);
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
        coordinates: [lng, lat],
      },
    };

    serviceSettingsMutation.mutate(payload, {
      onSuccess: (res: any) => {
        toast.success("Updated successfully");

        // ✅ FULL SAFE CACHE UPDATE (NO STALE DATA)
        queryClient.setQueryData(["profile"], (old: any) => {
          if (!old) return old;

          return {
            ...old,
            worker: {
              ...old.worker,
              ...res, // backend should ideally return full worker
            },
          };
        });

        // zustand sync
        updateWorker(res);

        setModalOpen(false);
      },

      onError: (err: any) => {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Update failed";

        toast.error(message);
      },
    });
  };

  if (isLoading) return <CommonSpinner />;
  if (!profile) return <div className="p-6">No profile found</div>;
  if (!tempLocation) return <div className="p-6">Select location...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <EmployeeDetails
        user={worker}
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
        />
      )}
    </div>
  );
}