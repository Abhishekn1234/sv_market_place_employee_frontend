"use client";

import { useState } from "react";
import StartWork from "@/pages/Booking/AvaliableWorks/presentation/components/StartWork/StartWork";
import CompleteWork from "@/pages/Booking/AvaliableWorks/presentation/components/CompleteWork/CompleteWork";
import VerifyOtpModal from "@/pages/Booking/AvaliableWorks/presentation/components/VerifyOtpModal/VerifyOtpModal";
import DisputeModal from "./DisputeModal/DisputeModal";
import { CommonModal } from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

import {
  getSocket,
  initializeSocket,
} from "@/core/Websocket/presentation/components/socket";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import { getBookingId } from "../helpers/workPresentation.helpers";
import type { CancelReasonType, CancelWork } from "../../domain/entities/cancelwork";
import type {
  DisplayWork,
  WorkModalsProps,
} from "../types/workPresentation.types";

const CANCEL_REASONS: Array<{
  label: string;
  value: CancelReasonType;
}> = [
  { label: "Booked wrong service", value: "BOOKED_WRONG_SERVICE" },
  { label: "Booked by mistake", value: "BOOKED_BY_MISTAKE" },
  { label: "Schedule changed", value: "SCHEDULE_CHANGED" },
  { label: "Price too high", value: "PRICE_TOO_HIGH" },
  { label: "Service no longer needed", value: "SERVICE_NO_LONGER_NEEDED" },
  { label: "Other", value: "OTHER" },
];

import { Textarea } from "@/components/ui/textarea";


import { useAssignedEmitter } from "@/core/Websocket/presentation/utils/useAssignemitter";

export default function WorkModals(props: any) {
  const {
    selectedWork,
    modalType,
    closeModal,
    cancelConfirmWork,
    setCancelConfirmWork,
    cancelMutation,
    onCompleteSuccess,
  } = props;

  /* ================= SOCKET ACTIONS ================= */
  const {
    emitStart,
    emitComplete,
    emitVerify,
    emitCancel,
    emitDispute,
  } = useAssignedEmitter();

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
  const socket =
    getSocket("/workers/requests") || initializeSocket("/workers/requests");
  const upsertAssigned = useBookingSocketStore((state) => state.upsertAssigned);
  const [disputeWork, setDisputeWork] = useState<DisplayWork | null>(null);

  const handleCancelYes = () => {

    if (!cancelConfirmWork?.cancelType) {
      toast.error("Please select a cancellation reason");
      return;
    }

    const bookingId = getBookingId(cancelConfirmWork);
    const payload = buildCancelPayload(
      bookingId,
      cancelConfirmWork.cancelType as CancelReasonType,
      cancelConfirmWork.cancelledReason

    cancelMutation.mutate(
      {
        bookingId: cancelConfirmWork._id,
        cancelReason: cancelConfirmWork.cancelledReason,
        cancelReasonType: cancelConfirmWork.cancelType,
      },
      {
        onSuccess: (data: any) => {
          const booking = data?.booking ?? data;

          emitCancel({
            bookingId: booking._id,
            status: "WORKER_CANCELLED",
          });

          toast.success("Cancelled");
        },
        onSettled: () => setCancelConfirmWork(null),
      }
  
    );

    if (!payload) {
      toast.error("Please enter a cancellation reason");
      return;
    }

    cancelMutation.mutate(payload, {
      onSuccess: (data) => {
        const booking = getBookingFromMutation(data);

        socket.emit("booking.worker.cancelled", {
          bookingId,
          status: "WORKER_CANCELLED",
        });

        if (booking) {
          onCancelSuccess?.(booking);
        }

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

            const updatedStartedAt =
              "startedAt" in updated ? updated.startedAt : undefined;
            const startedAt =
              updated.workStartedAt || updatedStartedAt || new Date().toISOString();
            const updatedWork = {
              ...selectedWork,
              ...updated,
              status: "IN_PROGRESS",
              workStartedAt: startedAt,
              startedAt,
            };

            upsertAssigned(updatedWork);

            socket.emit("booking.worker.started", {
              bookingId: getBookingId(selectedWork),

            emitStart({
              bookingId: updated._id,

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
            const completedWork: DisplayWork = {
              ...selectedWork,
              ...updatedWork,
              status: "WORK_COMPLETED_PENDING" as const,
              workStartedAt: null,
              booking: selectedWork.booking
                ? {
                    ...selectedWork.booking,
                    ...(updatedWork.booking ?? {}),
                    id:
                      selectedWork.booking.id ||
                      selectedWork.booking._id ||
                      selectedWork.id,
                    status: "WORK_COMPLETED_PENDING" as const,
                  }
                : selectedWork.booking,
            };
              
          onSuccess={(data) => {
            emitComplete({
              bookingId: selectedWork._id,
              ...data,
              status: "WORK_COMPLETED_PENDING",
            });


            upsertAssigned(completedWork);

          socket.emit("booking.worker.completed", {
                bookingId: getBookingId(selectedWork),
                status: "WORK_COMPLETED_PENDING",
              });

            onCompleteSuccess?.(completedWork);
          }}
        />
      )}

      {modalType === "verify" && selectedWork && (
        <VerifyOtpModal
          open
          work={selectedWork}
          onClose={closeModal}

          onSuccess={(updatedWork) => {
            socket.emit("booking.worker.verified", {
              bookingId: getBookingId(selectedWork),
              ...updatedWork,

          onSuccess={(data: any) => {
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

        onSubmit={(data: { reason: string }) => {
          if (!disputeWork) return;

          socket.emit("booking.worker.dispute", {
            bookingId: getBookingId(disputeWork),

        onSubmit={(data: any) => {
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
                value={cancelConfirmWork.cancelType || ""}

                onChange={(event) =>
                  setCancelConfirmWork((prev) =>
                    prev
                      ? {
                          ...prev,
                          cancelType: event.target.value,
                          cancelledReason: "",
                        }
                      : prev
                  )

                onChange={(e) =>
                  setCancelConfirmWork((p: any) => ({
                    ...p,
                    cancelType: e.target.value,
                    cancelledReason: "",
                  }))

                }
                className="w-full border p-2 mb-3 rounded"
              >
                <option value="" disabled>
                  Select reason
                </option>

                {CANCEL_REASONS.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}

                <option value="BOOKED_WRONG_SERVICE">Booked wrong service</option>
                <option value="BOOKED_BY_MISTAKE">Booked by mistake</option>
                <option value="SCHEDULE_CHANGED">Schedule changed</option>
                <option value="PRICE_TOO_HIGH">Price too high</option>
                <option value="SERVICE_NO_LONGER_NEEDED">
                  Service no longer needed
                </option>
                <option value="OTHER">Other</option>

              </select>

              {cancelConfirmWork.cancelType && (
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-sm bg-gray-200 rounded-full">
                    {cancelConfirmWork.cancelType.replaceAll("_", " ")}
                  </span>
                </div>
              )}

              <Textarea
                value={cancelConfirmWork.cancelledReason || ""}

                onChange={(event) =>
                  setCancelConfirmWork((prev) =>
                    prev
                      ? {
                          ...prev,
                          cancelledReason: event.target.value,
                        }
                      : prev
                  )

                onChange={(e) =>
                  setCancelConfirmWork((p: any) => ({
                    ...p,
                    cancelledReason: e.target.value,
                  }))

                }
                placeholder="Enter reason..."
                className="w-full border p-2"
              />
            </CommonModal.Body>

            <CommonModal.Footer>

              <Button
                variant="outline"
                onClick={() => setCancelConfirmWork(null)}
              >
                No
              </Button>
              <Button
                onClick={handleCancelYes}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? "Cancelling..." : "Yes"}
              </Button>
        
              <Button onClick={() => setCancelConfirmWork(null)}>No</Button>
              <Button onClick={handleCancelYes}>Yes</Button>

            </CommonModal.Footer>
          </CommonModal.Content>
        </CommonModal>
      )}
    </>
  );
}

function buildCancelPayload(
  bookingId: string,
  cancelReasonType: CancelReasonType,
  cancelReason?: string
): CancelWork | null {
  if (cancelReasonType === "OTHER") {
    const reason = cancelReason?.trim();
    return reason ? { bookingId, cancelReasonType, cancelReason: reason } : null;
  }

  return { bookingId, cancelReasonType };
}

function getBookingFromMutation(data: unknown) {
  if (!data || typeof data !== "object") return null;

  const response = data as { booking?: unknown };
  return (response.booking ?? data) as Parameters<
    NonNullable<WorkModalsProps["onCancelSuccess"]>
  >[0];
}
