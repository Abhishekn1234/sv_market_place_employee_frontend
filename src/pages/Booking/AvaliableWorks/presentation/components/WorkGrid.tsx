import { Button } from "@/components/ui/button";
import { CommonCard } from "@/components/common/CommonCard";
import { reverseGeocode } from "@/components/common/CommonMap";
import { useEffect, useState, useMemo } from "react";

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

  /* ================= NORMALIZED DATA ================= */
  const normalizedWorkList = useMemo(() => {
    return (workList ?? []).map((w: any) => ({
      ...w,
      id: w._id ?? w.bookingId,
      status: (w.status ?? "").toUpperCase(),
    }));
  }, [workList]);
  // console.log(normalizedWorkList);

  /* ================= LOCATION RESOLVE ================= */
  useEffect(() => {
    if (!normalizedWorkList.length) return;

    normalizedWorkList.forEach((w: any) => {
      if (!w.id || locations[w.id]) return;

      const loc = w.location ?? w.booking?.location;
      if (!loc) return;

      let lat: number, lng: number;

      try {
        if (typeof loc === "string") {
          [lat, lng] = loc.split(",").map(Number);
        } else {
          lat = loc?.coordinates?.[1];
          lng = loc?.coordinates?.[0];
        }

        if (!lat || !lng) return;

        reverseGeocode(lat, lng)
          .then((addr) =>
            setLocations((prev) => ({ ...prev, [w.id]: addr }))
          )
          .catch(() =>
            setLocations((prev) => ({
              ...prev,
              [w.id]: `${lat}, ${lng}`,
            }))
          );
      } catch {}
    });
  }, [normalizedWorkList]);

  /* ================= EMPTY STATE ================= */
  if (!normalizedWorkList.length) {
    return (
      <div className="text-center py-16 text-gray-500 text-sm">
        No works available
      </div>
    );
  }

  /* ================= DEDUPE ================= */
  const seen = new Set();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {normalizedWorkList.map((w: any) => {
        if (seen.has(w.id)) return null;
        seen.add(w.id);

        const status = w.status;

        const categoryName =
          categories?.find((c: any) => c._id === w.service?.category)
            ?.name || "N/A";

        const poolAmount = w?.workerPoolAmount ?? w.booking?.workerPoolAmount;
        const workers = w.booking?.numberOfWorkers??w?.numberOfWorkers;
        const amount = (poolAmount / workers).toFixed(2);

        let lat: number | null = null;
        let lng: number | null = null;

        const loc = w.location ??w.booking.location??w.booking.coordinates;
        try {
          if (typeof loc === "string") {
            [lat, lng] = loc.split(",").map(Number);
          } else {
            lat = loc?.coordinates?.[1];
            lng = loc?.coordinates?.[0];
          }
        } catch {}
        // console.log("WORK LOCATION:", w.id, { lat, lng, location: w.location, booking: w.booking?.location });

        return (
          <CommonCard
            key={w.id}
            className="flex flex-col justify-between p-4 rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <div className="space-y-2 text-sm">
              <h3 className="font-semibold text-base truncate">
                {w.service?.name}
              </h3>

              <p className="text-gray-600 truncate">
                Customer: {w.customer?.fullName}
              </p>

              <p className="text-gray-500 text-xs line-clamp-2">
                Location: {locations[w.id] || "Fetching location..."}
              </p>

              <p className="text-xs text-gray-500">
                Category: {categoryName}
              </p>

              <p className="text-xs font-medium text-green-600">
                Worker Pool Amount: {amount} {w.booking?.currency}
              </p>

              <p className="text-xs text-gray-500">
                Price Mode: {w.pricingMode?? w.booking?.pricingMode}
              </p>

              <p className="text-xs font-medium">
                Status: {status}
              </p>

              {(status === "STARTED" || status === "IN_PROGRESS") &&
                timers[w.id] && (
                  <p className="text-green-600 font-semibold text-sm">
                    ⏱ {timers[w.id]}
                  </p>
                )}
            </div>

            <div className="mt-4 space-y-2">
              {lat != null && lng != null && (
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
                    )
                  }
                  className="w-full"
                >
                  📍 Get Directions
                </Button>
              )}

              {/* ACTIONS */}
              <div className="flex gap-2">
                {["ASSIGNED", "WORKER_ACCEPTED"].includes(status) && (
                  <>
                    <Button className="flex-1" onClick={() => onStart(w)}>
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

                {status === "WORK_COMPLETED_PENDING" && (
                  <Button className="w-full" onClick={() => onVerify(w)}>
                    Verify OTP
                  </Button>
                )}

                {(status === "STARTED" || status === "IN_PROGRESS") &&
                  status !== "COMPLETED" && (
                    <Button
                      className="w-full"
                      onClick={() =>
                        onComplete({
                          ...w,
                          elapsedTime: timers[w.id] || "00:00:00",
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