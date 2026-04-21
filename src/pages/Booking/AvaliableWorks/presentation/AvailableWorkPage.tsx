"use client";

import { useState, useEffect, useCallback } from "react";
import { CommonCard } from "@/components/common/CommonCard";
import { useAssign } from "@/pages/Booking/AvaliableWorks/presentation/hooks/useAssign";
import { useLanguage } from "@/context/LanguageContext";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useCancel } from "./hooks/useCancel";
import WorkGrid from "./components/WorkGrid";
import WorkModals from "./components/WorkModals";
import { initializeSocket } from "@/core/Websocket/presentation/components/socket";
import { useAuthStore } from "@/core/store/auth";

export default function AvailableWorkPage() {
  const { assignedWorks } = useAssign();
  const { translations, language } = useLanguage();
  const { data: categories } = useServiceCategory();
  const cancelMutation = useCancel();

  const isRTL = language === "AR";
  const { accessToken } = useAuthStore();

  const [workList, setWorkList] = useState<any[]>([]);
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [modalType, setModalType] = useState<
    "start" | "complete" | "verify" | null
  >(null);

  const [cancelConfirmWork, setCancelConfirmWork] = useState<any>(null);
  const [timers, setTimers] = useState<Record<string, string>>({});

  // ---------------- NORMALIZE ----------------
  const normalizeWork = (data: any) => {
    const status = (data.status || "").toUpperCase();

    return {
      ...data,
      status,
      workStartedAt:
        ["COMPLETED", "CANCELLED"].includes(status)
          ? null
          : data.workStartedAt,
    };
  };

  // ---------------- UPDATE WORK (MAIN STATE ENGINE) ----------------
  const updateWork = useCallback((updated: any) => {
    setWorkList((prev) => {
      const status = updated.status?.toUpperCase();

      // ❌ REMOVE ON CANCEL
      if (["CANCELLED", "WORKER_CANCELLED"].includes(status)) {
        return prev.filter((w) => w._id !== updated._id);
      }

      return prev.map((w) =>
        w._id === updated._id
          ? {
              ...w,
              ...updated,
              booking: {
                ...w.booking,
                ...updated.booking,
              },
            }
          : w
      );
    });
  }, []);

  // ---------------- SOCKET ----------------
  useEffect(() => {
    if (!accessToken) return;

    const socket = initializeSocket("/workers/assigned-updates", accessToken);
    socket.connect();

    const handler = (payload: any) => {
      const event = payload?.event;
      const data = payload?.data;

      if (!event || !data?._id) return;

      switch (event) {
        case "booking.worker.accepted":
        case "booking.worker.rejected":
        case "booking.work.started":
        case "booking.work.completed-by-worker":
        case "booking.completion.confirmed":
        case "booking.dispute.created":
        case "booking.dispute.responded":
        case "booking.dispute.resolved":
          updateWork(normalizeWork(data));
          break;

        default:
          console.log("Unhandled event:", event);
      }
    };

    socket.on("booking.events", handler);

    return () => {
      socket.off("booking.events", handler);
      socket.disconnect();
    };
  }, [accessToken, updateWork]);

  // ---------------- INIT LIST ----------------
  useEffect(() => {
    if (!assignedWorks) return;
    setWorkList(assignedWorks);
  }, [assignedWorks]);

  // ---------------- TIMER ----------------
  useEffect(() => {
    const interval = setInterval(() => {
      const updated: Record<string, string> = {};

      workList.forEach((w) => {
        const status = w.status?.toUpperCase();

        const isRunning =
          ["STARTED", "IN_PROGRESS"].includes(status) &&
          !["COMPLETED", "CANCELLED"].includes(status);

        if (!isRunning) return;

        const startedAt =
          w.workStartedAt || w.startedAt || w.booking?.workStartedAt;

        if (!startedAt) return;

        const start = new Date(startedAt).getTime();
        let diff = Date.now() - start;

        const max =
          w.booking?.pricingMode === "HOURLY"
            ? (w.booking?.schedule?.estimatedHours ?? 0) * 3600000
            : (w.booking?.schedule?.estimatedDays ?? 0) * 24 * 3600000;

        if (max && diff > max) diff = max;

        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        updated[w._id] =
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      });

      setTimers(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [workList]);

  // ---------------- MODALS ----------------
  const handleStartWork = (work: any) => {
    updateWork({
      _id: work._id,
      status: "IN_PROGRESS",
      workStartedAt: new Date().toISOString(),
    });

    setSelectedWork(work);
    setModalType("start");
  };

  const openModal = (work: any, type: any) => {
    setSelectedWork({ ...work, bookingId: work.booking?._id });
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedWork(null);
    setModalType(null);
  };

  // ---------------- UI ----------------
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