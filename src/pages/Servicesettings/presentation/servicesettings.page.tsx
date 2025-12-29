"use client";

import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useServiceSettings } from "./hooks/useServicesettings";
import { useServiceTier } from "./hooks/useServiceTier";
import { useServiceCategory } from "./hooks/useServiceCategory";
import type { ServiceTier } from "../domain/entities/servicetier";
import type { ServiceCategory } from "../domain/entities/servicecategory";
import LocationPage from "@/pages/LocationSettings/presentation/location.settings.page";
import type { GeoPoint } from "@/pages/Profile/domain/entities/profile";
import { toast } from "react-toastify";
import { CurrentLocationFetcher } from "@/pages/LocationSettings/presentation/components/CurrentLocation";
import type { WorkerPayload } from "../domain/entities/servicesettings";
import { useNavigate } from "react-router-dom";

export default function MultiSelectDropdownCard() {
  const [selectedServices, setSelectedServices] = React.useState<ServiceCategory[]>([]);
  const [selectedTiers, setSelectedTiers] = React.useState<ServiceTier[]>([]);
  const [locationMode, setLocationMode] = React.useState<"current" | "manual">("manual");
  const [location, setLocation] = React.useState<GeoPoint | null>(null);
  const [currentPlace, setCurrentPlace] = React.useState<string>("");
    const [serviceRadius, setServiceRadius] = React.useState<number>(5000); // default 5 km

  const { data: services = [], isLoading: servicesLoading } = useServiceCategory();
  const { data: tiers = [], isLoading: tiersLoading } = useServiceTier();
  
  const mutation = useServiceSettings();
 const navigate = useNavigate();
  const toggleService = (service: ServiceCategory) => {
    setSelectedServices((prev) =>
      prev.some((s) => s._id === service._id)
        ? prev.filter((s) => s._id !== service._id)
        : [...prev, service]
    );
  };

  const toggleTier = (tier: ServiceTier) => {
    setSelectedTiers((prev) =>
      prev.some((t) => t._id === tier._id)
        ? prev.filter((t) => t._id !== tier._id)
        : [...prev, tier]
    );
  };


const sanitizeLocation = (location: GeoPoint): GeoPoint => {
  return {
    type: "Point",
    coordinates: location.coordinates,
  };
};




const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!location) {
    toast.error("Please select a location");
    return;
  }

  const workerPayload: WorkerPayload = {
    categoryIds: selectedServices.map((s) => s._id),
    serviceTierIds: selectedTiers.map((t) => t._id),
    status: "OFFLINE",
    location: sanitizeLocation(location), // ✅ accuracy removed
     serviceRadius: serviceRadius / 1000, // convert meters → km // ✅ derived safely
  };

  console.log("Payload sent to API:", workerPayload);

  mutation.mutate(workerPayload, {
    onSuccess: () => navigate("/services/documents"),
  });
};


  return (
    <div className="flex items-center justify-center p-6">

      <Card className="w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">

        <CardHeader className="bg-blue-600 dark:bg-blue-700 text-white py-6 text-center">
          <CardTitle className="text-2xl font-bold tracking-wide">Employee Onboarding</CardTitle>
          <p className="text-sm mt-1 text-blue-100 dark:text-blue-200">
            Select the services and tiers
          </p>
        </CardHeader>

        <CardContent className="space-y-4 px-6 py-5 overflow-visible">
          {/* Service Category */}
          <Label>Service Category:</Label>
          <div className="relative w-full">
            <Select>
              <SelectTrigger className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500">
                <SelectValue placeholder="Select services">
                  {selectedServices.length > 0
                    ? `${selectedServices.length} selected`
                    : "Select services"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md max-h-60 overflow-auto z-50">
                <SelectScrollUpButton className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                {services.map((service) => (
                  <label
                    key={service._id}
                    className="cursor-pointer select-none px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 rounded-md transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.some((s) => s._id === service._id)}
                      onChange={() => toggleService(service)}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className="text-gray-800 dark:text-gray-100">{service.name}</span>
                  </label>
                ))}
                <SelectScrollDownButton className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
              </SelectContent>
            </Select>
          </div>

          {/* Selected Services Badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedServices.map((service) => (
              <Badge
                key={service._id}
                variant="secondary"
                className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-2 py-1 rounded-md shadow-sm"
              >
                {service.name}
                <button
                  onClick={() => toggleService(service)}
                  className="ml-1 text-xs font-bold hover:text-red-600 transition-colors"
                  aria-label={`Remove ${service.name}`}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>

          {/* Service Tier */}
          <Label>Service Tier:</Label>
          <div className="relative w-full">
            <Select>
              <SelectTrigger className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500">
                <SelectValue placeholder="Select tiers">
                  {selectedTiers.length > 0
                    ? `${selectedTiers.length} selected`
                    : "Select tiers"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md max-h-60 overflow-auto z-50">
                <SelectScrollUpButton className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                {tiers.map((tier) => (
                  <label
                    key={tier._id}
                    className="cursor-pointer select-none px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 rounded-md transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTiers.some((t) => t._id === tier._id)}
                      onChange={() => toggleTier(tier)}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className="text-gray-800 dark:text-gray-100">{tier.displayName}</span>
                  </label>
                ))}
                <SelectScrollDownButton className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
              </SelectContent>
            </Select>
          </div>

          {/* Selected Tiers Badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTiers.map((tier) => (
              <Badge
                key={tier._id}
                variant="secondary"
                className="flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-2 py-1 rounded-md shadow-sm"
              >
                {tier.displayName}
                <button
                  type="button"
                  onClick={() => toggleTier(tier)}
                  className="ml-1 text-xs font-bold hover:text-red-600 transition-colors"
                  aria-label={`Remove ${tier.displayName}`}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>

          {/* Location Mode */}
          <Label>Select Location Mode:</Label>
          <div className="flex gap-4 mb-2 items-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="locationMode"
                value="current"
                checked={locationMode === "current"}
                onChange={() => setLocationMode("current")}
                className="w-4 h-4"
              />
              Current Location
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="locationMode"
                value="manual"
                checked={locationMode === "manual"}
                onChange={() => setLocationMode("manual")}
                className="w-4 h-4"
              />
              Choose Location
            </label>
          </div>

          {/* Current Location */}
          {locationMode === "current" && (
            <div>
              <CurrentLocationFetcher
                onChange={(point: GeoPoint, placeName: string) => {
                  setLocation(point);
                  setCurrentPlace(placeName);
                }}
              />
              {location && currentPlace && (
                <span>
                  {currentPlace}
                </span>
              )}
            </div>
          )}

          {/* Manual Location Map */}
          {locationMode === "manual" && (
  <div className="h-[500px] w-full rounded-lg overflow-hidden">
   <LocationPage
  onChange={(loc) => {
    if (loc) {
      setLocation({
        type: "Point",
        coordinates: [loc[0], loc[1]], // [lng, lat]
      });
    } else {
      setLocation(null);
    }
  }}
  radius={serviceRadius}
  onRadiusChange={setServiceRadius}
/>

  </div>
)}


          {/* Buttons */}
          <div className="flex flex-row gap-4 justify-end">
            <Button
              className="w-[80px] bg-secondary text-black mb-0.5 mt-4 dark:hover:bg-blue-500 hover:bg-blue-600"
              disabled
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={servicesLoading || tiersLoading}
              className="w-[80px] mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
