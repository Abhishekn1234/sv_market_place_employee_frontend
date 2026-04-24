"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import type { Work } from "../../../domain/entities/work";
import { useVerifyOtp } from "../../hooks/useVeirfyOtp";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";

type Props = {
  work: Work;
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedWork: Work | Booking) => void;
};

export default function VerifyOtpModal({
  work,
  open,
  onClose,
  onSuccess,
}: Props) {
  const { t } = useLanguage();
  const [otp, setOtp] = useState("");

  const { mutate, isPending } = useVerifyOtp();

  if (!open) return null;

  const { upsertAssigned } = useBookingSocketStore((s) => s);

  const handleVerify = () => {
    if (!otp) return;

    mutate(
      {
        bookingId: work._id,
        otp,
        purpose: "WORK_COMPLETE",
      },
      {
        onSuccess: (res) => {
          const updatedWork = res?.booking ?? res;

          upsertAssigned(updatedWork);
          onSuccess?.(updatedWork);
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 space-y-4">
        <h2 className="text-lg font-semibold">
          {t("workHistory.actions.verifyOtp")}
        </h2>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full border rounded-md p-2"
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleVerify} disabled={isPending}>
            {isPending ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </div>
    </div>
  );
}