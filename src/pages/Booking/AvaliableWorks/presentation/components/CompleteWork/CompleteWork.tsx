"use client";

import { useState } from "react";
import { useCompleteWork } from "../../hooks/useCompleteWork";
import { Button } from "@/components/ui/button";
import type { Work } from "../../../domain/entities/work";
import type { CompleteWork } from "../../../domain/entities/completework";
import { toast } from "react-toastify";



type Props = {
  work: Work;
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedWork: Work) => void;
};

export default function CompleteWork({ work, open, onClose, onSuccess }: Props) {
  const [actualWorkHours, setActualWorkHours] = useState<number | undefined>();
  const [actualWorkDays, setActualWorkDays] = useState<number | undefined>();

  const { mutate: completeWorkMutation, isPending: isLoading } = useCompleteWork();

  if (!open) return null;

  const handleConfirmClick = () => {
    const bookingId = work.bookingId || work.booking?._id;
    if (!bookingId) return;

    const payload: CompleteWork = { bookingId, actualWorkHours, actualWorkDays };

    completeWorkMutation(payload, {
     onSuccess: (updatedBooking) => {
  const updatedWork: Work = {
    ...work,
    status: "WORK_COMPLETED_PENDING",

    // ✅ THIS IS THE FIX
    booking: {
      ...work.booking,
      ...updatedBooking,
      status: "WORK_COMPLETED_PENDING", // 🔥 ADD THIS
    },

    workStartedAt: null,
  };

  onSuccess(updatedWork);
  toast.success("Work Completed Successfully!");
  onClose();
},
      onError: (error) => console.error(error),
    });
  };

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
              ? `${work.booking?.schedule?.estimatedDays ?? "-"} day(s)`
              : "-"}
          </p>
          <p>
              <strong>Worked Time:</strong>{" "}
              {work.elapsedTime
                ? work.elapsedTime
                    .split(":") // ["HH","MM","SS"]
                    .map(Number)
                    .reduce((total, num, idx) => {
                      if (idx === 0) return total + num * 60; // hours → minutes
                      if (idx === 1) return total + num;      // minutes
                      return total + num / 60;                // seconds → minutes fraction
                    }, 0)
                    .toFixed(0) // round to nearest minute
                : 0}{" "}
              minutes
            </p>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Actual Work Hours</label>
            <input
              type="number"
              value={actualWorkHours ?? ""}
              onChange={(e) => setActualWorkHours(Number(e.target.value))}
              className="border p-2 w-full rounded disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              placeholder="Enter hours"
              min={0}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Actual Work Days</label>
            <input
              type="number"
              value={actualWorkDays ?? ""}
              onChange={(e) => setActualWorkDays(Number(e.target.value))}
              className="border p-2 w-full rounded disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              placeholder="Enter days"
              min={0}
              disabled
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Close</Button>
          <Button onClick={handleConfirmClick} disabled={isLoading}>{isLoading ? "Completing..." : "Confirm Complete"}</Button>
        </div>
      </div>
    </div>
  );
}