"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CommonCard } from "@/components/common/CommonCard";
import { useAssign } from "@/pages/Booking/AvaliableWorks/presentation/hooks/useAssign";
import { useLanguage } from "@/context/LanguageContext";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useCancel } from "./hooks/useCancel";
import WorkGrid from "./components/WorkGrid";
import WorkModals from "./components/WorkModals";
import { useBookingSocket } from "@/core/Websocket/presentation/utils/socketlogic";
// import { useAuthStore } from "@/core/store/auth";

export default function AvailableWorkPage() {
  const { assignedWorks } = useAssign();
  const { translations, language } = useLanguage();
  const { data: categories } = useServiceCategory();
  const cancelMutation = useCancel();

  const isRTL = language === "AR";

  const [workList, setWorkList] = useState<any[]>([]);
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [modalType, setModalType] = useState<
    "start" | "complete" | "verify" | null
  >(null);
  const [cancelConfirmWork, setCancelConfirmWork] = useState<any>(null);
  const [timers, setTimers] = useState<Record<string, string>>({});

  const workRef = useRef<any[]>([]);
  workRef.current = workList;

  /* ---------------- INIT WORK LIST ---------------- */
  useEffect(() => {
    if (!assignedWorks) return;

    setWorkList((prev) =>
      assignedWorks.map((newWork: any) => {
        const existing = prev.find((w) => w._id === newWork._id);

        return existing
          ? {
              ...newWork,
              ...existing,
            }
          : newWork;
      })
    );
  }, [assignedWorks]);
  
 useBookingSocket();
  /* ---------------- TIMER LOGIC ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      const updated: Record<string, string> = {};

      workRef.current.forEach((w) => {
        const workStatus = w.status?.toUpperCase();
        const bookingStatus = w.booking?.status?.toUpperCase();

        const isInProgress =
          ["STARTED", "IN_PROGRESS"].includes(workStatus) &&
          !["COMPLETED", "CANCELLED", "WORK_COMPLETED_PENDING"].includes(
            bookingStatus
          );

        if (!isInProgress) return;

        const startedAt =
          w.workStartedAt || w.startedAt || w.booking?.workStartedAt;

        if (!startedAt) return;

        const elapsed = Math.max(
          0,
          Date.now() - new Date(startedAt).getTime()
        );

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
  }, []);

  /* ---------------- UPDATE WORK ---------------- */
  const updateWork = useCallback((updated: any) => {
    setWorkList((prev) =>
      prev.map((w) => {
        if (w._id !== updated._id) return w;

        return {
          ...w,
          ...updated,
          booking: {
            ...w.booking,
            ...updated.booking,
          },
          workStartedAt: [
            "COMPLETED",
            "CANCELLED",
            "WORK_COMPLETED_PENDING",
          ].includes(updated.status?.toUpperCase())
            ? null
            : updated.workStartedAt ?? w.workStartedAt,
        };
      })
    );
  }, []);

  /* ---------------- START WORK ---------------- */
  const handleStartWork = (work: any) => {
    updateWork({
      _id: work._id,
      status: "IN_PROGRESS",
      workStartedAt: new Date().toISOString(),
    });

    openModal(work, "start");
  };

  /* ---------------- MODAL HANDLERS ---------------- */
  const openModal = (work: any, type: any) => {
    setSelectedWork({ ...work, bookingId: work.booking?._id });
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedWork(null);
    setModalType(null);
  };

  /* ---------------- UI ---------------- */
  return (
    <CommonCard
      title={translations?.sidebar.availableWork || "Available Work"}
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
        updateWork={updateWork}
        cancelConfirmWork={cancelConfirmWork}
        setCancelConfirmWork={setCancelConfirmWork}
        cancelMutation={cancelMutation}
        timers={timers}
      />
    </CommonCard>
  );
}