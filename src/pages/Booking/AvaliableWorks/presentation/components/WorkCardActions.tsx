import { Button } from "@/components/ui/button";
import { MessageCircle, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { DisplayWork } from "../types/workPresentation.types";

interface Props {
  work: DisplayWork;
  id: string;
  timers: Record<string, string>;
  t: (key: string) => string;
  onStart: (work: DisplayWork) => void;
  onComplete: (work: DisplayWork & { elapsedTime: string }) => void;
  onCancel: (work: DisplayWork) => void;
  bookingStatus?: string;
  onConfirmCashPayment: (work: DisplayWork) => void;
  canConfirmCashPayment?: boolean;
  onVerify: (work: DisplayWork) => void;
}

function canStartOrCancel(work: DisplayWork) {
  return ["ASSIGNED", "WORKER_ACCEPTED"].includes(work?.booking?.status ??"");
}

function isActiveWork(work: DisplayWork) {
  return ["STARTED", "IN_PROGRESS"].includes(work?.booking?.status??"");
}

export default function WorkCardActions({
  work, id, timers, t, onStart, onComplete, onCancel, onVerify,
  onConfirmCashPayment,
  canConfirmCashPayment = false,
}: Props) {
  const navigate = useNavigate();
 

  return (
    <>
      {/* TIMER */}
      {isActiveWork(work) && timers[id] && (
        <div className="mx-3.5 mb-2.5 flex items-center justify-center gap-1.5 rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-300">
          <Timer size={13} />
          {timers[id]}
        </div>
      )}

      {/* ACTIONS */}
      <div className="mt-auto border-t bg-slate-50/60 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-950/20">
        {canStartOrCancel(work) && (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => onStart(work)}
              className="h-8 min-w-[72px] flex-1 text-xs font-semibold"
            >
              {t("common.start")}
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => onCancel(work)}
              className="h-8 min-w-[72px] flex-1 text-xs font-semibold"
            >
              {t("common.cancel")}
            </Button>

            <Button
              size="sm"
              onClick={() => navigate(`/chat/${work.bookingId}`)}
              className="flex h-8 min-w-[72px] flex-1 items-center justify-center gap-1.5 text-xs font-semibold"
            >
              <MessageCircle size={13} />
              {t("common.chat")}
            </Button>
          </div>
        )}

        {isActiveWork(work) && (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              className="h-8 min-w-[100px] flex-1 text-xs font-semibold"
              onClick={() => onComplete({ ...work, elapsedTime: timers[id] || "00:00:00" })}
            >
              {t("common.complete")}
            </Button>

            <Button
              size="sm"
              onClick={() => navigate(`/chat/${work.bookingId}`)}
              className="flex h-8 min-w-[100px] flex-1 items-center justify-center gap-1.5 text-xs font-semibold"
            >
              <MessageCircle size={13} />
              {t("common.chat")}
            </Button>
          </div>
        )}

        {work.booking?.status === "WORK_COMPLETED_PENDING" && (
          <Button
            size="sm"
            className="h-8 w-full text-xs font-semibold"
            onClick={() => onVerify(work)}
          >
            {t("availableWork.verifyOtp")}
          </Button>
        )}

        {canConfirmCashPayment && (
          <Button
            size="sm"
            className="mt-2 w-full"
            onClick={() => onConfirmCashPayment(work)}
          >
            {t("availableWork.confirmCashPayment")}
          </Button>
        )}
      </div>
    </>
  );
}