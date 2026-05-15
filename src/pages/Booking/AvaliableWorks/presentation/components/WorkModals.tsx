"use client";

import { useState } from "react";
import StartWork from "./StartWork/StartWork";
import CompleteWork from "./CompleteWork/CompleteWork";
import VerifyOtpModal from "./VerifyOtpModal/VerifyOtpModal";
import DisputeModal from "./DisputeModal/DisputeModal";
import { CommonModal } from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

import { useAssignedEmitter } from "@/core/Websocket/presentation/utils/useAssignemitter";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import { getBookingId } from "../helpers/workPresentation.helpers";

import type {
  DisplayWork,
  WorkModalsProps,
  
  
} from "../types/workPresentation.types";
import type { Dispute } from "@/pages/History/BookingHistory/domain/entities/disputes";
import type { CancelReasonType, CancelWork } from "../../domain/entities/cancelwork";
import { useLanguage } from "@/context/LanguageContext";
// import { CancelWork } from "../../domain/entities/cancelwork";




export default function WorkModals({
  selectedWork,
  modalType,
  closeModal,
  cancelConfirmWork,
  setCancelConfirmWork,
  cancelMutation,
  // onCancelSuccess,
  onCompleteSuccess,
}: WorkModalsProps) {
  const { emitStart, emitComplete, emitVerify, emitCancel, emitDispute } =
    useAssignedEmitter();

  const upsertAssigned = useBookingSocketStore((s) => s.upsertAssigned);
  const [disputeWork, setDisputeWork] = useState<DisplayWork | null>(null);
  const {t}=useLanguage();
 const handleCancel = () => {
  if (!cancelConfirmWork) return;

  const bookingId = getBookingId(cancelConfirmWork);

  const type: CancelReasonType | undefined =
    cancelConfirmWork.cancelType;

  if (!type) {
    toast.error(t("cancelBooking.errorSelectReason"));
    return;
  }

  if (
    type === "OTHER" &&
    !cancelConfirmWork.cancelledReason
  ) {
    toast.error(
      t("cancelBooking.errorEnterReason")
    );
    return;
  }

  const payload: CancelWork =
    type === "OTHER"
      ? {
          bookingId,
          cancelReasonType: "OTHER",
          cancelReason:
            cancelConfirmWork.cancelledReason!,
        }
      : {
          bookingId,
          cancelReasonType: type,
        };

  cancelMutation.mutate(payload, {
    onSuccess: (_data: any) => {
      // const booking =
      //   data?.booking ?? data;

      // ✅ ONLY SOCKET EMIT
      emitCancel({
        bookingId,
        status: "WORKER_CANCELLED",
      });

      // optional: keep only UI cleanup
      setCancelConfirmWork(null);
    },
  });
};
const CANCEL_REASONS = [
  "BOOKED_WRONG_SERVICE",
  "BOOKED_BY_MISTAKE",
  "SCHEDULE_CHANGED",
  "PRICE_TOO_HIGH",
  "SERVICE_NO_LONGER_NEEDED",
  "OTHER",
] as const;

  return (
    <>
      {modalType === "start" && selectedWork && (
        <StartWork
          open
          work={selectedWork}
          onClose={closeModal}
          onWorkStarted={(updated) => {
          const bookingId = getBookingId(selectedWork);
          const startedAt = new Date().toISOString();

          upsertAssigned({
            ...selectedWork,
            ...updated,
            _id: bookingId,
            bookingId,
            status: "IN_PROGRESS",
            workStartedAt: startedAt,
          });

          emitStart({
            bookingId,
            status: "IN_PROGRESS",
            startedAt,
          });
        }}
        />
      )}

              {modalType === "complete" && selectedWork && (
          <CompleteWork
            work={selectedWork}
            open
            onClose={closeModal}
            onSuccess={(updatedWork) => {
               const bookingId = getBookingId(selectedWork);

              upsertAssigned({
                ...selectedWork,
                ...updatedWork,
                _id: bookingId,
                bookingId,
                status: "WORK_COMPLETED_PENDING",
                workStartedAt: null,
              });

              emitComplete({
                bookingId,
                status: "WORK_COMPLETED_PENDING",
              });

              onCompleteSuccess?.(updatedWork);
            }}
          />
        )}

              {modalType === "verify" && selectedWork && (
          <VerifyOtpModal
            open
            work={selectedWork}
            onClose={closeModal}
            onSuccess={() => {
               const bookingId = getBookingId(selectedWork);

  upsertAssigned({
    ...selectedWork,
    _id: bookingId,
    bookingId,
    status: "COMPLETED",
  });

  emitVerify({
    bookingId,
    status: "COMPLETED",
  });
            }}
          />
        )}

      <DisputeModal
        open={!!disputeWork}
        work={disputeWork}
        onClose={() => setDisputeWork(null)}
        onSubmit={(data:Dispute) => {
          if (!disputeWork) return;

          emitDispute({
            bookingId: disputeWork._id,
            reason: data.reason,
            status: "DISPUTE_CREATED",
          });

          setDisputeWork(null);
        }}
      />

     {cancelConfirmWork && (
  <CommonModal open onOpenChange={() => setCancelConfirmWork(null)}>
    <CommonModal.Content>
      <CommonModal.Header>
        {t("cancelBooking.title")}
      </CommonModal.Header>

      <CommonModal.Body>
        <select
          value={cancelConfirmWork.cancelType ?? ""}
          onChange={(e) => {
            const value = e.target.value;

            setCancelConfirmWork((p) =>
              p
                ? {
                    ...p,
                    cancelType:
                      value === "" ? undefined : (value as CancelReasonType),
                  }
                : p
            );
          }}
          className="w-full border p-2 mb-3 rounded"
        >
          <option value="">
            {t("cancelBooking.selectReason")}
          </option>

          {CANCEL_REASONS.map((key) => (
            <option key={key} value={key}>
              {t(`cancelBooking.reasons.${key}`)}
            </option>
          ))}
        </select>

        <Textarea
          value={cancelConfirmWork.cancelledReason || ""}
          onChange={(e) =>
            setCancelConfirmWork((p) =>
              p ? { ...p, cancelledReason: e.target.value } : p
            )
          }
          className="shadow-sm"
          placeholder={t("cancelBooking.enterReason")}
        />
      </CommonModal.Body>

      <CommonModal.Footer>
        <Button
          variant="outline"
          onClick={() => setCancelConfirmWork(null)}
        >
          {t("cancelBooking.no")}
        </Button>

        <Button onClick={handleCancel}>
          {t("cancelBooking.yes")}
        </Button>
      </CommonModal.Footer>
    </CommonModal.Content>
  </CommonModal>
)}
    </>
  );
}