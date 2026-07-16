"use client";

import { useEffect, useMemo, useState } from "react";
import { CommonCard } from "@/components/common/CommonCard";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useCancel } from "./hooks/useCancel";
import { useAssign } from "./hooks/useAssign";
import WorkGrid from "./components/WorkGrid";
import WorkModals from "./components/WorkModals";

import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import {
  FINAL_WORK_STATUSES,
  getBookingId,
  normalizeAssignedWorks,
} from "./utils/workPresentation.helpers";
// import type { Booking } from "../../AvailableBooking/domain/entities/booking";
import type {
  CancelableWork,
  DisplayWork,
  WorkModalType,
  WorkTimerMap,
} from "../domain/entities/workPresentation.types";

// import CommonSpinner from "@/components/common/CommonSpinner";

export default function AvailableWorkPage() {
  const { language, t } = useLanguage();
  const { data: categories } = useServiceCategory();
  const cancelMutation = useCancel();
  const { assignedWorks: assignedFromApi, isLoading } = useAssign();
//  console.log("API Assigned from useAssign:", assignedFromApi);
  const isRTL = language === "AR";
  const removeAssigned = useBookingSocketStore((state) => state.removeAssigned);
  const socketBookings = useBookingSocketStore((state) => state.assignedBookings);
  // console.log(socketBookings);
  // const upsertAssigned = useBookingSocketStore((state) => state.upsertAssigned);

  const [selectedWork, setSelectedWork] = useState<DisplayWork | null>(null);
  const [modalType, setModalType] = useState<WorkModalType | null>(null);
  const [cancelConfirmWork, setCancelConfirmWork] =
    useState<CancelableWork | null>(null);
  const [timers, setTimers] = useState<WorkTimerMap>({});

    const assignedBookings = useMemo(() => {
  const map = new Map<string, any>();

  (assignedFromApi ?? []).forEach((b) => {
    const id = getBookingId(b);
    if (!id) return;
    map.set(id, b);
  });

  socketBookings.forEach((b) => {
    const id = getBookingId(b);
    if (!id) return;

    const existing = map.get(id);

    map.set(id, {
      ...existing,
      ...b,
      booking: {
        ...existing?.booking,
        ...b.booking,
      },
      workerActions: {
        ...existing?.workerActions,
        ...b.workerActions,
      },
    });
  });

  return Array.from(map.values());
}, [assignedFromApi, socketBookings]);
    // console.log("assignedBookings", assignedBookings);
  const workList = useMemo(() => {
  return normalizeAssignedWorks(
    assignedBookings
  ).filter((work) => {
    const status = (work.booking?.status ?? work.status)?.toUpperCase();

const excludedStatuses = [
  "CUSTOMER_CANCELLED",
  "WORKER_CANCELLED",
  "CANCELLED",
  "ADMIN_CANCELLED",
  "CANCELLED_BY_CUSTOMER",
  "INVOICE_GENERATED",
  "PAYMENT_COMPLETED",
];

return !excludedStatuses.includes(status || "");

    
  });
}, [assignedBookings]);
// useEffect(() => {
//   console.log("Work List:", workList);
// }, [workList]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const updatedTimers: WorkTimerMap = {};

      workList.forEach((work) => {
        if (FINAL_WORK_STATUSES.includes(work?.booking?.status??"FINALIZED")) return;

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

  // ✅ Automatically close modals if the selected work is cancelled or removed from the list
  useEffect(() => {
    if (selectedWork && !workList.some((w) => w.id === selectedWork.id)) {
      closeModal();
    }
  }, [workList, selectedWork]);

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
    <div className="mt-8 px-4 lg:px-6">
      <CommonCard
        title={t("sidebar.assignedWork")}
        headerAlign={isRTL ? "right" : "left"}
      >
        <div className="text-center py-16 text-gray-500">
          {t("common.noData")}
        </div>
      </CommonCard>
    </div>
  );
}

return (
  <div className="mt-8 px-4 lg:px-6">
    <CommonCard
      title={t("sidebar.assignedWork")}
      headerAlign={isRTL ? "right" : "left"}
    >
        <WorkGrid
      workList={workList}
      isRTL={isRTL}
      categories={categories}
      timers={timers}
      onStart={(work) => openModal(work, "start")}
      onComplete={(work) => openModal(work, "complete")}
      onVerify={(work) => openModal(work, "verify")}
      onCancel={setCancelConfirmWork}
      onConfirmCashPayment={(work) =>
        openModal(work, "confirmCashPayment")
      }
    />

      <WorkModals
        selectedWork={selectedWork}
        modalType={modalType}
        closeModal={closeModal}
        cancelConfirmWork={cancelConfirmWork}
        setCancelConfirmWork={setCancelConfirmWork}
        cancelMutation={cancelMutation}
        onCancelSuccess={(updatedBooking) => {
          const bookingId = updatedBooking?._id;
          if (bookingId) removeAssigned(bookingId);
        }}
      />
    </CommonCard>
  </div>
);
}
