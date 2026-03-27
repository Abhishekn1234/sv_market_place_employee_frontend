import { Button } from "@/components/ui/button";
import { CommonCard } from "@/components/common/CommonCard";
import { reverseGeocode } from "@/components/common/CommonMap";
import { useEffect, useState } from "react";

export default function WorkGrid({
  workList,
  categories,
  timers,
  onStart,
  onComplete,
  onVerify,
  onCancel,
}: any) {
  const [locations, setLocations] = useState<Record<string, string>>({});

  useEffect(() => {
    workList?.forEach((w: any) => {
      if (locations[w._id]) return;

      const loc = w.booking?.location;
      if (!loc) return;

      let lat: number, lng: number;

      try {
        if (typeof loc === "string") {
          [lat, lng] = loc.split(",").map(Number);
        } else {
          lat = loc.coordinates?.[1];
          lng = loc.coordinates?.[0];
        }

        if (!lat || !lng) return;

        reverseGeocode(lat, lng)
          .then((addr) =>
            setLocations((prev) => ({ ...prev, [w._id]: addr }))
          )
          .catch(() =>
            setLocations((prev) => ({
              ...prev,
              [w._id]: `${lat}, ${lng}`,
            }))
          );
      } catch {}
    });
  }, [workList]);

  if (!workList?.length) {
    return (
      <div className="text-center py-16 text-gray-500 text-sm">
        No works available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {workList.map((w: any) => {
        const workStatus = w.status?.toUpperCase();
        const bookingStatus = w.booking?.status?.toUpperCase();

        const categoryName =
          categories?.find((c: any) => c._id === w.service?.category)
            ?.name || "N/A";

        const poolAmount = w.booking?.workerPoolAmount ?? 0;
        const workers = w.booking?.numberOfWorkers ?? 1;
        const amount = (poolAmount / workers).toFixed(2);

        let lat: number | null = null;
        let lng: number | null = null;

        const loc = w.booking?.location;
        try {
          if (typeof loc === "string") {
            [lat, lng] = loc.split(",").map(Number);
          } else {
            lat = loc?.coordinates?.[1];
            lng = loc?.coordinates?.[0];
          }
        } catch {}

        const handleDirections = () => {
          if (!lat || !lng) return;
          const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
          window.open(url, "_blank");
        };

        return (
          <CommonCard
            key={w._id}
            className="flex flex-col justify-between p-4 rounded-2xl shadow-sm hover:shadow-md transition"
          >
            {/* 🔹 DETAILS */}
            <div className="space-y-2 text-sm">
              <h3 className="font-semibold text-base truncate">
                {w.service?.name}
              </h3>

              <p className="text-gray-600 truncate">
                👤 {w.customer?.fullName}
              </p>

              <p className="text-gray-500 text-xs line-clamp-2">
                📍 {locations[w._id] || "Fetching location..."}
              </p>

              <p className="text-xs text-gray-500">
                Category: {categoryName}
              </p>

              <p className="text-xs text-gray-500">
                Tier: {w.serviceTier?.displayName}
              </p>

              <p className="text-xs font-medium text-green-600">
                {amount} {w.booking?.currency}
              </p>

              <p className="text-xs text-gray-500">
                {w.booking?.pricingMode}
              </p>

              <p className="text-xs font-medium">
                Status: {bookingStatus}
              </p>

              {(workStatus === "STARTED" ||
                workStatus === "IN_PROGRESS") &&
                timers[w._id] && (
                  <p className="text-green-600 font-semibold text-sm">
                    ⏱ {timers[w._id]}
                  </p>
                )}
            </div>

            {/* 🔹 ACTIONS */}
            <div className="mt-4 space-y-2">
              
              {/* 📍 Directions Button */}
              {lat && lng && (
                <Button
                  variant="outline"
                  onClick={handleDirections}
                  className="w-full"
                >
                  📍 Get Directions
                </Button>
              )}

              {/* 🔹 Work Actions */}
              <div className="flex gap-2">
                {workStatus === "ASSIGNED" && (
                  <>
                    <Button
                      className="flex-1"
                      onClick={() => onStart(w)}
                    >
                      Start
                    </Button>

                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => onCancel(w)}
                    >
                      Cancel
                    </Button>
                  </>
                )}

                {bookingStatus === "WORK_COMPLETED_PENDING" ? (
                  <Button
                    className="w-full"
                    onClick={() => onVerify(w)}
                  >
                    Verify OTP
                  </Button>
                ) : (
                  (workStatus === "STARTED" ||
                    workStatus === "IN_PROGRESS") &&
                  bookingStatus !== "COMPLETED" && (
                    <Button
                      className="w-full"
                      onClick={() =>
                        onComplete({
                          ...w,
                          elapsedTime:
                            timers[w._id] || "00:00:00",
                        })
                      }
                    >
                      Complete
                    </Button>
                  )
                )}
              </div>
            </div>
          </CommonCard>
        );
      })}
    </div>
  );
}