"use client";

import { useEffect, useState, useMemo } from "react";
import { CommonCard } from "@/components/common/CommonCard";

import { useLanguage } from "@/context/LanguageContext";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useCancel } from "./hooks/useCancel";
import { useAssign } from "./hooks/useAssign";

import WorkGrid from "./components/WorkGrid";
import WorkModals from "./components/WorkModals";

import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import type { Booking } from "../../AvailableBooking/domain/entities/booking";

const FINAL_STATUSES = [
  "COMPLETED",
  "WORK_COMPLETED_PENDING",
  "WORKER_CANCELLED",
  "WORKER_REJECTED",
];

export default function AvailableWorkPage() {
  const { language, t } = useLanguage();
  const { data: categories } = useServiceCategory();
  const cancelMutation = useCancel();
  const { assignedWorks: assignedFromApi, isLoading } = useAssign();

  const isRTL = language === "AR";

  /* ================= ZUSTAND (SOCKET) ================= */
  const socketBookings = useBookingSocketStore(
    (s) => s.assignedBookings
  );

  const upsertAssigned = useBookingSocketStore((s) => s.upsertAssigned);

  /* ================= STATE ================= */
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [modalType, setModalType] =
    useState<"start" | "complete" | "verify" | "dispute" | null>(null);

  const [cancelConfirmWork, setCancelConfirmWork] = useState<any>(null);
  const [timers, setTimers] = useState<Record<string, string>>({});

  /* ================= SOURCE OF TRUTH (FALLBACK LOGIC) ================= */
  const assignedBookings =
    socketBookings.length > 0 ? socketBookings : assignedFromApi ?? [];

  /* ================= DERIVED WORK LIST ================= */
  const workList = useMemo(() => {
    const map = new Map();

    assignedBookings.forEach((b: any) => {
      const id = b._id || b.bookingId;
      if (!id) return;

      const existing = map.get(id);

      map.set(id, {
        ...(existing || {}),
        ...b,
        _id: id,
        status: (b.status || existing?.status || "").toUpperCase(),
      });
    });

    return Array.from(map.values());
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

  /* ================= HANDLERS ================= */
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

  /* ================= LOADING FALLBACK ================= */
  if (socketBookings.length === 0 && isLoading) {
    return (
      <CommonCard title={t("sidebar.assignedWork")} className="mt-6">
        <div className="py-10 text-center text-gray-500">
          Loading assigned work...
        </div>
      </CommonCard>
    );
  }

  return (
    <CommonCard
      title={t("sidebar.assignedWork")}
      className="mt-6"
      headerAlign={isRTL ? "right" : "left"}
    >
      {/* GRID */}
      <WorkGrid
        workList={workList}
        categories={categories}
        timers={timers}
        onStart={handleStartWork}
        onComplete={(w: any) => openModal(w, "complete")}
        onVerify={(w: any) => openModal(w, "verify")}
        onCancel={setCancelConfirmWork}
      />

      {/* MODALS */}
      <WorkModals
        selectedWork={selectedWork}
        modalType={modalType}
        closeModal={closeModal}
        cancelConfirmWork={cancelConfirmWork}
        setCancelConfirmWork={setCancelConfirmWork}
        cancelMutation={cancelMutation}
        timers={timers}
        onCancelSuccess={(updatedBooking: Booking) => {
          upsertAssigned(updatedBooking);
        }}
      />
    </CommonCard>
  );
}