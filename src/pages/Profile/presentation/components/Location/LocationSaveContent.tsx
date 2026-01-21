
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

export default function LocationEditContent({
  tempLocation,
  setTempLocation,
//   locationName,
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
  return (
    <div className="space-y-5">
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

      <CommonMap
        location={tempLocation}
        setLocation={setTempLocation}
        locationMode={locationMode}
        radius={radius}
        setRadius={setRadius}
        onLocationNameChange={setLocationName}
        draggableMarker
        height={540}
      />

      <div>
        <Label>Service Radius (km)</Label>
        <Input
          type="number"
          value={radius / 1000}
          onChange={(e) => setRadius(Number(e.target.value) * 1000)}
        />
      </div>

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
                className={active ? "bg-green-600 text-white" : ""}
              >
                {cat.name}
              </Button>
            );
          })}
        </div>
      </div>

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
                className={active ? "bg-blue-600 text-white" : ""}
              >
                {tier.displayName}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            onSave();
            onClose(); // auto-close after save
          }}
        >
          Update
        </Button>
      </div>
    </div>
  );
}
