"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useVerifyOtp } from "../../hooks/useVerifyOtp";
import { getBookingId } from "../../utils/workPresentation.helpers";
import type { DisplayWork } from "../../../domain/entities/workPresentation.types";
import type { Work } from "../../../domain/entities/work";
import { Input } from "@/components/ui/input";
import { CommonModal } from "@/components/common/CommonModal";

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

  const handleVerify = () => {
  const bookingId = getBookingId(work);

  if (!bookingId || !otp) return;

  mutate(
    {
      bookingId,
      otp,
      purpose: "WORK_COMPLETE",
    },
    {
     onSuccess: (res) => {
  const updatedWork = (res?.booking ?? res) as TWork;

  onSuccess(updatedWork);

  setOtp("");
  onClose();
},
    }
  );
};

  return (
    <CommonModal open={open} onOpenChange={onClose}>
      <CommonModal.Content className="max-w-sm">
        
        {/* Header - Renders Title & Close 'X' button */}
        <CommonModal.Header>
          <CommonModal.Title>
            {t("workHistory.actions.verifyOtp")}
          </CommonModal.Title>
        </CommonModal.Header>

        {/* Body - Contains inputs and fields */}
        <CommonModal.Body className="space-y-4">
          <Input
            type="text"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            placeholder="Enter OTP"
            className="w-full"
            
          />
        </CommonModal.Body>

        {/* Footer - Automatically structures buttons on mobile vs desktop */}
        <CommonModal.Footer>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            {t("common.cancel")}
          </Button>

          <Button 
            onClick={handleVerify} 
            disabled={isPending || !otp}
            className="w-full sm:w-auto"
          >
            {isPending ? t("workHistory.actions.verifying") : t("workHistory.actions.verify")}
          </Button>
        </CommonModal.Footer>

      </CommonModal.Content>
    </CommonModal>
  );
}