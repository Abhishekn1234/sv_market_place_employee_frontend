"use client";

import { useEffect, useMemo, useState } from "react";
import { CommonCard } from "@/components/common/CommonCard";

import { useCancel } from "@/pages/Booking/AvaliableWorks/presentation/hooks/useCancel";
import WorkModals from "@/pages/Booking/AvaliableWorks/presentation/components/WorkModals";
import { useAssign } from "@/pages/Booking/AvaliableWorks/presentation/hooks/useAssign";

const FINAL_STATUSES = [
  "COMPLETED",
  "WORK_COMPLETED_PENDING",
  "WORKER_CANCELLED",
  "WORKER_REJECTED",
];

export default function CurrentWorkPage() {
  const cancelMutation = useCancel();

  /* ✅ SAME SOURCE AS AVAILABLE WORKS */
  const { assignedWorks: assignedBookings } = useAssign();

  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [modalType, setModalType] =
    useState<"start" | "complete" | "verify" | "dispute" | null>(null);

  const [cancelConfirmWork, setCancelConfirmWork] = useState<any>(null);
  const [timer, setTimer] = useState<string>("00:00:00");

  /* ================= CURRENT WORK ================= */
  const currentWork = useMemo(() => {
    return assignedBookings.find(
      (w: any) =>
        !FINAL_STATUSES.includes((w.status || "").toUpperCase())
    );
  }, [assignedBookings]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!currentWork) return;

    const interval = setInterval(() => {
      const startedAt =
        currentWork.workStartedAt ||
        currentWork.startedAt ||
        currentWork.booking?.startedAt;

      if (!startedAt) return;

      const elapsed = Date.now() - new Date(startedAt).getTime();

      const h = Math.floor(elapsed / 3600000);
      const m = Math.floor((elapsed % 3600000) / 60000);
      const s = Math.floor((elapsed % 60000) / 1000);

      setTimer(
        `${String(h).padStart(2, "0")}:${String(m).padStart(
          2,
          "0"
        )}:${String(s).padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [currentWork]);

  /* ================= HANDLERS ================= */
  const openModal = (type: any) => {
    setSelectedWork(currentWork);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedWork(null);
    setModalType(null);
  };

  if (!currentWork) {
    return (
      <CommonCard title="Current Work">
        <p className="text-sm text-gray-500">No active work</p>
      </CommonCard>
    );
  }

  return (
    <>
      <CommonCard
        title="Current Work"
        description="Your ongoing job"
        label="Timer"
        value={timer}
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => openModal("complete")}
              className="text-green-600 text-sm"
            >
              Complete
            </button>
            <button
              onClick={() => openModal("verify")}
              className="text-blue-600 text-sm"
            >
              Verify
            </button>
            <button
              onClick={() => setCancelConfirmWork(currentWork)}
              className="text-red-600 text-sm"
            >
              Cancel
            </button>
          </div>
        }
      >
        <p className="text-sm text-gray-600">
          Booking ID: {currentWork._id}
        </p>

        <p className="text-sm text-gray-600">
          Status: {currentWork.status}
        </p>
      </CommonCard>

      <WorkModals
        selectedWork={selectedWork}
        modalType={modalType}
        closeModal={closeModal}
        cancelConfirmWork={cancelConfirmWork}
        setCancelConfirmWork={setCancelConfirmWork}
        cancelMutation={cancelMutation}
        timers={{ [currentWork._id]: timer }}
      />
    </>
  );
}