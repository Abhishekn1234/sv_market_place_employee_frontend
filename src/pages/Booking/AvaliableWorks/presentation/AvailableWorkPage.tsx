"use client";

import { useState, useEffect } from "react";
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

  const [workList, setWorkList] = useState<any[]>([]);
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [modalType, setModalType] = useState<
    "start" | "complete" | "verify" | null
  >(null);
  const [cancelConfirmWork, setCancelConfirmWork] = useState<any>(null);
  const [timers, setTimers] = useState<Record<string, string>>({});
  const {accessToken}=useAuthStore();
  useEffect(() => {
    if (!accessToken) return;
  const socket = initializeSocket("/workers/assigned-updates", accessToken);

  socket.connect();

  const handleEvent = (payload: any) => {
    const event = payload?.event;
    const data = payload?.data;

    if (!event || !data?._id) return;

    switch (event) {
      case "booking.worker.accepted":
        updateWork(data);
        break;

      case "booking.worker.rejected":
        setWorkList((prev) =>
          prev.filter((w) => w._id !== data._id)
        );
        break;

      case "booking.work.started":
        updateWork({
          ...data,
          status: "IN_PROGRESS",
          workStartedAt: data.workStartedAt || new Date().toISOString(),
        });
        break;

      case "booking.work.completed-by-worker":
        updateWork({
          ...data,
          status: "WORK_COMPLETED_PENDING",
        });
        break;

      case "booking.completion.confirmed":
        updateWork({
          ...data,
          status: "COMPLETED",
        });
        break;

      case "booking.dispute.created":
      case "booking.dispute.responded":
      case "booking.dispute.resolved":
        updateWork(data);
        break;

      default:
        console.log("Unhandled event:", event);
    }
  };

  socket.on("booking.events", handleEvent);

  return () => {
    socket.off("booking.events", handleEvent);
    socket.disconnect();
  };
}, [accessToken]);

  /* ---------------- INIT WORK LIST ---------------- */
  useEffect(() => {
  if (!assignedWorks) return;

  setWorkList((prev) => {
    return assignedWorks.map((newWork: any) => {
      const existing = prev.find((w) => w._id === newWork._id);

      return existing
        ? {
            ...newWork,
            ...existing, // ✅ keep optimistic updates
          }
        : newWork;
    });
  });
}, [assignedWorks]);

  /* ---------------- TIMER LOGIC ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      const updated: Record<string, string> = {};

      workList.forEach((w) => {
        const workStatus = w.status?.toUpperCase();
        const bookingStatus = w.booking?.status?.toUpperCase();

        const isInProgress =
          ["STARTED", "IN_PROGRESS"].includes(workStatus) &&
          !["COMPLETED", "CANCELLED", "WORK_COMPLETED_PENDING"].includes(
            bookingStatus
          );

        if (!isInProgress) return;

        const startedAt =
          w.workStartedAt ||
          w.startedAt ||
          w.booking?.workStartedAt;

        if (!startedAt) return;

        const startedTime = new Date(startedAt).getTime();
        const now = Date.now();
        let elapsed = now - startedTime;

        if (elapsed < 0) elapsed = 0;

        let maxDuration = Infinity;

        if (w.booking?.pricingMode === "HOURLY") {
          maxDuration =
            (w.booking?.schedule?.estimatedHours ?? 0) *
            60 *
            60 *
            1000;
        } else if (w.booking?.pricingMode === "PER_DAY") {
          maxDuration =
            (w.booking?.schedule?.estimatedDays ?? 0) *
            24 *
            60 *
            60 *
            1000;
        }

        if (elapsed > maxDuration) elapsed = maxDuration;

        const h = Math.floor(elapsed / 3600000);
        const m = Math.floor((elapsed % 3600000) / 60000);
        const s = Math.floor((elapsed % 60000) / 1000);

        updated[w._id] = `${String(h).padStart(2, "0")}:${String(
          m
        ).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      });

      setTimers(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [workList]); // ✅ FIXED

  /* ---------------- UPDATE WORK ---------------- */
  const updateWork = (updated: any) => {
  setWorkList((prev) => {
    const status = updated.status?.toUpperCase();

    // 🔥 handle all cancel cases
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
            workStartedAt: [
              "COMPLETED",
              "WORKER_CANCELLED",
              "CANCELLED",
              "WORK_COMPLETED_PENDING",
            ].includes(status)
              ? null
              : updated.workStartedAt ?? w.workStartedAt,
          }
        : w
    );
  });
};

  /* ---------------- START WORK (🔥 FIXED) ---------------- */
  const handleStartWork = (work: any) => {
    // ✅ Optimistic update → timer starts immediately
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