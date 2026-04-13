"use client";

import { useState } from "react";
import { CommonModal } from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Work } from "../../../domain/entities/work";
import { useStartWork } from "../../hooks/useStartWork";
import { toast } from "react-toastify";

type Props = {
  work: Work;
  open: boolean;
  onClose: () => void;
   onWorkStarted?: (updatedWork: any) => void;
};

export default function StartWork({ work, open, onClose,onWorkStarted }: Props) {
  const [otp, setOtp] = useState("");
  const startWorkMutation = useStartWork();

 const handleConfirm = () => {
  const otpStr = otp.toString();

  if (otpStr.length !== 6) {
    alert("Please enter a valid 6-digit OTP");
    return;
  }

  if (!work.bookingId) {
    alert("Booking ID not found");
    return;
  }

  startWorkMutation.mutate(
    {
      bookingId: work.bookingId,
      otp: otpStr,
    },
    {
      onSuccess: (data) => {
        toast.success("Work Started");

        // ✅ Send correct updated work
        onWorkStarted?.({
              ...work,
              status: "IN_PROGRESS",
              workStartedAt: data?.startedAt,
              booking: {
                ...work.booking,
                status: "IN_PROGRESS", // 🔥 CRITICAL
              },
            });

        onClose();
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to start work");
      },
    }
  );
};

  return (
    <CommonModal open={open} onOpenChange={onClose}>
      <CommonModal.Content>
        <CommonModal.Header>
          <h3 className="text-lg font-semibold">Confirm Start Work</h3>
        </CommonModal.Header>

        <CommonModal.Body className="space-y-4">
          <p>
            Enter the 6-digit OTP to start the work for{" "}
            <strong>{work.customer?.fullName || "Customer"}</strong> on{" "}
            <strong>{work.service?.name || "Service"}</strong>.
          </p>

          <div className="flex justify-center">
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter OTP"
              maxLength={6}
              className="text-center w-32 tracking-widest text-lg"
            />
          </div>
        </CommonModal.Body>

        <CommonModal.Footer>
        <Button
            variant="outline"
            onClick={() => {
              
              onWorkStarted?.({
                ...work,
                status: "WORKER_ACCEPTED",
                workStartedAt: null,
                booking: {
                  ...work.booking,
                  status: "WORKER_ACCEPTED",
                },
              });

              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={otp.length !== 6 || startWorkMutation.isPending}
          >
            {startWorkMutation.isPending ? "Starting..." : "Confirm"}
          </Button>
        </CommonModal.Footer>
      </CommonModal.Content>
    </CommonModal>
  );
}