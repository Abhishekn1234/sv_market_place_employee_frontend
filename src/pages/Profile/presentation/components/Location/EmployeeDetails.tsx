import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import { Badge } from "@/components/ui/badge";
import {
  PencilIcon,
  MapPin,
  ShieldCheck,
  Layers,
  Tag,
} from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { statusStyles } from "../../utils/statusstyles";
import { hasAnyRequiredDocument } from "../../utils/caneditdocuments";

export default function EmployeeDetails({
  status,
  locationName,
  serviceTiers,
  serviceCategories,
  selectedTiers = [],
  selectedCategories = [],
  documents = [],
  // worker,
  onEdit,
}: any) {
  const { translations } = useLanguage();
  const edits = translations.profile;

  const toastShownRef = useRef(false);

  /* ---------------- CAN EDIT LOGIC ---------------- */
  const canEdit = useMemo(() => {
    return hasAnyRequiredDocument(documents);
  }, [documents]);

  /* ---------------- TOAST ON HOVER ---------------- */
  const handleHover = () => {
    if (!canEdit && !toastShownRef.current) {
      toastShownRef.current = true;

      toast.info(
        "You cannot edit service details until required documents are uploaded"
      );

      setTimeout(() => {
        toastShownRef.current = false;
      }, 3000);
    }
  };

  const filteredTiers =
    serviceTiers?.filter((t: any) =>
      selectedTiers.includes(String(t._id || t.id))
    ) ?? [];

  const filteredCategories =
    serviceCategories?.filter((c: any) =>
      selectedCategories.includes(String(c._id || c.id))
    ) ?? [];

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {edits.EmployeeDetails ?? "Service Details"}
        </h2>

        <div onMouseEnter={handleHover}>
          <Button
            onClick={onEdit}
            disabled={!canEdit}
            size="sm"
            className="h-9 gap-2 text-xs font-semibold"
          >
            <PencilIcon className="h-3.5 w-3.5" />
            {edits.edit ?? "Edit"}
          </Button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* STATUS */}
        <CommonCard className="border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 px-1 pb-2 pt-1">
            <ShieldCheck size={14} className="text-slate-400" />
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">
              {edits.status ?? "Status"}
            </p>
          </div>

          <Badge
            variant="outline"
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-semibold",
              statusStyles[status] ?? statusStyles.OFFLINE
            )}
          >
            {status}
          </Badge>
        </CommonCard>

        {/* LOCATION */}
        <CommonCard className="border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 px-1 pb-2 pt-1">
            <MapPin size={14} className="text-slate-400" />
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">
              {edits.location ?? "Location"}
            </p>
          </div>

          <p className="truncate px-1 pb-1 text-sm font-medium">
            {locationName || "—"}
          </p>
        </CommonCard>

        {/* TIERS */}
        <CommonCard className="border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 px-1 pb-2 pt-1">
            <Layers size={14} className="text-slate-400" />
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">
              {edits.serviceTiers ?? "Service Tiers"}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 px-1">
            {filteredTiers.length > 0 ? (
              filteredTiers.map((tier: any) => (
                <Badge key={tier._id || tier.id} variant="secondary">
                  {tier.displayName}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">None</span>
            )}
          </div>
        </CommonCard>

        {/* CATEGORIES */}
        <CommonCard className="border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 px-1 pb-2 pt-1">
            <Tag size={14} className="text-slate-400" />
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">
              {edits.serviceCategories ?? "Categories"}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 px-1">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat: any) => (
                <Badge key={cat._id || cat.id} variant="secondary">
                  {cat.name}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">
                None selected
              </span>
            )}
          </div>
        </CommonCard>
      </div>
    </div>
  );
}