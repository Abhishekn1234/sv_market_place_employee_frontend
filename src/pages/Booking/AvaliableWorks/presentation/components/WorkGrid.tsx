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

  // ✅ Fetch addresses (no infinite loop)
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
          .then((addr) => {
            setLocations((prev) => ({
              ...prev,
              [w._id]: addr,
            }));
          })
          .catch(() => {
            setLocations((prev) => ({
              ...prev,
              [w._id]: `${lat}, ${lng}`,
            }));
          });
      } catch {}
    });
  }, [workList]);

  if (!workList?.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        No works available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {workList.map((w: any) => {
        const workStatus = w.status?.toUpperCase();
        const bookingStatus = w.booking?.status?.toUpperCase();

        const categoryName =
          categories?.find((c: any) => c._id === w.service?.category)?.name ||
          "N/A";

        const poolAmount = w.booking?.workerPoolAmount ?? 0;
        const workers = w.booking?.numberOfWorkers ?? 1;
        const amount = (poolAmount / workers).toFixed(2);

        return (
          <CommonCard
            key={w._id}
            className="aspect-square flex flex-col justify-between"
          >
            <div className="space-y-1 text-sm">
              <h3 className="font-semibold text-base">
                {w.service?.name}
              </h3>

              <p>Customer: {w.customer?.fullName}</p>
              <p>Location: {locations[w._id] || "Loading..."}</p>
              <p>Category: {categoryName}</p>

              <p className="text-gray-500">
                Tier: {w.serviceTier?.displayName}
              </p>

              <p className="text-gray-500">
                Worker Amount: {amount} {w.booking?.currency}
              </p>

              <p className="text-gray-500">
                Pricing: {w.booking?.pricingMode}
              </p>

              <p className="text-gray-500">
                Status: {bookingStatus}
              </p>

              {(workStatus === "STARTED" ||
                workStatus === "IN_PROGRESS") && (
                <p className="text-green-600 font-semibold">
                  Time: {timers[w._id] || "00:00:00"}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-3">
              {workStatus === "ASSIGNED" && (
                <>
                  <Button onClick={() => onStart(w)}>Start</Button>
                  <Button
                    variant="destructive"
                    onClick={() => onCancel(w)}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {/* ✅ SHOW ONLY ONE BUTTON */}
              {bookingStatus === "WORK_COMPLETED_PENDING" ? (
                <Button onClick={() => onVerify(w)}>
                  Verify OTP
                </Button>
              ) : (
                (workStatus === "STARTED" ||
                  workStatus === "IN_PROGRESS") &&
                bookingStatus !== "COMPLETED" && (
                  <Button onClick={() => onComplete(w)}>
                    Complete
                  </Button>
                )
              )}
            </div>
          </CommonCard>
        );
      })}
    </div>
  );
}