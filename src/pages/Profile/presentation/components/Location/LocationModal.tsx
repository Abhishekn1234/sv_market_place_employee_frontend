import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import MapPicker from "./LocationPicker";
import ServiceSelector from "./ServiceSelector";

export default function LocationModal({
  tempLocation,
  locationMode,
  setLocationMode,
  setTempLocation,
  // locationName,
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
  return (
    <div className="border rounded p-4 space-y-5">
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

      <MapPicker
        tempLocation={tempLocation}
        locationMode={locationMode}
        setTempLocation={setTempLocation}
        // locationName={locationName}
        setLocationName={setLocationName}
        radius={radius}
      />

      <div>
        <Label>Service Radius (km)</Label>
        <input
          type="number"
          value={radius / 1000}
          onChange={(e) => setRadius(Number(e.target.value) * 1000)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <ServiceSelector
        label="Service Categories"
        items={serviceCategories}
        selected={selectedCategories}
        setSelected={setSelectedCategories}
        activeClass="bg-green-600 text-white"
      />

      <ServiceSelector
        label="Service Tiers"
        items={serviceTiers}
        selected={selectedTiers}
        setSelected={setSelectedTiers}
        activeClass="bg-blue-600 text-white"
        displayKey="displayName"
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={saveChanges}>Update</Button>
      </div>
    </div>
  );
}
