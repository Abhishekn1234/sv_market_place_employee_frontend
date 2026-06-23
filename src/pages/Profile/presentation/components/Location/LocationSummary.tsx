import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PencilIcon } from "lucide-react";
import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import type { ServiceTier } from "@/pages/Servicesettings/domain/entities/servicetier";
import type { WorkerStatus } from "@/pages/Servicesettings/domain/entities/workerstatus";
import { useLanguage } from "@/context/presentation/components/LanguageContext";

interface Props {
  status: WorkerStatus | null;
  locationName: string;
  selectedTiers: string[];
  selectedCategories: string[];
  serviceTiers?: ServiceTier[];
  serviceCategories?: ServiceCategory[];
  onEdit: () => void;
}

export default function LocationSummary({
  status,
  locationName,
  selectedTiers,
  selectedCategories,
  serviceTiers,
  serviceCategories,
  onEdit,
}: Props) {
  const {translations}=useLanguage();
  const edits=translations.profile
  // console.log(edits);
  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Employee Details</h2>
        <Button onClick={onEdit}>
          <PencilIcon className="w-4 h-4 mr-2" />{edits.edit}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500 mb-1">Status</p>
          <span className="font-medium text-blue-600">{status}</span>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500 mb-1">Location</p>
          <span className="font-medium">{locationName}</span>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <Label className="text-sm text-gray-500">Service Tiers</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {serviceTiers
              ?.filter((t) => selectedTiers.includes(t._id))
              .map((tier) => (
                <span
                  key={tier._id}
                  className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs"
                >
                  {tier.displayName}
                </span>
              ))}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <Label className="text-sm text-gray-500">Service Categories</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {serviceCategories
              ?.filter((c) => selectedCategories.includes(c._id))
              .map((cat) => (
                <span
                  key={cat._id}
                  className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs"
                >
                  {cat.name}
                </span>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
