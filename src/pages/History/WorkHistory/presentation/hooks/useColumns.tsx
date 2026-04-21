"use client";

import { useEffect, useState } from "react";
import type { TableColumn } from "@/components/common/CommonTable";
import type { Work } from "@/pages/Booking/AvaliableWorks/domain/entities/work";
import { getStatusColor, getStatusIcon } from "../utils/workhistory";
import { useLanguage } from "@/context/LanguageContext";
import { reverseGeocode } from "@/components/common/CommonMap";

import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useCancel } from "@/pages/Booking/AvaliableWorks/presentation/hooks/useCancel";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  onStartWork: (work: Work) => void;
  onCompleteWork: (work: Work) => void;
  onVerifyOtp?: (work: Work) => void;
  onGenerateInvoice?: (work: Work) => void;
  onPayment?: (work: Work) => void;
};

export function useWorkColumns({
  onStartWork,
  onCompleteWork,
  onVerifyOtp,
  onGenerateInvoice,

}: Props): TableColumn<Work>[] {
  const { translations, t } = useLanguage();
  const [locations, setLocations] = useState<Record<string, string>>({});

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
    const [remainingTime, setRemainingTime] = useState<string>("");

    let displayStatus = w.booking?.status || w.status;

    if (displayStatus === "WORK_COMPLETED_PENDING")
      displayStatus = "workCompletedPending";
    if (displayStatus === "WORK_COMPLETED") displayStatus = "completed";
    if (displayStatus === "IN_PROGRESS") displayStatus = "IN_PROGRESS";
    if (displayStatus === "WORKER_ACCEPTED") displayStatus = "confirmed";

   
  if (displayStatus === "IN_PROGRESS" && w.assignedAt) {
  useEffect(() => {
  const startedAt = w.assignedAt;
  if (!startedAt) return;

  const startTime = new Date(startedAt).getTime();

 
  const durationHours =
    w.booking?.pricingMode === "HOURLY"
      ? w.booking?.schedule?.estimatedHours ?? 1
      : (w.booking?.schedule?.estimatedDays ?? 1) * 24;

  const maxDurationMs = durationHours * 60 * 60 * 1000;

  const interval = setInterval(() => {
    const now = Date.now();
    const elapsed = now - startTime;

    const safeElapsed = elapsed >= maxDurationMs ? maxDurationMs : elapsed;

    const hours = Math.floor(safeElapsed / (1000 * 60 * 60));
    const minutes = Math.floor(
      (safeElapsed % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((safeElapsed % (1000 * 60)) / 1000);

    setRemainingTime(
      `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`
    );

    if (elapsed >= maxDurationMs) {
      clearInterval(interval);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [
  w.assignedAt,
  w.booking?.pricingMode,
  w.booking?.schedule?.estimatedHours,
  w.booking?.schedule?.estimatedDays,
]);
}

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border whitespace-nowrap ${getStatusColor(
          displayStatus
        )}`}
      >
        {getStatusIcon(displayStatus)}
        {t(`workHistory.statusOptions.${displayStatus}`)}
        {displayStatus === "IN_PROGRESS" && remainingTime && (
          <span className="ml-2 font-mono">{remainingTime}</span>
        )}
      </span>
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
  key: "workerPoolAmount",
  header: WorkHistory.workerPoolAmount,
  className: headerClass,
  render: (w) => {
    const poolAmount = w.booking?.workerPoolAmount ?? 0;
    const workers = w.booking?.numberofWorkers ?? 1;

    const value = poolAmount / workers;

    return `${value.toFixed(2)} ${w.booking?.currency ?? ""}`;
  },
},
    {
  key: "actions",
  header: WorkHistory.actions || "Actions",
  className: headerClass,
  render: (w) => {
    const bookingStatus = w.booking?.status;
    const workStatus = w.status;

    // ✅ Final Completed → Show Badge Only
    if (workStatus === "completed") {
      return (
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
          {t("workHistory.statusOptions.completed")}
        </span>
      );
    }
    const [openCancel, setOpenCancel] = useState(false);
    const [reason, setReason] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const cancelWorkMutation = useCancel();

    const handleCancelClick = () => {
      if (!selectedId) return;

      if (!reason.trim()) {
        toast.error("Cancel reason required");
        return;
      }

      cancelWorkMutation.mutate(
        {
          bookingId: selectedId,
          cancelReason: reason,
        },
        {
          onSuccess: () => {
            toast.success("Cancelled successfully");
            setOpenCancel(false);
            setReason("");
            setSelectedId(null);
          },
          onError: (err: any) => {
            toast.error(err?.message || "Cancel failed");
          },
        }
      );
    };

    // ✅ WORK_COMPLETED_PENDING → Show ONLY Verify OTP
    if (bookingStatus === "WORK_COMPLETED_PENDING") {
      return (
        <Button size="sm" onClick={() => onVerifyOtp?.(w)}>
          {t("workHistory.actions.verifyOtp")}
        </Button>
      );
    }

    // ✅ WORK_COMPLETED → Show ONLY Generate Invoice
    if (bookingStatus === "WORK_COMPLETED") {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onGenerateInvoice?.(w)}
        >
          {t("workHistory.actions.generateInvoice")}
        </Button>
      );
    }

    // ✅ IN_PROGRESS → Complete Work
    if (workStatus === "IN_PROGRESS") {
      return (
        <Button size="sm" onClick={() => onCompleteWork(w)}>
          {t("workHistory.actions.completeWork")}
        </Button>
      );
    }

    // ✅ Default → Start + Cancel
    return (
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onStartWork(w)}>
          {t("workHistory.actions.start")}
        </Button>

        <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setSelectedId(w.booking?.id);
                  setOpenCancel(true);
                }}
              >
                {t("workHistory.actions.cancel")}
              </Button>
                {openCancel && selectedId === w.booking?.id && (
          <div className="p-3 border rounded bg-gray-50 dark:bg-gray-900">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter cancel reason..."
              className="w-full border p-2 rounded mb-2"
            />

            <div className="flex gap-2">
              <Button size="sm" onClick={handleCancelClick}>
                Confirm
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setOpenCancel(false);
                  setReason("");
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
      
    );
  },
}
  ];
}