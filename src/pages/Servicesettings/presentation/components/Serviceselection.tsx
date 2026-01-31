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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ServiceTier } from "../../domain/entities/servicetier";
import type { ServiceCategory } from "../../domain/entities/servicecategory";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-2  gap-6">
      {/* SERVICE CATEGORY */}
      <div>
        <Label className="text-sm sm:text-base font-medium mb-2 block">
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

          <SelectContent className="max-h-60 sm:max-h-72">
            <SelectScrollUpButton />

            <div className="flex flex-col space-y-1">
              {services.map((service) => (
                <label
                  key={service._id}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm sm:text-base hover:bg-gray-100 rounded-md"
                >
                  <Input
                    type="checkbox"
                    checked={selectedServices.some((s) => s._id === service._id)}
                    onChange={() => toggleService(service)}
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  />
                  <span className="truncate">{service.name}</span>
                </label>
              ))}
            </div>

            <SelectScrollDownButton />
          </SelectContent>
        </Select>

        {selectedServices.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedServices.map((service) => (
              <Badge
                key={service._id}
                variant="secondary"
                className="flex items-center gap-1 text-sm sm:text-base"
              >
                <span className="truncate max-w-[100px] sm:max-w-[140px]">{service.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => toggleService(service)}
                  className="h-4 w-4 sm:h-5 sm:w-5 p-0 text-xs sm:text-sm hover:text-destructive"
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
        <Label className="text-sm sm:text-base font-medium mb-2 block">
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

          <SelectContent className="max-h-60 sm:max-h-72">
            <SelectScrollUpButton />

            <div className="flex flex-col space-y-1">
              {tiers.map((tier) => (
                <label
                  key={tier._id}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm sm:text-base hover:bg-gray-100 rounded-md"
                >
                  <Input
                    type="checkbox"
                    checked={selectedTiers.some((t) => t._id === tier._id)}
                    onChange={() => toggleTier(tier)}
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  />
                  <span className="truncate">{tier.displayName}</span>
                </label>
              ))}
            </div>

            <SelectScrollDownButton />
          </SelectContent>
        </Select>

        {selectedTiers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTiers.map((tier) => (
              <Badge
                key={tier._id}
                variant="secondary"
                className="flex items-center gap-1 text-sm sm:text-base"
              >
                <span className="truncate max-w-[100px] sm:max-w-[140px]">{tier.displayName}</span>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => toggleTier(tier)}
                  className="h-4 w-4 sm:h-5 sm:w-5 p-0 text-xs sm:text-sm hover:text-destructive"
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
