"use client";

import { useCompleteWork } from "../../hooks/useCompleteWork";
import { Button } from "@/components/ui/button";
import type { CompleteWork as CompleteWorkPayload } from "../../../domain/entities/completework";
import { toast } from "react-toastify";
import {
  elapsedMinutes,
  getBookingId,
} from "../../utils/workPresentation.helpers";
import type { DisplayWork } from "../../types/workPresentation.types";
import type { Work } from "../../../domain/entities/work";
import CommonSpinner from "@/components/common/CommonSpinner";
import { useLanguage } from "@/context/presentation/components/LanguageContext";


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

  if (!open) return null;

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
        // toast.success(t("completeWork.success"));
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">{t("completeWork.title")}</h2>

        <div className="space-y-2 text-sm mb-4">
          <p>
            <strong>{t("completeWork.service")}:</strong> {work.service?.name || t("common.na")}
          </p>
          <p>
            <strong>{t("completeWork.customer")}:</strong> {work.customer?.fullName || t("common.na")}
          </p>
          <p>
            <strong>{t("completeWork.workedTime")}:</strong> {elapsedMinutes(work.elapsedTime)}{" "}
            {t("common.minutes")}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t("common.close")}
          </Button>
          <Button onClick={handleConfirmClick} disabled={isLoading}>
          
           {isLoading ? <CommonSpinner size="sm" /> : t("completeWork.confirm")}

          </Button>
        </div>
      </div>
    </div>
  );
}
