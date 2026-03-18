"use client";

import { useState, useEffect } from "react";
import { CommonCard } from "@/components/common/CommonCard";
import { useAssign } from "@/pages/Booking/AvaliableWorks/presentation/hooks/useAssign";
import { useLanguage } from "@/context/LanguageContext";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useCancel } from "./hooks/useCancel";
import WorkGrid from "./components/WorkGrid";
import WorkModals from "./components/WorkModals";

export default function AvailableWorkPage() {
  const { assignedWorks } = useAssign();
  const { translations, language } = useLanguage();
  const { data: categories } = useServiceCategory();
  const cancelMutation = useCancel();

  const isRTL = language === "AR";

  const [workList, setWorkList] = useState(assignedWorks || []);
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [modalType, setModalType] = useState<"start" | "complete" | "verify" | null>(null);
  const [cancelConfirmWork, setCancelConfirmWork] = useState<any>(null);
  const [timers, setTimers] = useState<Record<string, string>>({});

  // ✅ TIMER LOGIC
  useEffect(() => {
    const interval = setInterval(() => {
      const updated: Record<string, string> = {};

      workList.forEach((w) => {
        if (!["IN_PROGRESS", "STARTED", "inProgress"].includes(w.status)) return;

        const startedAt = w.workStartedAt;
        if (!startedAt) return;

        const elapsed = Date.now() - new Date(startedAt).getTime();

        const h = Math.floor(elapsed / 3600000);
        const m = Math.floor((elapsed % 3600000) / 60000);
        const s = Math.floor((elapsed % 60000) / 1000);

        updated[w._id] = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      });

      setTimers(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [workList]);

  // ✅ ACTIONS
  const openModal = (work: any, type: any) => {
    setSelectedWork({ ...work, bookingId: work.booking?._id });
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedWork(null);
    setModalType(null);
  };

  const updateWork = (updated: any) => {
    setWorkList((prev) =>
      prev.map((w) => (w._id === updated._id ? { ...w, ...updated } : w))
    );
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
        onStart={(w:any) => openModal(w, "start")}
        onComplete={(w:any) => openModal(w, "complete")}
        onVerify={(w:any) => openModal(w, "verify")}
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
      />
    </CommonCard>
  );
}