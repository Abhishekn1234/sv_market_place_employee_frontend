import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CommonMap } from "@/components/common/CommonMap"; 
import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import type { ServiceTier } from "@/pages/Servicesettings/domain/entities/servicetier";
import { Input } from "@/components/ui/input";

type Props = {
  tempLocation: [number, number];
  setTempLocation: (v: [number, number]) => void;
  locationName: string;
  setLocationName: (v: string) => void;
  radius: number;
  setRadius: (v: number) => void;
  locationMode: "CURRENT" | "MANUAL";
  setLocationMode: (v: "CURRENT" | "MANUAL") => void;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTiers: string[];
  setSelectedTiers: React.Dispatch<React.SetStateAction<string[]>>;
  serviceCategories?: ServiceCategory[];
  serviceTiers?: ServiceTier[];
  onClose: () => void;
  onSave: () => void;
};

export default function LocationEditModal({
  tempLocation,
  setTempLocation,
  locationName,
  setLocationName,
  radius,
  setRadius,
  locationMode,
  setLocationMode,
  selectedCategories,
  setSelectedCategories,
  selectedTiers,
  setSelectedTiers,
  serviceCategories,
  serviceTiers,
  onClose,
  onSave,
}: Props) {
  console.log(locationName);
  return (
    <div className="border rounded p-4 space-y-5">
      {/* Location Mode */}
      <div>
        <Label>Location Mode</Label>
        <div className="flex gap-4 mt-2">
          <Label className="flex items-center gap-2">
            <Input
              type="radio"
              checked={locationMode === "CURRENT"}
              onChange={() => setLocationMode("CURRENT")}
            />
            Current Location
          </Label>
          <Label className="flex items-center gap-2">
            <Input
              type="radio"
              checked={locationMode === "MANUAL"}
              onChange={() => setLocationMode("MANUAL")}
            />
            Manual Location
          </Label>
        </div>
      </div>

      {/* Map using CommonMap */}
      <CommonMap
        location={tempLocation}
        setLocation={setTempLocation}
        locationMode={locationMode}
        radius={radius}
        setRadius={setRadius}
        onLocationNameChange={setLocationName}
        draggableMarker={true}
        height={540}
      />

      {/* Radius */}
      <div>
        <Label>Service Radius (km)</Label>
        <Input
          type="number"
          value={radius / 1000}
          onChange={(e) => setRadius(Number(e.target.value) * 1000)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Categories */}
      <div>
        <Label>Service Categories</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {serviceCategories?.map((cat) => {
            const active = selectedCategories.includes(cat._id);
            return (
              <Button
                key={cat._id}
                type="button"
                onClick={() =>
                  setSelectedCategories((prev) =>
                    active
                      ? prev.filter((id) => id !== cat._id)
                      : [...prev, cat._id]
                  )
                }
                className={`px-3 py-1 rounded border text-sm transition ${
                  active ? "bg-green-600 text-white" : "bg-white text-gray-700"
                }`}
              >
                {cat.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tiers */}
      <div>
        <Label>Service Tiers</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {serviceTiers?.map((tier) => {
            const active = selectedTiers.includes(tier._id);
            return (
              <Button
                key={tier._id}
                type="button"
                onClick={() =>
                  setSelectedTiers((prev) =>
                    active
                      ? prev.filter((id) => id !== tier._id)
                      : [...prev, tier._id]
                  )
                }
                className={`px-3 py-1 rounded border text-sm transition ${
                  active ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                }`}
              >
                {tier.displayName}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSave}>Update</Button>
      </div>
    </div>
  );
}

