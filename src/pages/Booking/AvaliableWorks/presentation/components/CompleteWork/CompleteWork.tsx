"use client";

import { useCompleteWork } from "../../hooks/useCompleteWork";
import { Button } from "@/components/ui/button";
import type { CompleteWork as CompleteWorkPayload } from "../../../domain/entities/completework";
import { toast } from "react-toastify";
import {
  elapsedMinutes,
  getBookingId,
} from "../../helpers/workPresentation.helpers";
import type { DisplayWork } from "../../types/workPresentation.types";
import type { Work } from "../../../domain/entities/work";

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

  if (!open) return null;

  const handleConfirmClick = () => {
    const bookingId = getBookingId(work);

    if (!bookingId) {
      toast.error("Booking ID missing");
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
        toast.success("Work Completed Successfully!");
        onClose();
      },

      onError: (err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Failed to complete work";
        toast.error(message);
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Complete Work</h2>

        <div className="space-y-2 text-sm mb-4">
          <p>
            <strong>Service:</strong> {work.service?.name || "N/A"}
          </p>
          <p>
            <strong>Customer:</strong> {work.customer?.fullName || "N/A"}
          </p>
          <p>
            <strong>Worked Time:</strong> {elapsedMinutes(work.elapsedTime)}{" "}
            minutes
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Close
          </Button>
          <Button onClick={handleConfirmClick} disabled={isLoading}>
            {isLoading ? "Completing..." : "Confirm Complete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
