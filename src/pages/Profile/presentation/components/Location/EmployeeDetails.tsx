import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import { Badge } from "@/components/ui/badge";
import { PencilIcon } from "lucide-react";
import { toast } from "react-toastify";

export default function EmployeeDetails({
  status,
  locationName,
  serviceTiers,
  serviceCategories,
  selectedTiers = [],
  selectedCategories = [],
  user,
  onEdit,
}: any) {
  const { translations } = useLanguage();
  const edits = translations.profile;

  /* ---------------- DOCUMENT CHECK ---------------- */

  const hasAnyRequiredDocument = () => {
    const documents = user?.documents;

    if (!Array.isArray(documents)) return false;

    const requiredDocs = new Set([
      "idproof",
      "addressproof",
      "photoproof",
    ]);

    return documents.some((doc: any) => {
      const type = (doc.documentType || "").toLowerCase();
      return requiredDocs.has(type) && !!doc.filePath;
    });
  };

  /* ---------------- EDIT PERMISSION ---------------- */
      const allowedStatuses = ["pending", "approved", "IN_PROGRESS"];

      const canEdit =
        allowedStatuses.includes(user?.kycStatus ?? "") &&
        hasAnyRequiredDocument();

  /* ---------------- TOAST CONTROL (avoid spam) ---------------- */

  let toastShown = false;

  const handleHover = () => {
    if (!canEdit && !toastShown) {
      toastShown = true;

      toast.info(
        edits.kycEditWarning ?? "You cannot edit service details until KYC documents are submitted and approved"
      );

      setTimeout(() => {
        toastShown = false;
      }, 3000);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          {edits.EmployeeDetails ?? "Service Details"}
        </h2>

        <div onMouseEnter={handleHover}>
          <Button onClick={onEdit} disabled={!canEdit}>
            <PencilIcon className="w-4 h-4 mr-2" />
            {edits.edit}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* STATUS */}
        <CommonCard
          title={edits.status ?? "Status"}
          contentClassName="py-2"
        >
          <Badge
            className={`
              text-xs font-medium uppercase tracking-wider
              ${status === "ONLINE" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : ""}
              ${status === "OFFLINE" ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400" : ""}
              ${status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" : ""}
            `}
          >
            {status}
          </Badge>
        </CommonCard>

        {/* LOCATION */}
        <CommonCard
          title={edits.location ?? "Location"}
          contentClassName="py-2"
        >
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {locationName}
          </span>
        </CommonCard>

        {/* SERVICE TIERS */}
        <CommonCard
          title={edits.serviceTiers ?? "Service Tiers"}
          contentClassName="py-2"
        >
          <div className="flex flex-wrap gap-2">
            {serviceTiers?.length ? (
              serviceTiers
                .filter((t: any) =>
                  selectedTiers.includes(String(t._id || t.id))
                )
                .map((tier: any) => (
                  <Badge
                    key={tier._id || tier.id}
                    className="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                  >
                    {tier.displayName}
                  </Badge>
                ))
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {edits.noTiers ?? "No tiers available"}
              </p>
            )}
          </div>
        </CommonCard>

        {/* SERVICE CATEGORIES */}
        <CommonCard
          title={edits.serviceCategories ?? "Service Categories"}
          contentClassName="py-2"
        >
          <div className="flex flex-wrap gap-2">
            {serviceCategories?.length ? (
              serviceCategories
                .filter((c: any) =>
                  selectedCategories.includes(String(c._id || c.id))
                )
                .map((cat: any) => (
                  <span
                    key={cat._id || cat.id}
                    className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs dark:bg-green-500/20 dark:text-green-400"
                  >
                    {cat.name}
                  </span>
                ))
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {edits.noCategories ?? "No categories available"}
              </p>
            )}
          </div>
        </CommonCard>
      </div>
    </>
  );
}