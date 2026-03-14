"use client";

import { useState, useEffect } from "react";
import { CommonCard } from "@/components/common/CommonCard";
import { Button } from "@/components/ui/button";
import { useAssign } from "@/pages/Booking/AvaliableWorks/presentation/hooks/useAssign";
import { useLanguage } from "@/context/LanguageContext";
import { reverseGeocode } from "@/components/common/CommonMap";
import StartWork from "@/pages/Booking/AvaliableWorks/presentation/components/StartWork";
import CompleteWork from "@/pages/Booking/AvaliableWorks/presentation/components/CompleteWork";
import VerifyOtpModal from "@/pages/Booking/AvaliableWorks/presentation/components/VerifyOtpModal";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useCancel } from "./hooks/useCancel";
import { CommonModal } from "@/components/common/CommonModal";

export default function AvailableWorkPage() {
  const { assignedWorks } = useAssign();
  const { translations, t ,language} = useLanguage();

    const isRTL = language === "AR";
  const { data: categories } = useServiceCategory();
  const cancelMutation = useCancel();

  const [workList, setWorkList] = useState(assignedWorks || []);
  const [locations, setLocations] = useState<Record<string, string>>({});
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [modalType, setModalType] = useState<"start" | "complete" | "verify" | null>(null);
  const [cancelConfirmWork, setCancelConfirmWork] = useState<any>(null);
  const [timers, setTimers] = useState<Record<string, string>>({});

  // Reverse geocode locations
  useEffect(() => {
    workList.forEach((w) => {
      const locationStr = w.booking?.location;
      if (!locationStr || locations[w._id]) return;

      let lat: number, lng: number;

      if (typeof locationStr === "string") {
        const parts = locationStr.split(",");
        lat = parseFloat(parts[0]);
        lng = parseFloat(parts[1]);
      } else {
        lat = locationStr.coordinates[1];
        lng = locationStr.coordinates[0];
      }

      reverseGeocode(lat, lng)
        .then((addr) => setLocations((prev) => ({ ...prev, [w._id]: addr })))
        .catch(() => setLocations((prev) => ({ ...prev, [w._id]: `${lat}, ${lng}` })));
    });
  }, [workList, locations]);

  const updateWork = (updated: any) => {
  setWorkList((prev) =>
    prev.map((w) => {
      if (w._id === updated._id) {
        if (
          updated.status === "WORK_COMPLETED_PENDING" ||
          updated.status === "COMPLETED"
        ) {
          setTimers((prevTimers) => {
            const { [w._id]: _, ...rest } = prevTimers;
            return rest;
          });

          const startedAt =
            w.workStartedAt ||
            w.assignedAt ||
            w.booking?.schedule?.startDateTime;

          if (startedAt) {
            const totalElapsedMs = Date.now() - new Date(startedAt).getTime();

            const hours = Math.floor(totalElapsedMs / (1000 * 60 * 60));
            const minutes = Math.floor(
              (totalElapsedMs % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((totalElapsedMs % (1000 * 60)) / 1000);

            updated.totalTimeWorked = `${String(hours).padStart(2, "0")}:${String(
              minutes
            ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
          }
        }

        return { ...w, ...updated };
      }

      return w;
    })
  );
};
  // Open modals
 const openModal = (work: any, type: "start" | "complete" | "verify") => {
  const now = new Date().toISOString();

  setSelectedWork({
    ...work,
    bookingId: work.bookingId || work.booking?._id,
  });

  setModalType(type);

  if (type === "start") {
    // Start timer immediately in UI
    setTimers((prev) => ({
      ...prev,
      [work._id]: "00:00:00",
    }));

    // Store start time locally
    setWorkList((prev) =>
      prev.map((w) =>
        w._id === work._id
          ? {
              ...w,
              workStartedAt: now,
            }
          : w
      )
    );
  }
};
  const closeModal = () => {
    setSelectedWork(null);
    setModalType(null);
  };

  // Cancel confirmation
  const confirmCancel = (work: any) => {
    setCancelConfirmWork({
      ...work,
      bookingId: work.bookingId || work.booking?._id,
    });
  };
  const handleCancelYes = () => {
    if (!cancelConfirmWork) return;

    cancelMutation.mutate(cancelConfirmWork.bookingId, {
      onSuccess: (cancelledWork) => {
        updateWork(cancelledWork);
        setCancelConfirmWork(null);
      },
      onError: () => {
        setCancelConfirmWork(null);
      },
    });
  };
  const handleCancelNo = () => setCancelConfirmWork(null);


useEffect(() => {
  const interval = setInterval(() => {
    const updatedTimers: Record<string, string> = {};

    workList.forEach((w) => {
      if (
        w.status === "inProgress" ||
        w.status === "IN_PROGRESS" ||
        w.status === "STARTED"
      ) {
        // Use correct start time
        const startedAt =
          w.workStartedAt ||
          w.assignedAt ||
          w.booking?.schedule?.startDateTime;

        if (!startedAt) return;

        const startTime = new Date(startedAt).getTime();

        let maxDurationMs = 0;

        if (w.booking?.pricingMode === "HOURLY") {
          const hours = w.booking?.schedule?.estimatedHours ?? 1;
          maxDurationMs = hours * 60 * 60 * 1000;
        }

        if (w.booking?.pricingMode === "PER_DAY") {
          const days = w.booking?.schedule?.estimatedDays ?? 1;
          maxDurationMs = days * 24 * 60 * 60 * 1000;
        }

        const now = Date.now();
        const elapsed = now - startTime;

        const safeElapsed = Math.min(elapsed, maxDurationMs);

        const hours = Math.floor(safeElapsed / (1000 * 60 * 60));
        const minutes = Math.floor((safeElapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((safeElapsed % (1000 * 60)) / 1000);

        updatedTimers[w._id] = `${String(hours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      }
    });

    setTimers(updatedTimers);
  }, 1000);

  return () => clearInterval(interval);
}, [workList]); 
  return (
    <CommonCard title={translations?.sidebar.availableWork || "Available Work"} className="mt-6"  headerAlign={isRTL ? "right" : "left"}>
      {(!workList || workList.length === 0) && (
        <div className="text-center py-16 text-gray-500">No works available</div>
      )}

      {workList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {workList.map((w) => {
            const poolAmount = w.booking?.workerPoolAmount ?? 0;
            const workers = w.booking?.numberOfWorkers ?? 1;
            const amount = (poolAmount / workers).toFixed(2);

            const category = categories?.find((c) => c._id === w.service?.category);
            const categoryName = category?.name || "N/A";

            return (
              <CommonCard
                key={w._id}
                className="aspect-square flex flex-col justify-between shadow-sm hover:shadow-lg transition"
                contentClassName="space-y-2"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold text-base">{w.service?.name}</h3>
                  <p className="text-sm text-gray-500">Tier: {w.serviceTier?.displayName}</p>
                  <p className="text-sm text-gray-500">Customer: {w.customer?.fullName}</p>
                  <p className="text-sm text-gray-500">Location: {locations[w._id] || "Loading..."}</p>
                  <p className="text-sm text-gray-500">
                    Worker Pool Amount: {amount} {w.booking?.currency}
                  </p>
                  <p className="text-sm text-gray-500">Pricing: {w.booking?.pricingMode}</p>
                  <p className="text-sm text-gray-500">Status: {w.booking?.status}</p>
                  <p className="text-sm text-gray-500">Category: {categoryName}</p>

                {((w.status === "inProgress" ||
                      w.status === "IN_PROGRESS" ||
                      w.status === "STARTED") ||
                      w.totalTimeWorked) && (
                      <p className="text-sm text-green-600 font-semibold">
                        Time Working: {w.totalTimeWorked || timers[w._id] || "Loading..."}
                      </p>
                    )}
                </div>

                <div className="flex gap-2 pt-3">
                  {w.status === "ASSIGNED" && (
                    <>
                      <Button size="sm" className="flex-1" onClick={() => openModal(w, "start")}>
                        {t("workHistory.actions.start")}
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1" onClick={() => confirmCancel(w)}>
                        {t("workHistory.actions.cancel")}
                      </Button>
                    </>
                  )}

                  {(w.status === "inProgress" || w.status === "IN_PROGRESS" || w.status === "STARTED" ) && (
                    <Button size="sm" className="flex-1" onClick={() => openModal(w, "complete")}>
                      {t("workHistory.actions.completeWork")}
                    </Button>
                  )}

                  {w.status === "WORK_COMPLETED_PENDING" && (
                    <Button size="sm" className="flex-1" onClick={() => openModal(w, "verify")}>
                      {t("workHistory.actions.verifyOtp")}
                    </Button>
                  )}
                </div>
              </CommonCard>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {modalType === "start" && selectedWork && <StartWork open={true} work={selectedWork} onClose={closeModal} />}
      {modalType === "complete" && selectedWork && (
        <CompleteWork open={true} work={selectedWork} onClose={closeModal} onSuccess={updateWork} />
      )}
      {modalType === "verify" && selectedWork && (
        <VerifyOtpModal open={true} work={selectedWork} onClose={closeModal} onSuccess={updateWork} />
      )}

      {/* Cancel Confirmation Modal */}
      {cancelConfirmWork && (
        <CommonModal open={true} onOpenChange={handleCancelNo}>
          <CommonModal.Content>
            <CommonModal.Header>
              <h3 className="text-lg font-semibold">Cancel Work</h3>
            </CommonModal.Header>
            <CommonModal.Body>
              <p>
                Are you sure you want to cancel this work for <strong>{cancelConfirmWork.customer?.fullName}</strong>?
              </p>
            </CommonModal.Body>
            <CommonModal.Footer>
              <Button variant="outline" onClick={handleCancelNo}>No</Button>
              <Button variant="destructive" onClick={handleCancelYes} disabled={cancelMutation.isPending}>
                {cancelMutation.isPending ? "Cancelling..." : "Yes"}
              </Button>
            </CommonModal.Footer>
          </CommonModal.Content>
        </CommonModal>
      )}
    </CommonCard>
  );
}