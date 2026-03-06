"use client";

import { useState } from "react";
import { useCompleteWork } from "../hooks/useCompleteWork";
import { Button } from "@/components/ui/button";
import type { Work } from "../../domain/entities/workhistory";
import type { CompleteWork } from "../../domain/entities/completework";
import { toast } from "react-toastify";
import type { WorkStatus } from "../../domain/entities/workstatus";

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
  const bookingId = work.bookingId || work.booking?._id;
  if (!bookingId) {
    console.log("No booking ID found. Aborting...");
    return;
  }

  console.log("Booking ID to complete:", bookingId);
  console.log("Work Object:", work);
  console.log("Actual Work Hours:", actualWorkHours);
  console.log("Actual Work Days:", actualWorkDays);

  const payload: CompleteWork = {
    bookingId,
    actualWorkHours,
    actualWorkDays,
  };

  console.log("Payload to send:", payload);

  completeWorkMutation(payload, {
    onSuccess: (updatedBooking) => {
      console.log("Updated Booking:", updatedBooking);

     const updatedWork: Work = {
  ...work,
  status: "WORK_COMPLETED_PENDING" as WorkStatus,
  booking: { ...work.booking, ...updatedBooking },
};

      console.log("Updated Work Object:", updatedWork);

      onSuccess(updatedWork);
      toast.success("Work Completed Successfully!");
      onClose();
    },
    onError: (error) => {
      console.error("Mutation Failed:", error);
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
          <p>
          <strong>Scheduled Duration:</strong>{" "}
          {work.booking.pricingMode === "HOURLY"
            ? `${work.booking?.schedule?.estimatedHours ?? "-"} hour(s)`
            : work.booking.pricingMode === "PER_DAY"
            ? `${work.booking?.schedule?.estimatedHours ?? "-"} day(s)`
            : "-"}
        </p>
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