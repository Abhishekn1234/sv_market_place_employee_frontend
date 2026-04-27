"use client";

import { useState } from "react";

import StartWork from "@/pages/Booking/AvaliableWorks/presentation/components/StartWork/StartWork";
import CompleteWork from "@/pages/Booking/AvaliableWorks/presentation/components/CompleteWork/CompleteWork";
import VerifyOtpModal from "@/pages/Booking/AvaliableWorks/presentation/components/VerifyOtpModal/VerifyOtpModal";
import DisputeModal from "./DisputeModal/DisputeModal";

import { CommonModal } from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
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

  /* ================= STATE ================= */
  const [disputeWork, setDisputeWork] = useState<any>(null);

  /* ================= CANCEL ================= */
  const handleCancelYes = () => {
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
            emitStart({
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
            emitComplete({
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
            emitVerify({
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
          emitDispute({
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
              <select
                value={cancelConfirmWork.cancelType || ""}
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
              <Button onClick={() => setCancelConfirmWork(null)}>No</Button>
              <Button onClick={handleCancelYes}>Yes</Button>
            </CommonModal.Footer>
          </CommonModal.Content>
        </CommonModal>
      )}
    </>
  );
}