"use client";

import { useState } from "react";

import StartWork from "@/pages/Booking/AvaliableWorks/presentation/components/StartWork/StartWork";
import CompleteWork from "@/pages/Booking/AvaliableWorks/presentation/components/CompleteWork/CompleteWork";
import VerifyOtpModal from "@/pages/Booking/AvaliableWorks/presentation/components/VerifyOtpModal/VerifyOtpModal";
import DisputeModal from "./DisputeModal/DisputeModal";

import { CommonModal } from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

import {
  getSocket,
  initializeSocket,
} from "@/core/Websocket/presentation/components/socket";

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

  /* ================= SOCKET ================= */
  const socket =
    getSocket("/workers/requests") ||
    initializeSocket("/workers/requests");

  /* ================= STATE ================= */
  const [disputeWork, setDisputeWork] = useState<any>(null);

  /* ================= CANCEL ================= */
  const handleCancelYes = () => {
    cancelMutation.mutate(
      {
        bookingId: cancelConfirmWork.bookingId,
        cancelReason: cancelConfirmWork.cancelledReason,
      },
      {
        onSuccess: (data: any) => {
          const booking = data?.booking ?? data;

          socket.emit("booking.worker.cancelled", {
            bookingId: booking._id,
            status: "WORKER_CANCELLED",
          });

          toast.success("Cancelled");
        },
        onSettled: () => setCancelConfirmWork(null),
      }
    );
  };

  return (
    <>
      {/* ================= START WORK ================= */}
      {modalType === "start" && selectedWork && (
        <StartWork
          open
          work={selectedWork}
          onClose={closeModal}
          onWorkStarted={(updated) => {
            socket.emit("booking.worker.started", {
              bookingId: updated._id,
              status: "IN_PROGRESS",
              startedAt: updated.workStartedAt,
            });
          }}
        />
      )}

      {/* ================= COMPLETE WORK ================= */}
      {modalType === "complete" && selectedWork && (
        <CompleteWork
          work={selectedWork}
          open
          onClose={closeModal}
          onSuccess={(data) => {
            socket.emit("booking.worker.completed", {
              bookingId: selectedWork._id,
              ...data,
              status: "WORK_COMPLETED_PENDING",
            });

            onCompleteSuccess?.(data);
          }}
        />
      )}

      {/* ================= VERIFY OTP ================= */}
      {modalType === "verify" && selectedWork && (
        <VerifyOtpModal
          open
          work={selectedWork}
          onClose={closeModal}
          onSuccess={(data: any) => {
            socket.on("booking.worker.verified", {
              bookingId: selectedWork._id,
              status: "COMPLETED",
              ...data,
            });
          }}
        />
      )}

      {/* ================= DISPUTE MODAL ================= */}
      <DisputeModal
        open={!!disputeWork}
        work={disputeWork}
        onClose={() => setDisputeWork(null)}
        onSubmit={(data: any) => {
          socket.emit("booking.worker.dispute", {
            bookingId: disputeWork._id,
            reason: data.reason,
            status: "DISPUTE_CREATED",
          });

          setDisputeWork(null);
        }}
      />

      {/* ================= CANCEL MODAL ================= */}
      {cancelConfirmWork && (
        <CommonModal open onOpenChange={() => setCancelConfirmWork(null)}>
          <CommonModal.Content>
            <CommonModal.Header>Cancel Work</CommonModal.Header>

            <CommonModal.Body>
              <textarea
                value={cancelConfirmWork.cancelledReason || ""}
                onChange={(e) =>
                  setCancelConfirmWork((p: any) => ({
                    ...p,
                    cancelledReason: e.target.value,
                  }))
                }
                className="w-full border p-2"
              />
            </CommonModal.Body>

            <CommonModal.Footer>
              <Button onClick={() => setCancelConfirmWork(null)}>
                No
              </Button>
              <Button onClick={handleCancelYes}>Yes</Button>
            </CommonModal.Footer>
          </CommonModal.Content>
        </CommonModal>
      )}
    </>
  );
}