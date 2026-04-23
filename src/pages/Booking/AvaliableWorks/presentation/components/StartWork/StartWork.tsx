"use client";

import { useState } from "react";
import { CommonModal } from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Work } from "../../../domain/entities/work";
import { useStartWork } from "../../hooks/useStartWork";
import { toast } from "react-toastify";

import { getSocket, initializeSocket } from "@/core/Websocket/presentation/components/socket";

type Props = {
  work: Work;
  open: boolean;
  onClose: () => void;
  onWorkStarted?: (updatedWork: any) => void;
};

export default function StartWork({
  work,
  open,
  onClose,
  onWorkStarted,
}: Props) {
  const [otp, setOtp] = useState("");

  const startWorkMutation = useStartWork();

  const handleConfirm = () => {
    const otpStr = otp.toString();

    if (otpStr.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    const bookingId = work.bookingId || work.booking?._id || work._id;

    if (!bookingId) {
      alert("Booking ID not found");
      return;
    }

    startWorkMutation.mutate(
      { bookingId, otp: otpStr },
      {
        onSuccess: (data: any) => {
          toast.success("Work Started");

          const socket =
            getSocket("/workers/requests") ||
            initializeSocket("/workers/requests");

          // 🔥 EMIT SOCKET EVENT (THIS IS KEY)
          socket.emit("booking.worker.started", {
            bookingId,
            status: "IN_PROGRESS",
            startedAt: data?.startedAt || new Date().toISOString(),
          });

          const updatedWork = {
            ...work,
            status: "IN_PROGRESS",
            workStartedAt: data?.startedAt || new Date().toISOString(),
          };

          onWorkStarted?.(updatedWork);
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
            Enter the 6-digit OTP to start work for{" "}
            <strong>{work.customer?.fullName || "Customer"}</strong>
          </p>

          <div className="flex justify-center">
            <Input
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter OTP"
              maxLength={6}
              className="text-center w-32 tracking-widest text-lg"
            />
          </div>
        </CommonModal.Body>

        <CommonModal.Footer>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
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