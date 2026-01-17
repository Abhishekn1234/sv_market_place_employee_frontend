import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import type { ServiceTier } from "../../domain/entities/servicetier";
import type { ServiceCategory } from "../../domain/entities/servicecategory";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  services: ServiceCategory[];
  tiers: ServiceTier[];
  selectedServices: ServiceCategory[];
  selectedTiers: ServiceTier[];
  toggleService: (s: ServiceCategory) => void;
  toggleTier: (t: ServiceTier) => void;
};

export function ServiceSelection({
  services,
  tiers,
  selectedServices,
  selectedTiers,
  toggleService,
  toggleTier,
}: Props) {
  return (
    <div className="space-y-6">
      {/* SERVICE CATEGORY */}
      <div>
        <Label className="text-sm font-medium mb-1 block">
          Service Category
        </Label>

        <Select>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                selectedServices.length
                  ? `${selectedServices.length} selected`
                  : "Select services"
              }
            />
          </SelectTrigger>

          <SelectContent>
            <SelectScrollUpButton />

            {services.map((service) => (
              <label
                key={service._id}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm hover:bg-muted rounded-sm"
              >
                <Input
                  type="checkbox"
                  checked={selectedServices.some(
                    (s) => s._id === service._id
                  )}
                  onChange={() => toggleService(service)}
                  className="h-4 w-4" // ✅ small checkbox
                />
                <span>{service.name}</span>
              </label>
            ))}

            <SelectScrollDownButton />
          </SelectContent>
        </Select>

        {/* SELECTED SERVICES */}
        {selectedServices.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedServices.map((service) => (
              <Badge
                key={service._id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {service.name}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => toggleService(service)}
                   className="h-4 w-4 p-0 text-xs hover:text-destructive"
                >
                  ×
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* SERVICE TIER */}
      <div>
        <Label className="text-sm font-medium mb-1 block">
          Service Tier
        </Label>

        <Select>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                selectedTiers.length
                  ? `${selectedTiers.length} selected`
                  : "Select tiers"
              }
            />
          </SelectTrigger>

          <SelectContent>
            <SelectScrollUpButton />

            {tiers.map((tier) => (
              <label
                key={tier._id}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm hover:bg-muted rounded-sm"
              >
                <Input
                  type="checkbox"
                  checked={selectedTiers.some((t) => t._id === tier._id)}
                  onChange={() => toggleTier(tier)}
                  className="h-4 w-4" // ✅ small checkbox
                />
                <span>{tier.displayName}</span>
              </label>
            ))}

            <SelectScrollDownButton />
          </SelectContent>
        </Select>

        {/* SELECTED TIERS */}
        {selectedTiers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTiers.map((tier) => (
              <Badge
                key={tier._id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tier.displayName}
                <Button
                variant="ghost"
                  type="button"
                  onClick={() => toggleTier(tier)}
                   className="h-4 w-4 p-0 text-xs hover:text-destructive"
                >
                  ×
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
