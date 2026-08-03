"use client";

import { useEffect, useState } from "react";
import { CommonCard } from "@/components/common/CommonCard";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useCancel } from "./hooks/useCancel";
import { useAssign } from "./hooks/useAssign";

import { useWorkTimers } from "./hooks/useWorkTimers";
import WorkGrid from "./components/WorkGrid";
import WorkModals from "./components/WorkModals";

import { getBookingId } from "./utils/workPresentation.helpers";
import type {
  CancelableWork,
  DisplayWork,
  WorkModalType,
} from "../domain/entities/workPresentation.types";
import { useLiveWorkBookings } from "./hooks/useLiveBookings";

export default function AvailableWorkPage() {
  const { language, t } = useLanguage();
  const { data: categories } = useServiceCategory();
  const cancelMutation = useCancel();
  const { assignedWorks: assignedFromApi, isLoading, refetch } = useAssign();
  const isRTL = language === "AR";

  const { workList, liveBookingsCount, upsertLiveBooking, removeLiveBooking } =
    useLiveWorkBookings({ assignedFromApi, refetch });
  const timers = useWorkTimers(workList);

  const [selectedWork, setSelectedWork] = useState<DisplayWork | null>(null);
  const [modalType, setModalType] = useState<WorkModalType | null>(null);
  const [cancelConfirmWork, setCancelConfirmWork] =
    useState<CancelableWork | null>(null);

  // Close any open modal if the item it refers to falls out of the list
  // (e.g. it moved to a terminal/cancelled status via a socket update).
  useEffect(() => {
    if (
      selectedWork &&
      !workList.some((w) => getBookingId(w) === getBookingId(selectedWork))
    ) {
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

  if (isLoading && liveBookingsCount === 0) {
    return (
      <div className="mt-8 px-4 lg:px-6">
        <CommonCard title={t("sidebar.assignedWork")} headerAlign={isRTL ? "right" : "left"}>
          <div className="text-center py-16 text-gray-500">{t("common.noData")}</div>
        </CommonCard>
      </div>
    );
  }

  return (
    <div className="mt-8 px-4 lg:px-6">
      <CommonCard title={t("sidebar.assignedWork")} headerAlign={isRTL ? "right" : "left"}>
        <WorkGrid
          workList={workList}
          isRTL={isRTL}
          categories={categories}
          timers={timers}
          onStart={(work) => openModal(work, "start")}
          onComplete={(work) => openModal(work, "complete")}
          onVerify={(work) => openModal(work, "verify")}
          onCancel={setCancelConfirmWork}
          onConfirmCashPayment={(work) => openModal(work, "confirmCashPayment")}
        />

        <WorkModals
          selectedWork={selectedWork}
          modalType={modalType}
          closeModal={closeModal}
          cancelConfirmWork={cancelConfirmWork}
          setCancelConfirmWork={setCancelConfirmWork}
          cancelMutation={cancelMutation}
          onUpsertWork={upsertLiveBooking}
          onRemoveWork={removeLiveBooking}
          onCancelSuccess={(updatedBooking) => {
            const bookingId = updatedBooking?._id;
            if (bookingId) removeLiveBooking(bookingId);
          }}
        />
      </CommonCard>
    </div>
  );
}