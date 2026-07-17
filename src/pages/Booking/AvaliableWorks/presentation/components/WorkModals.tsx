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
import { getBookingId } from "../utils/workPresentation.helpers";

import type {
  DisplayWork,
  WorkModalsProps,
} from "../../domain/entities/workPresentation.types";
import type { Dispute } from "@/pages/History/BookingHistory/domain/entities/disputes";
import type { CancelReasonType, CancelWork } from "../../domain/entities/cancelwork";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useQueryClient } from "@tanstack/react-query";
import BookingConfirmCashPayment from "./BookingConfirmCashPayment/BookingConfirmCashPayment";

export default function WorkModals({
  selectedWork,
  modalType,
  closeModal,
  cancelConfirmWork,
  setCancelConfirmWork,
  cancelMutation,
  onCancelSuccess,
  onCompleteSuccess,
  onUpsertWork,
  onRemoveWork,
}: WorkModalsProps) {
  const { emitStart, emitComplete, emitVerify, emitCancel, emitDispute } =
    useAssignedEmitter();

  const [disputeWork, setDisputeWork] = useState<DisplayWork | null>(null);
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const handleCancel = () => {
    if (!cancelConfirmWork) return;

    const bookingId = getBookingId(cancelConfirmWork);

    const type: CancelReasonType | undefined = cancelConfirmWork.cancelType;

    if (!type) {
      toast.error(t("cancelBooking.errorSelectReason"));
      return;
    }

    if (type === "OTHER" && !cancelConfirmWork.cancelledReason) {
      toast.error(t("cancelBooking.errorEnterReason"));
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
      onSuccess: (_data: any) => {
        const bookingId = getBookingId(cancelConfirmWork);

        // ✅ Remove straight from the page's own live state — instant, no store hop.
        onRemoveWork?.(bookingId);

        emitCancel({
          bookingId,
          status: "WORKER_CANCELLED",
        });
        onCancelSuccess?.(_data?.booking || _data);
        queryClient.setQueryData(["assigned-works"], (old: any[] = []) =>
          old.filter((b) => (b.booking?._id || b._id) !== bookingId)
        );
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

            // ✅ Write the timestamp under BOTH `startedAt` (top level, matches
            // what the server/socket payloads use) AND nested under
            // `booking.startedAt` (matches how hydrated API items store it),
            // plus `workStartedAt` for backwards-compat with any other code
            // still reading that field. The page's resolveStartedAt() checks
            // all of these, in this order, so the timer starts instantly
            // regardless of which one ends up populated after a later socket
            // merge overwrites part of this object.
            onUpsertWork?.({
              ...selectedWork,
              ...updated,
              _id: bookingId,
              bookingId,
              status: "IN_PROGRESS",
              startedAt,
              workStartedAt: startedAt,
              booking: {
                ...(selectedWork as any).booking,
                ...(updated as any)?.booking,
                status: "IN_PROGRESS",
                startedAt,
              },
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

            onUpsertWork?.({
              ...selectedWork,
              ...updatedWork,
              _id: bookingId,
              bookingId,
              status: "WORK_COMPLETED_PENDING",
              // Clear every timestamp variant so the timer stops and doesn't
              // briefly flash a stale elapsed time before the card re-renders
              // into its "verify OTP" state.
              startedAt: null,
              workStartedAt: null,
              booking: {
                ...(selectedWork as any).booking,
                ...(updatedWork as any)?.booking,
                status: "WORK_COMPLETED_PENDING",
                startedAt: null,
              },
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
          onSuccess={(updatedWork) => {
            const bookingId = getBookingId(selectedWork);

            // ✅ Remove the work from the page's live state right away.
            onRemoveWork?.(bookingId);

            // Keep API cache in sync too, for any consumer reading it directly.
            queryClient.setQueryData(["assigned-works"], (old: any[] = []) =>
              old.filter((b) => (b.booking?._id || b._id) !== bookingId)
            );

            emitVerify({
              bookingId,
              status: "COMPLETED",
            });

            onCompleteSuccess?.(updatedWork);
          }}
        />
      )}

      <DisputeModal
        open={!!disputeWork}
        work={disputeWork}
        onClose={() => setDisputeWork(null)}
        onSubmit={(data: Dispute) => {
          if (!disputeWork) return;

          emitDispute({
            bookingId: disputeWork._id,
            reason: data.reason,
            status: "DISPUTE_CREATED",
          });

          setDisputeWork(null);
        }}
      />

      {modalType === "confirmCashPayment" && selectedWork && (
        <BookingConfirmCashPayment
          open
          work={selectedWork}
          onOpenChange={(open) => {
            if (!open) closeModal();
          }}
        />
      )}

      {cancelConfirmWork && (
        <CommonModal open onOpenChange={() => setCancelConfirmWork(null)}>
          <CommonModal.Content>
            <CommonModal.Header>{t("cancelBooking.title")}</CommonModal.Header>

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
                <option value="">{t("cancelBooking.selectReason")}</option>

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
              <Button variant="outline" onClick={() => setCancelConfirmWork(null)}>
                {t("cancelBooking.no")}
              </Button>

              <Button onClick={handleCancel}>{t("cancelBooking.yes")}</Button>
            </CommonModal.Footer>
          </CommonModal.Content>
        </CommonModal>
      )}
    </>
  );
}