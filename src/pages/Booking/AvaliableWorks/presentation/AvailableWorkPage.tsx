"use client";

import { useEffect, useState, useMemo } from "react";
import { CommonCard } from "@/components/common/CommonCard";

import { useLanguage } from "@/context/LanguageContext";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useCancel } from "./hooks/useCancel";

import WorkGrid from "./components/WorkGrid";
import WorkModals from "./components/WorkModals";

import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";

const FINAL_STATUSES = [
  "COMPLETED",
  "WORK_COMPLETED_PENDING",
  "WORKER_CANCELLED",
  "WORKER_REJECTED",
];

export default function AvailableWorkPage() {
  const { language } = useLanguage();
  const { data: categories } = useServiceCategory();
  const cancelMutation = useCancel();

  const isRTL = language === "AR";

  /* ================= ZUSTAND SOURCE OF TRUTH ================= */
  const assignedBookings = useBookingSocketStore(
    (s) => s.assignedBookings
  );

  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [modalType, setModalType] =
    useState<"start" | "complete" | "verify" | null>(null);

  const [cancelConfirmWork, setCancelConfirmWork] = useState<any>(null);
  const [timers, setTimers] = useState<Record<string, string>>({});

  /* ================= DERIVED ================= */
  const workList = useMemo(() => {
    return assignedBookings.map((b: any) => ({
      ...b,
      _id: b._id || b.bookingId,
      status: (b.status || "").toUpperCase(),
    }));
  }, [assignedBookings]);

  /* ================= TIMER ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      const updated: Record<string, string> = {};

      workList.forEach((w) => {
        if (FINAL_STATUSES.includes(w.status)) return;

        const startedAt =
          w.workStartedAt || w.startedAt || w.booking?.startedAt;

        if (!startedAt) return;

        const elapsed = Date.now() - new Date(startedAt).getTime();

        const h = Math.floor(elapsed / 3600000);
        const m = Math.floor((elapsed % 3600000) / 60000);
        const s = Math.floor((elapsed % 60000) / 1000);

        updated[w._id] =
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
            s
          ).padStart(2, "0")}`;
      });

      setTimers(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [workList]);

  /* ================= UI HANDLERS ================= */
  const handleStartWork = (work: any) => {
    setSelectedWork(work);
    setModalType("start");
  };

  const openModal = (work: any, type: any) => {
    setSelectedWork(work);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedWork(null);
    setModalType(null);
  };

  return (
    <CommonCard
      title="Available Work"
      className="mt-6"
      headerAlign={isRTL ? "right" : "left"}
    >
      <WorkGrid
        workList={workList}
        categories={categories}
        timers={timers}
        onStart={handleStartWork}
        onComplete={(w: any) => openModal(w, "complete")}
        onVerify={(w: any) => openModal(w, "verify")}
        onCancel={setCancelConfirmWork}
      />

      <WorkModals
        selectedWork={selectedWork}
        modalType={modalType}
        closeModal={closeModal}
        cancelConfirmWork={cancelConfirmWork}
        setCancelConfirmWork={setCancelConfirmWork}
        cancelMutation={cancelMutation}
        timers={timers}
      />
    </CommonCard>
  );
}