import { useState } from "react";
import type { TableColumn } from "@/components/common/CommonTable";
import type { Work } from "../../domain/entities/workhistory";
import { getStatusColor, getStatusIcon } from "../utils/workhistory";
import { useLanguage } from "@/context/LanguageContext";
import { reverseGeocode } from "@/components/common/CommonMap";
import { formatDuration, pricingModeMap } from "../utils/formatduration";

import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useCancel } from "@/pages/AssignedWorks/presentation/hooks/useCancel";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  onStartWork: (work: Work) => void;
  onCompleteWork: (work: Work) => void;
  onGenerateInvoice?: (work: Work) => void;
  onPayment?: (work: Work) => void;
};

export function useWorkColumns({
  onStartWork,
  onCompleteWork,
  onGenerateInvoice,
  onPayment,
}: Props): TableColumn<Work>[] {
  const { translations, t } = useLanguage();
  const [locations, setLocations] = useState<Record<string, string>>({});
  const { mutate: cancelWorkMutation } = useCancel();
  const { theme } = useTheme();
  const WorkHistory = translations.workHistory.tableHeaders;

  const baseClass = "px-4 break-words whitespace-normal";
  const headerClass =
    theme === "dark"
      ? `${baseClass} bg-gray-900 text-gray-50`
      : `${baseClass} bg-white text-gray-900`;

  return [
    {
      key: "service",
      header: WorkHistory.service,
      className: headerClass,
      render: (w) => w.service?.name || "-",
    },
    {
      key: "serviceTier",
      header: WorkHistory.serviceTier,
      className: headerClass,
      render: (w) => w.serviceTier?.displayName || "-",
    },
    {
      key: "location",
      header: WorkHistory.location,
      className: headerClass,
      render: (w) => {
        const locationStr = w.booking?.location;
        if (!locationStr) return "N/A";

        let lat: number;
        let lng: number;

        if (typeof locationStr === "string") {
          const parts = locationStr.split(",");
          lat = parseFloat(parts[0]);
          lng = parseFloat(parts[1]);
          if (isNaN(lat) || isNaN(lng)) return locationStr;
        } else {
          lat = locationStr.coordinates[1];
          lng = locationStr.coordinates[0];
        }

        if (!locations[w._id]) {
          reverseGeocode(lat, lng)
            .then((address) =>
              setLocations((prev) => ({ ...prev, [w._id]: address }))
            )
            .catch(() =>
              setLocations((prev) => ({ ...prev, [w._id]: `${lat}, ${lng}` }))
            );
        }

        return locations[w._id] || `${lat}, ${lng}`;
      },
    },
    {
      key: "assignedAt",
      header: WorkHistory.assignedDate,
      className: headerClass,
      render: (w) => {
        const date = new Date(w.assignedAt);
        if (isNaN(date.getTime())) return "N/A";
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      },
    },
   {
  key: "status",
  header: WorkHistory.status,
  className: headerClass,
  render: (w) => {
    // Determine the effective status
    let displayStatus = w.booking?.status || w.status;

    // Map WORK_COMPLETED_PENDING → workCompletedPending
    if (displayStatus === "WORK_COMPLETED_PENDING") {
      displayStatus = "workCompletedPending";
    }

    const isOtpPending = displayStatus === "workCompletedPending"; // Show OTP text if needed

    return (
      <div className="flex flex-col gap-1">
        {/* OTP Pending Text on top of the status */}
        {isOtpPending && (
          <span className="text-xs text-red-600 font-medium">
            {t(`workHistory.statusOptions.otpPending`)}
          </span>
        )}

        {/* Actual status badge */}
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border whitespace-nowrap ${getStatusColor(
            displayStatus
          )}`}
        >
          {getStatusIcon(displayStatus)}
          {t(`workHistory.statusOptions.${displayStatus}`)}
        </span>
      </div>
    );
  },
},
    {
      key: "customerName",
      header: WorkHistory.customerName,
      className: headerClass,
      render: (w) => w.customer?.fullName || "-",
    },
    {
      key: "duration",
      header: WorkHistory.duration,
      className: headerClass,
      render: (w) =>
        formatDuration(
          w.booking?.duration || 1,
          w.booking?.pricingMode
            ? pricingModeMap[w.booking.pricingMode]
            : "hourly"
        ),
    },
    {
      key: "actions",
      header: WorkHistory.actions || "Actions",
      className: headerClass,
      render: (w) => {
        const bookingStatus = w.booking?.status;
        const workStatus = w.status;

    
        if (workStatus === "completed") {
          return (
            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
              {t("workHistory.statusOptions.completed") || "Completed"}
            </span>
          );
        }

        if (bookingStatus === "WORK_COMPLETED_PENDING") {
          return (
            <div className="flex items-center gap-2">
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => onGenerateInvoice?.(w)}
              >
                {t("workHistory.actions.generateInvoice") || "Generate Invoice"}
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => onPayment?.(w)}
              >
                {t("workHistory.actions.payment") || "Payment"}
              </Button>
            </div>
          );
        }

        // ✅ IN PROGRESS → Show badge + Complete Work
        if (workStatus === "inProgress") {
          return (
            <div className="inline-flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium whitespace-nowrap">
                {t("workHistory.statusOptions.inProgress") ||
                  "Work is in progress"}
              </span>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onCompleteWork(w)}
              >
                {t("workHistory.actions.completeWork") || "Complete Work"}
              </Button>
            </div>
          );
        }

        // ✅ NOT STARTED / ASSIGNED → Show Start + Cancel
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStartWork(w)}
            >
              {t("workHistory.actions.start") || "Start"}
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (!w.booking?.id) {
                  toast.error("Booking not found for this work");
                  return;
                }
                cancelWorkMutation(w.booking.id);
              }}
            >
              {t("workHistory.actions.cancel") || "Cancel"}
            </Button>
          </div>
        );
      },
    },
  ];
}