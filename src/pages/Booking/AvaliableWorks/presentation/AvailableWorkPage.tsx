"use client";

import { useEffect, useMemo, useState } from "react";
import { CommonCard } from "@/components/common/CommonCard";
import { useLanguage } from "@/context/LanguageContext";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useCancel } from "./hooks/useCancel";
import { useAssign } from "./hooks/useAssign";
import WorkGrid from "./components/WorkGrid";
import WorkModals from "./components/WorkModals";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import {
  FINAL_WORK_STATUSES,
  normalizeAssignedWorks,
} from "./helpers/workPresentation.helpers";
import type { Booking } from "../../AvailableBooking/domain/entities/booking";
import type {
  CancelableWork,
  DisplayWork,
  WorkModalType,
  WorkTimerMap,
} from "./types/workPresentation.types";
import CommonSpinner from "@/components/common/CommonSpinner";

export default function AvailableWorkPage() {
  const { language, t } = useLanguage();
  const { data: categories } = useServiceCategory();
  const cancelMutation = useCancel();
  const { assignedWorks: assignedFromApi, isLoading } = useAssign();
//  console.log("API Assigned from useAssign:", assignedFromApi);
  const isRTL = language === "AR";
  const socketBookings = useBookingSocketStore((state) => state.assignedBookings);
  const upsertAssigned = useBookingSocketStore((state) => state.upsertAssigned);

  const [selectedWork, setSelectedWork] = useState<DisplayWork | null>(null);
  const [modalType, setModalType] = useState<WorkModalType | null>(null);
  const [cancelConfirmWork, setCancelConfirmWork] =
    useState<CancelableWork | null>(null);
  const [timers, setTimers] = useState<WorkTimerMap>({});

 const assignedBookings = useMemo(() => {
  const map = new Map<string, any>();

  // ✅ API FIRST
  (assignedFromApi ?? []).forEach((b) => {
    const id = b.booking?._id || b._id;
    map.set(id, b);
  });
  console.log("API Assigned:", assignedFromApi);

  // ✅ SOCKET OVERRIDE (MERGED, NOT REPLACED)
  socketBookings.forEach((b) => {
    const id = b.booking?._id || b._id;

    const existing = map.get(id);

    map.set(id, {
      ...existing,
      ...b,
      booking: {
        ...existing?.booking,
        ...b.booking,
      },
    });
  });

  return Array.from(map.values());
}, [assignedFromApi, socketBookings]);
  const workList = useMemo(() => {
  return normalizeAssignedWorks(
    assignedBookings
  ).filter((work) => {
    const status =
      work.status?.toUpperCase();

    return (
      status !== "CUSTOMER_CANCELLED" &&
      status !== "WORKER_CANCELLED"
    );
  });
}, [assignedBookings]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const updatedTimers: WorkTimerMap = {};

      workList.forEach((work) => {
        if (FINAL_WORK_STATUSES.includes(work.status)) return;

     const startedAt = work.workStartedAt;

        if (!startedAt) return;

        const elapsed = Date.now() - new Date(startedAt).getTime();
        if (Number.isNaN(elapsed)) return;

        const hours = Math.floor(elapsed / 3_600_000);
        const minutes = Math.floor((elapsed % 3_600_000) / 60_000);
        const seconds = Math.floor((elapsed % 60_000) / 1_000);

        updatedTimers[work.id] = [
          hours,
          minutes,
          seconds,
        ]
          .map((unit) => String(unit).padStart(2, "0"))
          .join(":");
      });

      setTimers(updatedTimers);
    }, 1_000);

    return () => window.clearInterval(interval);
  }, [workList]);

  const openModal = (work: DisplayWork, type: WorkModalType) => {
    setSelectedWork(work);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedWork(null);
    setModalType(null);
  };

  if (socketBookings.length === 0 && isLoading) {
    return (
      <CommonCard title={t("sidebar.assignedWork")} className="mt-6">
       <CommonSpinner size="md" color="black"/>
      </CommonCard>
    );
  }

  return (
    <CommonCard
      title={t("sidebar.assignedWork")}
      className="mt-6"
      headerAlign={isRTL ? "right" : "left"}
    >
      <WorkGrid
        workList={workList}
        categories={categories}
        timers={timers}
        onStart={(work) => openModal(work, "start")}
        onComplete={(work) => openModal(work, "complete")}
        onVerify={(work) => openModal(work, "verify")}
        onCancel={setCancelConfirmWork}
      />

      <WorkModals
        selectedWork={selectedWork}
        modalType={modalType}
        closeModal={closeModal}
        cancelConfirmWork={cancelConfirmWork}
        setCancelConfirmWork={setCancelConfirmWork}
        cancelMutation={cancelMutation}
        onCancelSuccess={(updatedBooking: Booking) => {
          upsertAssigned(updatedBooking);
        }}
      />
    </CommonCard>
  );
}
