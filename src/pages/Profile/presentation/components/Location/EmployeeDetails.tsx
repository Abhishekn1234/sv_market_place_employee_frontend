import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";
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
        <h2 className="text-xl font-semibold">
          {translations.profile.EmployeeDetails ?? "Service Details"}
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
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500 mb-1">{edits.status ?? "Status"}</p>
          <span className="font-medium text-blue-600">{status}</span>
        </div>

        {/* LOCATION */}
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500 mb-1">{translations.profile.location ?? "Location"}</p>
          <span className="font-medium text-black">{locationName}</span>
        </div>

        {/* SERVICE TIERS */}
        <div className="rounded-lg border bg-white p-4">
          <Label className="text-sm text-gray-500">{edits.serviceTiers ?? "Service Tiers"}</Label>

          <div className="flex flex-wrap gap-2 mt-2">
            {serviceTiers?.length ? (
              serviceTiers
                .filter((t: any) =>
                  selectedTiers.includes(String(t._id || t.id))
                )
                .map((tier: any) => (
                  <span
                    key={tier._id || tier.id}
                    className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs"
                  >
                    {tier.displayName}
                  </span>
                ))
            ) : (
              <p className="text-xs text-gray-400">{edits.noTiers ?? "No tiers available"}</p>
            )}
          </div>
        </div>

        {/* SERVICE CATEGORIES */}
        <div className="rounded-lg border bg-white p-4">
          <Label className="text-sm text-gray-500">{edits.serviceCategories ?? "Service Categories"}</Label>

          <div className="flex flex-wrap gap-2 mt-2">
            {serviceCategories?.length ? (
              serviceCategories
                .filter((c: any) =>
                  selectedCategories.includes(String(c._id || c.id))
                )
                .map((cat: any) => (
                  <span
                    key={cat._id || cat.id}
                    className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs"
                  >
                    {cat.name}
                  </span>
                ))
            ) : (
              <p className="text-xs text-gray-400">{edits.noCategories ?? "No categories available"}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}