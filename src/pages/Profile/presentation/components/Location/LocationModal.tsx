"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import MapPicker from "./LocationPicker";
import ServiceSelector from "./ServiceSelector";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { toast } from "react-toastify";
import { useState } from "react";

export default function LocationModal({
  tempLocation,
  setTempLocation,
  setLocationName,
  radius,
  setRadius,
  serviceTiers,
  serviceCategories,
  selectedTiers,
  setSelectedTiers,
  selectedCategories,
  setSelectedCategories,
  saveChanges,
  onClose,
  onUseCurrentLocation,
  onManualLocation,
}: any) {
  const { translations } = useLanguage();
  const edits = translations.profile;

  // ✅ LOCAL STATE (FIXES YOUR ERROR)
  const [locationMode, setLocationMode] = useState<"CURRENT" | "MANUAL">(
    "MANUAL"
  );

  /* ---------------- RADIUS ---------------- */
  const handleRadiusChange = (valueKm: number) => {
    if (valueKm > 45) {
      toast.error(edits.radiusLimitError ?? "Radius cannot exceed 45 km");
      setRadius(45000);
    } else if (valueKm < 0) {
      setRadius(0);
    } else {
      setRadius(valueKm * 1000);
    }
  };

  /* ---------------- MODE CHANGE ---------------- */
  const handleModeChange = (mode: "CURRENT" | "MANUAL") => {
    setLocationMode(mode);

    if (mode === "CURRENT") {
      onUseCurrentLocation?.();
    }
  };

  /* ---------------- MAP UPDATE ---------------- */
  const handleManualLocation = (coords: [number, number]) => {
    setTempLocation(coords);
    onManualLocation?.(coords[0], coords[1]);
  };

  return (
    <div className="border rounded p-4 space-y-5">

      {/* Location Mode */}
      <div>
        <Label>{edits.locationMode ?? "Location Mode"}</Label>

        <div className="flex gap-4 mt-2">
          {["CURRENT", "MANUAL"].map((mode) => (
            <label key={mode} className="flex items-center gap-2">
              <input
                type="radio"
                checked={locationMode === mode}
                onChange={() =>
                  handleModeChange(mode as "CURRENT" | "MANUAL")
                }
              />
              {mode === "CURRENT"
                ? edits.currentLocation ?? "Current Location"
                : edits.manualLocation ?? "Manual Location"}
            </label>
          ))}
        </div>
      </div>

      {/* Map Picker */}
      <MapPicker
        tempLocation={tempLocation}
        locationMode={locationMode}
        setTempLocation={(coords: [number, number]) =>
          handleManualLocation(coords)
        }
        setLocationName={setLocationName}
        radius={radius}
      />

      {/* Radius */}
      <div>
        <Label>{edits.serviceRadius ?? "Service Radius (km)"}</Label>
        <input
          type="number"
          value={radius / 1000}
          onChange={(e) => handleRadiusChange(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Categories */}
      <ServiceSelector
        label={edits.serviceCategories ?? "Service Categories"}
        items={serviceCategories}
        selected={selectedCategories}
        setSelected={setSelectedCategories}
        activeClass="bg-green-600 text-white"
      />

      {/* Tiers */}
      <ServiceSelector
        label={edits.serviceTiers ?? "Service Tiers"}
        items={serviceTiers}
        selected={selectedTiers}
        setSelected={setSelectedTiers}
        activeClass="bg-blue-600 text-white"
        displayKey="displayName"
      />

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          {edits.cancel}
        </Button>
        <Button onClick={saveChanges}>
          {edits.update}
        </Button>
      </div>
    </div>
  );
}