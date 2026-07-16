"use client";

import { useCompleteWork } from "../../hooks/useCompleteWork";
import { Button } from "@/components/ui/button";
import type { CompleteWork as CompleteWorkPayload } from "../../../domain/entities/completework";
import { toast } from "react-toastify";
import {
  elapsedMinutes,
  getBookingId,
} from "../../utils/workPresentation.helpers";
import type { DisplayWork } from "../../../domain/entities/workPresentation.types";
import type { Work } from "../../../domain/entities/work";
import CommonSpinner from "@/components/common/CommonSpinner";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { CommonModal } from "@/components/common/CommonModal";

type Props<TWork extends DisplayWork | Work> = {
  work: TWork;
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedWork: TWork) => void;
};

export default function CompleteWork<TWork extends DisplayWork | Work>({
  work,
  open,
  onClose,
  onSuccess,
}: Props<TWork>) {
  const { mutate: completeWorkMutation, isPending: isLoading } =
    useCompleteWork();
  const { t } = useLanguage();

  const handleConfirmClick = () => {
    const bookingId = getBookingId(work);

    if (!bookingId) {
      toast.error(t("completeWork.errorBookingId"));
      return;
    }

    const payload: CompleteWorkPayload = {
      bookingId,
    };

    completeWorkMutation(payload, {
      onSuccess: (updatedBooking) => {
        const updatedWork = {
          ...work,
          status: "WORK_COMPLETED_PENDING" as const,
          booking: {
            ...(work.booking ?? {}),
            ...(updatedBooking ?? {}),
            status: "WORK_COMPLETED_PENDING" as const,
          },
          workStartedAt: null,
        } as TWork;

        onSuccess(updatedWork);
        onClose();
      },

      onError: (err: unknown) => {
        const message =
          err instanceof Error ? err.message : t("completeWork.errorFailed");
        toast.error(message);
      },
    });
  };

return (
  <CommonModal open={open} onOpenChange={onClose}>
    <CommonModal.Content className="max-w-md">
      
      {/* 1. Header Sub-component: Handles Title & Radix Close Button automatically */}
      <CommonModal.Header>
        <CommonModal.Title>
          {t("completeWork.title")}
        </CommonModal.Title>
      </CommonModal.Header>

      {/* 2. Body Sub-component: Handles padding and text formatting */}
      <CommonModal.Body className="space-y-2 text-sm">
        <p className="break-words">
          <strong>{t("completeWork.service")}:</strong>{" "}
          {work.service?.name || t("common.na")}
        </p>

        <p className="break-words">
          <strong>{t("completeWork.customer")}:</strong>{" "}
          {work.customer?.fullName || t("common.na")}
        </p>

        <p className="break-words">
          <strong>{t("completeWork.workedTime")}:</strong>{" "}
          {elapsedMinutes(work.elapsedTime)} {t("common.minutes")}
        </p>
      </CommonModal.Body>

      {/* 3. Footer Sub-component: Aligns buttons cleanly on the right via its built-in classes */}
      <CommonModal.Footer>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="w-full sm:w-auto" // Keeps full-width on mobile stack, auto on desktop
        >
          {t("common.close")}
        </Button>

        <Button
          onClick={handleConfirmClick}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? <CommonSpinner size="sm" /> : t("completeWork.confirm")}
        </Button>
      </CommonModal.Footer>

    </CommonModal.Content>
  </CommonModal>
);
}