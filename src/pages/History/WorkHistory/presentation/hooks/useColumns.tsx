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

export function useWorkColumns(): TableColumn<Work>[] {
  const { translations, t } = useLanguage();
  const [locations, setLocations] = useState<Record<string, string>>({});
  const { mutate: cancelWorkMutation } = useCancel();
  const { theme } = useTheme();
  const WorkHistory = translations.workHistory.tableHeaders;

  
  const baseClass = "px-4 break-words whitespace-normal";
  const headerClass = theme === "dark"
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

        if (!locations[w.id]) {
          reverseGeocode(lat, lng)
            .then((address) =>
              setLocations((prev) => ({ ...prev, [w.id]: address }))
            )
            .catch(() =>
              setLocations((prev) => ({ ...prev, [w.id]: `${lat}, ${lng}` }))
            );
        }

        return locations[w.id] || `${lat}, ${lng}`;
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
      render: (w) => (
        <span
          className={`
            inline-flex
            items-center
            gap-1
            px-2
            py-1
            rounded-full
            border
            ${getStatusColor(w.status)}
          `}
        >
          {getStatusIcon(w.status)}
          {t(`workHistory.statusOptions.${w.status}`)}
        </span>
      ),
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
        if (w.status.toLowerCase() === "cancelled") {
          return (
            <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-medium">
              {t("workHistory.actions.cancelled") || "Cancelled"}
            </span>
          );
        }

        return (
          <Button
            size="sm"
            className="cursor-pointer"
            variant="destructive"
            onClick={() => {
              if (!w.booking?.id) {
                toast.error("Booking not found for this work");
                return;
              }
              cancelWorkMutation(w.booking.id);
            }}
          >
            {t("workHistory.actions.cancel")}
          </Button>
        );
      },
    },
  ];
}
