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
// import { CancelWork } from "../../domain/entities/cancelwork";
export const CANCEL_REASONS = [
  "BOOKED_WRONG_SERVICE",
  "BOOKED_BY_MISTAKE",
  "SCHEDULE_CHANGED",
  "PRICE_TOO_HIGH",
  "SERVICE_NO_LONGER_NEEDED",
  "OTHER",
] as const;



export default function WorkModals({
  selectedWork,
  modalType,
  closeModal,
  cancelConfirmWork,
  setCancelConfirmWork,
  cancelMutation,
  onCancelSuccess,
  onCompleteSuccess,
}: WorkModalsProps) {
  const { emitStart, emitComplete, emitVerify, emitCancel, emitDispute } =
    useAssignedEmitter();

  const upsertAssigned = useBookingSocketStore((s) => s.upsertAssigned);
  const [disputeWork, setDisputeWork] = useState<DisplayWork | null>(null);

  const handleCancel = () => {
  if (!cancelConfirmWork) return;

  const bookingId = getBookingId(cancelConfirmWork);


      const type: CancelReasonType | undefined = cancelConfirmWork.cancelType;
      if (!type) {
        toast.error("Please select a cancellation reason");
        return;
      }
  if (type === "OTHER" && !cancelConfirmWork.cancelledReason) {
    toast.error("Enter cancellation reason");
    return;
  }

  const payload: CancelWork =
  type === "OTHER"
    ? {
        bookingId,
        cancelReasonType: "OTHER",
        cancelReason: cancelConfirmWork.cancelledReason!,
      }
    : {
        bookingId,
        cancelReasonType: type,
      };

  cancelMutation.mutate(payload, {
    onSuccess: (data: any) => {
      const booking = data?.booking ?? data;

      emitCancel({
        bookingId,
        status: "WORKER_CANCELLED",
      });

      onCancelSuccess?.(booking);
      toast.success("Cancelled");
    },
    onSettled: () => setCancelConfirmWork(null),
  });
};

  return (
    <>
      {modalType === "start" && selectedWork && (
        <StartWork
          open
          work={selectedWork}
          onClose={closeModal}
          onWorkStarted={(updated) => {
            const startedAt = new Date().toISOString();

            upsertAssigned({
              ...selectedWork,
              ...updated,
              status: "IN_PROGRESS",
              workStartedAt: startedAt,
            });

            emitStart({
              bookingId: selectedWork._id,
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
          onSuccess={(data) => {
            emitComplete({
              bookingId: selectedWork._id,
              ...data,
              status: "WORK_COMPLETED_PENDING",
            });

            onCompleteSuccess?.(data);
          }}
        />
      )}

      {modalType === "verify" && selectedWork && (
        <VerifyOtpModal
          open
          work={selectedWork}
          onClose={closeModal}
          onSuccess={(_data) => {
            emitVerify({
              bookingId: selectedWork._id,
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
            <CommonModal.Header>Cancel Work</CommonModal.Header>

            <CommonModal.Body>
              <select
  value={cancelConfirmWork.cancelType ?? ""}
  onChange={(e) => {
    const value = e.target.value;

    setCancelConfirmWork((p) =>
      p
        ? {
            ...p,
            cancelType: value === "" ? undefined : (value as CancelReasonType),
          }
        : p
    );
  }}
  className="w-full border p-2 mb-3 rounded"
>
                <option value="">Select reason</option>
                {CANCEL_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
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
                placeholder="Enter reason..."
              />
            </CommonModal.Body>

            <CommonModal.Footer>
              <Button variant="outline" onClick={() => setCancelConfirmWork(null)}>
                No
              </Button>
              <Button onClick={handleCancel}>Yes</Button>
            </CommonModal.Footer>
          </CommonModal.Content>
        </CommonModal>
      )}
    </>
  );
}