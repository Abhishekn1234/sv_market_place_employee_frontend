"use client";

import * as React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useServiceSettings } from "./hooks/useServicesettings";
import { useServiceTier } from "./hooks/useServiceTier";
import { useServiceCategory } from "./hooks/useServiceCategory";

import type { GeoPoint } from "@/pages/Profile/domain/entities/location";
import type { WorkerPayload } from "../domain/entities/servicesettings";
import type { ServiceCategory } from "../domain/entities/servicecategory";
import type { ServiceTier } from "../domain/entities/servicetier";

import { ServiceSelection } from "./components/Serviceselection";
import { LocationSelection } from "./components/LocationSelection";
import { OnboardingActions } from "./components/OnboardingActions";
import { CommonCard } from "@/components/common/CommonCard";
import { useAuthStore } from "@/core/store/auth";
import type { WorkerStatus } from "../domain/entities/workerstatus";

export default function MultiSelectDropdownCard() {
  const [selectedServices, setSelectedServices] = React.useState<ServiceCategory[]>([]);
  const [selectedTiers, setSelectedTiers] = React.useState<ServiceTier[]>([]);
  const [locationMode, setLocationMode] = React.useState<"current" | "manual">("manual");
  const [location, setLocation] = React.useState<GeoPoint | null>(null);
  const [currentPlace, setCurrentPlace] = React.useState("");
  const [serviceRadius, setServiceRadius] = React.useState(5000);

  const { data: services = [], isLoading: servicesLoading } = useServiceCategory();
  const { data: tiers = [], isLoading: tiersLoading } = useServiceTier();
  const mutation = useServiceSettings();
  const navigate = useNavigate();

  const toggleService = (s: ServiceCategory) =>
    setSelectedServices((p) =>
      p.some((x) => x._id === s._id)
        ? p.filter((x) => x._id !== s._id)
        : [...p, s]
    );

  const toggleTier = (t: ServiceTier) =>
    setSelectedTiers((p) =>
      p.some((x) => x._id === t._id)
        ? p.filter((x) => x._id !== t._id)
        : [...p, t]
    );

  const handleSubmit = () => {
    if (!location) {
      toast.error("Please select a location");
      return;
    }

    const payload: WorkerPayload = {
      categoryIds: selectedServices.map((s) => s._id),
      serviceTierIds: selectedTiers.map((t) => t._id),
      status: "OFFLINE",
      location,
      serviceRadius: serviceRadius / 1000,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
     useAuthStore.getState().updateWorker({
          categoryIds: payload.categoryIds,
          serviceTierIds: payload.serviceTierIds,
          status: payload.status as WorkerStatus,
          serviceRadius: payload.serviceRadius,
          location: payload.location,
        });
        navigate("/services/documents");
      },
      onError: () => toast.error("Update failed"),
    });
  };

  return (
    <div className="flex justify-center p-4 sm:p-6 lg:p-8">
      <CommonCard
        title="Employee Onboarding"
        description="Choose your services, tiers, and operating location"
        className="
          w-full 
          max-w-[16rem] 3xs:max-w-[16rem]
          2xs:max-w-[18rem]
          xs:max-w-[20rem]
          sm:max-w-[24rem]
          md:max-w-[28rem]
          lg:max-w-[32rem]
          xl:max-w-[36rem]
          2xl:max-w-[42rem]
          3xl:max-w-[48rem]
          4xl:max-w-[56rem]
          5xl:max-w-[64rem]
          6xl:max-w-[72rem]
          7xl:max-w-[80rem]
        "
      >
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          <ServiceSelection
            services={services}
            tiers={tiers}
            selectedServices={selectedServices}
            selectedTiers={selectedTiers}
            toggleService={toggleService}
            toggleTier={toggleTier}
          />

          <LocationSelection
            locationMode={locationMode}
            setLocationMode={setLocationMode}
            location={location}
            setLocation={setLocation}
            currentPlace={currentPlace}
            setCurrentPlace={setCurrentPlace}
            serviceRadius={serviceRadius}
            setServiceRadius={setServiceRadius}
            className=""
          />

          <OnboardingActions
            onSubmit={handleSubmit}
            loading={servicesLoading || tiersLoading}
          />
        </div>
      </CommonCard>
    </div>
  );
}
