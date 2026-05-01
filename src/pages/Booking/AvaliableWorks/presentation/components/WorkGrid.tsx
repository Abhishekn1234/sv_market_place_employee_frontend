import { Button } from "@/components/ui/button";
import { CommonCard } from "@/components/common/CommonCard";
import { reverseGeocode } from "@/components/common/CommonMap";
import { MapPin, Timer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getWorkCoordinates,
  getWorkLocation,
  getWorkerAmount,
  normalizeAssignedWorks,
} from "../helpers/workPresentation.helpers";
import type { DisplayWork, WorkGridProps } from "../types/workPresentation.types";

export default function WorkGrid({
  workList,
  categories = [],
  timers,
  onStart,
  onComplete,
  onVerify,
  onCancel,
}: WorkGridProps) {
  const [locations, setLocations] = useState<Record<string, string>>({});

  const normalizedWorkList = useMemo(() => {
    return normalizeAssignedWorks(workList).filter(
      (work) => work.status !== "UNKNOWN"
    );
  }, [workList]);

  useEffect(() => {
    if (!normalizedWorkList.length) return;

    normalizedWorkList.forEach((work) => {
      if (!work.id || locations[work.id]) return;

      const coordinates = getWorkCoordinates(getWorkLocation(work));
      if (!coordinates) return;

      reverseGeocode(coordinates.lat, coordinates.lng)
        .then((address) =>
          setLocations((prev) => ({
            ...prev,
            [work.id]: address,
          }))
        )
        .catch(() =>
          setLocations((prev) => ({
            ...prev,
            [work.id]: `${coordinates.lat}, ${coordinates.lng}`,
          }))
        );
    });
  }, [normalizedWorkList, locations]);

  if (!normalizedWorkList.length) {
    return (
      <div className="text-center py-16 text-gray-500 text-sm">
        No works available
      </div>
    );
  }

  const renderedIds = new Set<string>();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {normalizedWorkList.map((work: any) => {
        if (renderedIds.has(work.id)) return null;
        renderedIds.add(work.id);

        const categoryName =
          categories.find((category) => category._id === work.service?.category)
            ?.name || "N/A";

        const coordinates = getWorkCoordinates(getWorkLocation(work));

        // const poolAmount =
        //   work?.workerPoolAmount ?? work?.booking?.workerPoolAmount ?? 0;

        // const workers =
        //   work?.booking?.numberOfWorkers ?? work?.numberOfWorkers ?? 0;

        // const amount = workers ? (poolAmount / workers).toFixed(2) : "0";

        const loc =
          work.location ??
          work.booking?.location ??
          work.booking?.coordinates;

        let lat: number | null = null;
        let lng: number | null = null;

        try {
          if (typeof loc === "string") {
            [lat, lng] = loc.split(",").map(Number);
          } else {
            lat = loc?.coordinates?.[1] ?? null;
            lng = loc?.coordinates?.[0] ?? null;
          }
        } catch {}

        return (
          <CommonCard
            key={work.id}
            className="flex flex-col justify-between p-4 rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <div className="space-y-2 text-sm">
              <h3 className="font-semibold text-base truncate">
                {work.service?.name || "N/A"}
              </h3>

              <p className="text-gray-600 truncate">
                Customer: {work.customer?.fullName || "N/A"}
              </p>

              <p className="text-gray-500 text-xs line-clamp-2">
                Location: {locations[work.id] || "Fetching location..."}
              </p>

              <p className="text-xs text-gray-500">
                Category: {categoryName}
              </p>

              <p className="text-xs font-medium text-green-600">
                Worker Pool Amount: {getWorkerAmount(work)}{" "}
                {work.booking?.currency}
              </p>

              <p className="text-xs text-gray-500">
                Price Mode:{" "}
                {String(
                  work.pricingMode ??
                    work.booking?.pricingMode ??
                    "N/A"
                )}
              </p>

              <p className="text-xs font-medium">Status: {work.status}</p>

              {isActiveWork(work) && timers[work.id] && (
                <p className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                  <Timer size={14} aria-hidden="true" />
                  {timers[work.id]}
                </p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              {coordinates && lat != null && lng != null && (
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
                    )
                  }
                  className="w-full"
                >
                  <MapPin size={16} aria-hidden="true" />
                  Get Directions
                </Button>
              )}

              <div className="flex gap-2">
                {canStartOrCancel(work) && (
                  <>
                    <Button className="flex-1" onClick={() => onStart(work)}>
                      Start
                    </Button>

                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => onCancel(work)}
                    >
                      Cancel
                    </Button>
                  </>
                )}

                {work.status === "WORK_COMPLETED_PENDING" && (
                  <Button className="w-full" onClick={() => onVerify(work)}>
                    Verify OTP
                  </Button>
                )}

                {isActiveWork(work) && (
                  <Button
                    className="w-full"
                    onClick={() =>
                      onComplete({
                        ...work,
                        elapsedTime: timers[work.id] || "00:00:00",
                      })
                    }
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </CommonCard>
        );
      })}
    </div>
  );
}

function canStartOrCancel(work: DisplayWork) {
  return ["ASSIGNED", "WORKER_ACCEPTED"].includes(work.status);
}

function isActiveWork(work: DisplayWork) {
  return ["STARTED", "IN_PROGRESS"].includes(work.status);
}
