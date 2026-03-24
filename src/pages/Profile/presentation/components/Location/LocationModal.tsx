import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import MapPicker from "./LocationPicker";
import ServiceSelector from "./ServiceSelector";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "react-toastify"; // ✅ make sure react-toastify is installed

export default function LocationModal({
  tempLocation,
  locationMode,
  setLocationMode,
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
}: any) {
  const { translations } = useLanguage();
  const edits = translations.profile;

  const handleRadiusChange = (valueKm: number) => {
    if (valueKm > 15) {
      toast.error("Radius cannot exceed 15 km");
      setRadius(15000); // maximum allowed radius in meters
    } else if (valueKm < 0) {
      setRadius(0);
    } else {
      setRadius(valueKm * 1000);
    }
  };

  return (
    <div className="border rounded p-4 space-y-5">
      {/* Location Mode */}
      <div>
        <Label>Location Mode</Label>
        <div className="flex gap-4 mt-2">
          {["CURRENT", "MANUAL"].map((mode) => (
            <label key={mode} className="flex items-center gap-2">
              <input
                type="radio"
                checked={locationMode === mode}
                onChange={() => setLocationMode(mode)}
              />
              {mode === "CURRENT" ? "Current Location" : "Manual Location"}
            </label>
          ))}
        </div>
      </div>

      {/* Map Picker */}
      <MapPicker
        tempLocation={tempLocation}
        locationMode={locationMode}
        setTempLocation={setTempLocation}
        setLocationName={setLocationName}
        radius={radius}
      />

      {/* Radius Input */}
      <div>
        <Label>Service Radius (km)</Label>
        <input
          type="number"
          value={radius / 1000}
          onChange={(e) => handleRadiusChange(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Service Categories */}
      <ServiceSelector
        label="Service Categories"
        items={serviceCategories}
        selected={selectedCategories}
        setSelected={setSelectedCategories}
        activeClass="bg-green-600 text-white"
      />

      {/* Service Tiers */}
      <ServiceSelector
        label="Service Tiers"
        items={serviceTiers}
        selected={selectedTiers}
        setSelected={setSelectedTiers}
        activeClass="bg-blue-600 text-white"
        displayKey="displayName"
      />

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>{edits.cancel}</Button>
        <Button onClick={saveChanges}>{edits.update}</Button>
      </div>
    </div>
  );
}