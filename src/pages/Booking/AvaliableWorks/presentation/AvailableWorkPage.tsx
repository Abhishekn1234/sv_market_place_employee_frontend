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

  const [workList, setWorkList] = useState<any[]>([]);
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [modalType, setModalType] = useState<"start" | "complete" | "verify" | null>(null);
  const [cancelConfirmWork, setCancelConfirmWork] = useState<any>(null);
  const [timers, setTimers] = useState<Record<string, string>>({});


  useEffect(() => {
    setWorkList(assignedWorks || []);
  }, [assignedWorks]);

  
// Timer logic
useEffect(() => {
  const interval = setInterval(() => {
    const updated: Record<string, string> = {};

    workList.forEach((w) => {
      const workStatus = w.status?.toUpperCase();
      const bookingStatus = w.booking?.status?.toUpperCase();

      // Stop timer for completed, cancelled, or pending verification works
      if (["COMPLETED", "CANCELLED", "WORK_COMPLETED_PENDING"].includes(workStatus)) return;
      if (["COMPLETED", "CANCELLED"].includes(bookingStatus)) return;

      if (!["IN_PROGRESS", "STARTED"].includes(workStatus)) return;

      const startedAt = w.workStartedAt || w.startedAt || w.booking?.workStartedAt;
      if (!startedAt) return;

      const elapsed = Date.now() - new Date(startedAt).getTime();
      if (elapsed < 0) return;

      const h = Math.floor(elapsed / 3600000);
      const m = Math.floor((elapsed % 3600000) / 60000);
      const s = Math.floor((elapsed % 60000) / 1000);

      updated[w._id] = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    });

    setTimers(updated);
  }, 1000);

  return () => clearInterval(interval);
}, [workList]);

// Update work function
const updateWork = (updated: any) => {
  setWorkList((prev) =>
    prev.map((w) =>
      w._id === updated._id
        ? {
            ...w,
            ...updated,
            workStartedAt:
              ["COMPLETED", "CANCELLED", "WORK_COMPLETED_PENDING"].includes(updated.status?.toUpperCase())
                ? null
                : w.workStartedAt,
          }
        : w
    )
  );

  // Remove timer immediately for completed / cancelled / pending verification
  if (["COMPLETED", "CANCELLED", "WORK_COMPLETED_PENDING"].includes(updated.status?.toUpperCase() ?? "")) {
    setTimers((prev) => {
      const copy = { ...prev };
      delete copy[updated._id];
      return copy;
    });
  }
};


  const openModal = (work: any, type: any) => {
    setSelectedWork({ ...work, bookingId: work.booking?._id });
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
        onStart={(w: any) => openModal(w, "start")}
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
      />
    </CommonCard>
  );
}