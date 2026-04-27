"use client";

import { useState } from "react";
import { useCompleteWork } from "../../hooks/useCompleteWork";
import { Button } from "@/components/ui/button";
import type { Work } from "../../../domain/entities/work";
import type { CompleteWork } from "../../../domain/entities/completework";
import { toast } from "react-toastify";
import { useAssignedEmitter } from "@/core/Websocket/presentation/utils/useAssignemitter";

type Props = {
  work: Work;
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedWork: Work) => void;
};

export default function CompleteWork({
  work,
  open,
  onClose,
  onSuccess,
}: Props) {
  const [actualWorkHours, setActualWorkHours] = useState<number | undefined>();
  const [actualWorkDays, setActualWorkDays] = useState<number | undefined>();
 console.log(actualWorkDays,actualWorkHours,setActualWorkDays,setActualWorkHours);
  const { mutate: completeWorkMutation, isPending: isLoading } =
    useCompleteWork();

  const { emitComplete } = useAssignedEmitter();

  if (!open) return null;

  const handleConfirmClick = () => {
    const bookingId = work._id;

    if (!bookingId) {
      toast.error("Booking ID missing");
      return;
    }

    const payload: CompleteWork = {
      bookingId,
      actualWorkHours,
      actualWorkDays,
    };

    completeWorkMutation(payload, {
      onSuccess: (response) => {
        toast.success("Work Completed Successfully!");

        // ✅ SOCKET EMIT (REAL-TIME UPDATE)
       emitComplete({
                  bookingId,
                  ...response,
                  status: "WORK_COMPLETED_PENDING",
                });

        // ✅ SIMPLE LOCAL UPDATE (NO DUPLICATION BUGS)
        const updatedWork: Work = {
          ...work,
          status: "WORK_COMPLETED_PENDING",
        };

        onSuccess?.(updatedWork);

        onClose();
      },

      onError: (err: any) => {
        toast.error(err?.message || "Failed to complete work");
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
            <strong>Worked Time:</strong>{" "}
            {work.elapsedTime
              ? work.elapsedTime
                  .split(":")
                  .map(Number)
                  .reduce((total, num, idx) => {
                    if (idx === 0) return total + num * 60;
                    if (idx === 1) return total + num;
                    return total + num / 60;
                  }, 0)
                  .toFixed(0)
              : 0}{" "}
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