"use client";

import { useState } from "react";
import { CommonModal } from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStartWork } from "../../hooks/useStartWork";
import { toast } from "react-toastify";
import type { DisplayWork } from "../../types/workPresentation.types";
import type { Work } from "../../../domain/entities/work";

import {
  getSocket,
  initializeSocket,
} from "@/core/Websocket/presentation/components/socket";
import { getBookingId } from "../../utils/workPresentation.helpers";
import { useLanguage } from "@/context/presentation/components/LanguageContext";

type Props = {
  work: DisplayWork | Work;
  open: boolean;
  onClose: () => void;
  onWorkStarted?: (updatedWork: DisplayWork | Work) => void;
};

export default function StartWork({
  work,
  open,
  onClose,
  onWorkStarted,
}: Props) {
  const [otp, setOtp] = useState("");
  const { translations } = useLanguage();

  const startWorkMutation = useStartWork();

  const handleConfirm = () => {
    const otpStr = otp.toString();

    if (otpStr.length !== 6) {
      toast.error(translations.startWork.invalidOtp);
      return;
    }

    const bookingId = getBookingId(work);

    if (!bookingId) {
      toast.error(translations.startWork.bookingIdMissing);
      return;
    }

    startWorkMutation.mutate(
      { bookingId, otp: otpStr },
      {
        onSuccess: (data: any) => {
          toast.success(translations.startWork.success);

          const socket =
            getSocket("/workers/assigned-updates") ||
            initializeSocket("/workers/assigned-updates");

          socket.emit("booking.worker.started", {
            bookingId,
            status: "IN_PROGRESS",
            startedAt: data?.startedAt || new Date().toISOString(),
          });

          const updatedWork = {
            ...work,
            status: "IN_PROGRESS" as const,
            workStartedAt:
              data?.startedAt || new Date().toISOString(),
          };

          onWorkStarted?.(updatedWork);
          onClose();
        },

        onError: (err: any) => {
          toast.error(
            err?.message || translations.startWork.failed
          );
        },
      }
    );
  };

  return (
    <CommonModal open={open} onOpenChange={onClose}>
      <CommonModal.Content>
        <CommonModal.Header>
          <h3 className="text-lg font-semibold">
            {translations.startWork.title}
          </h3>
        </CommonModal.Header>

        <CommonModal.Body className="space-y-4">
          <p>
            {translations.startWork.description}{" "}
            <strong>
              {work.customer?.fullName || "Customer"}
            </strong>
          </p>

          <div className="flex justify-center">
            <Input
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              placeholder={translations.startWork.placeholder}
              maxLength={6}
              className="text-center w-32 tracking-widest text-lg"
            />
          </div>
        </CommonModal.Body>

        <CommonModal.Footer>
          <Button variant="outline" onClick={onClose}>
            {translations.startWork.cancel}
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={
              otp.length !== 6 ||
              startWorkMutation.isPending
            }
          >
            {startWorkMutation.isPending
              ? translations.startWork.starting
              : translations.startWork.confirm}
          </Button>
        </CommonModal.Footer>
      </CommonModal.Content>
    </CommonModal>
  );
}