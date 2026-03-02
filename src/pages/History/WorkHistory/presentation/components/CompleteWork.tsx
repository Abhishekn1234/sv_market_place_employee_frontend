"use client";

import { useState } from "react";
import { useCompleteWork } from "../hooks/useCompleteWork";
import { Button } from "@/components/ui/button";
import type { Work } from "../../domain/entities/workhistory";
import type { CompleteWork } from "../../domain/entities/completework";

type Props = {
  work: Work;
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedWork: Work) => void; // new prop to update table
};

export default function CompleteWork({ work, open, onClose, onSuccess }: Props) {
  const [actualWorkHours, setActualWorkHours] = useState<number | undefined>();
  const [actualWorkDays, setActualWorkDays] = useState<number | undefined>();

  const { mutate: completeWorkMutation, isPending: isLoading } = useCompleteWork();

  if (!open) return null;

  const handleConfirmClick = () => {
    if (!work.booking.id) return;

    const payload: CompleteWork = {
      bookingId: work.booking.id,
      actualWorkHours,
      actualWorkDays,
    };

    completeWorkMutation(payload, {
      onSuccess: (updatedBooking) => {
        // Update the table row
        onSuccess({
          ...work,
          status: "completed",
          booking: { ...work.booking, ...updatedBooking },
        });

        onClose();
      },
    });
  };

  const assignedTime = work.assignedAt ? new Date(work.assignedAt).getTime() : 0;
  const now = Date.now();
  const workedMinutes = assignedTime ? Math.floor((now - assignedTime) / 1000 / 60) : 0;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Complete Work</h2>

        <div className="space-y-2 text-sm mb-4">
          <p><strong>Service:</strong> {work.service?.name || "N/A"}</p>
          <p><strong>Customer:</strong> {work.customer?.fullName || "N/A"}</p>
          <p><strong>Scheduled Duration:</strong> {work.booking?.duration || 1} hour(s)</p>
          <p><strong>Worked Time:</strong> {workedMinutes} minutes</p>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Actual Work Hours</label>
            <input
              type="number"
              value={actualWorkHours ?? ""}
              onChange={(e) => setActualWorkHours(Number(e.target.value))}
              className="border p-2 w-full rounded"
              placeholder="Enter hours"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Actual Work Days</label>
            <input
              type="number"
              value={actualWorkDays ?? ""}
              onChange={(e) => setActualWorkDays(Number(e.target.value))}
              className="border p-2 w-full rounded"
              placeholder="Enter days"
              min={0}
            />
          </div>
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