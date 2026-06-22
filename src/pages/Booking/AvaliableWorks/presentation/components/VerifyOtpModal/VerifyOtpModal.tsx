"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useVerifyOtp } from "../../hooks/useVeirfyOtp";
// import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import { normalizeAssignedWorks } from "../../helpers/workPresentation.helpers";
import type { DisplayWork } from "../../types/workPresentation.types";
import type { Work } from "../../../domain/entities/work";
// import { ASSIGNED_WORKS_KEY } from "../../hooks/useAssign";
// import { useQueryClient } from "@tanstack/react-query";
// import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import { Input } from "@/components/ui/input";

type Props<TWork extends DisplayWork | Work> = {
  work: TWork;
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedWork: TWork) => void;
};

export default function VerifyOtpModal<TWork extends DisplayWork | Work>({
  work,
  open,
  onClose,
  onSuccess,
}: Props<TWork>) {
  const { t } = useLanguage();
  const [otp, setOtp] = useState("");
  const { mutate, isPending } = useVerifyOtp();
  // const upsertAssigned = useBookingSocketStore((state) => state.upsertAssigned);
//  const removeAssigned = useBookingSocketStore((s) => s.removeAssigned);
// const queryClient = useQueryClient();
  if (!open) return null;

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
  const updatedWork = normalizeAssignedWorks([res?.booking ?? res])[0];

  if (updatedWork) {
    onSuccess(updatedWork as TWork);
  }

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

        <Input
          type="text"
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
          placeholder="Enter OTP"
          className="w-full border rounded-md p-2"
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>

          <Button onClick={handleVerify} disabled={isPending}>
            {isPending ? t("workHistory.actions.verifying") : t("workHistory.actions.verify")}
          </Button>
        </div>
      </div>
    </div>
  );
}
