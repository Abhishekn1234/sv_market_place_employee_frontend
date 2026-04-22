"use client";

import { useEffect, useState } from "react";
import { CommonCard } from "@/components/common/CommonCard";

import { useLanguage } from "@/context/LanguageContext";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useCancel } from "./hooks/useCancel";

import WorkGrid from "./components/WorkGrid";
import WorkModals from "./components/WorkModals";

import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";

export default function AvailableWorkPage() {
  const { translations, language } = useLanguage();
  const { data: categories } = useServiceCategory();
  const cancelMutation = useCancel();

  const isRTL = language === "AR";

  const workList = useBookingSocketStore((s) => s.bookings);
  

  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [modalType, setModalType] = useState<
    "start" | "complete" | "verify" | null
  >(null);

  const [cancelConfirmWork, setCancelConfirmWork] = useState<any>(null);

  const [timers, setTimers] = useState<Record<string, string>>({});
  const normalizeWork = (work: any) => ({
  ...work,
  bookingId: work.booking?._id || work.bookingId || work._id,
});

  /* TIMER */
  useEffect(() => {
    const interval = setInterval(() => {
      const updated: Record<string, string> = {};

      workList.forEach((w) => {
        const startedAt =
          w.workStartedAt || w.startedAt || w.booking?.workStartedAt;

        if (!startedAt) return;

        const elapsed = Date.now() - new Date(startedAt).getTime();

        const h = Math.floor(elapsed / 3600000);
        const m = Math.floor((elapsed % 3600000) / 60000);
        const s = Math.floor((elapsed % 60000) / 1000);

        updated[w._id] =
          `${String(h).padStart(2, "0")}:${String(m).padStart(
            2,
            "0"
          )}:${String(s).padStart(2, "0")}`;
      });

      setTimers(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [workList]);

  const handleStartWork = (work: any) => {
  setSelectedWork(normalizeWork(work));
  setModalType("start");
};
 const openModal = (work: any, type: any) => {
  setSelectedWork(normalizeWork(work));
  setModalType(type);
};

  const closeModal = () => {
    setSelectedWork(null);
    setModalType(null);
  };

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
        cancelConfirmWork={cancelConfirmWork}
        setCancelConfirmWork={setCancelConfirmWork}
        cancelMutation={cancelMutation}
        timers={timers}
      />
    </CommonCard>
  );
}