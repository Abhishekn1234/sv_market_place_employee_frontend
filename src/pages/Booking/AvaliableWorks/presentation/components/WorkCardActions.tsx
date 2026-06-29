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
  onVerify: (work: DisplayWork) => void;
}

function canStartOrCancel(work: DisplayWork) {
  return ["ASSIGNED", "WORKER_ACCEPTED"].includes(work.status);
}

function isActiveWork(work: DisplayWork) {
  return ["STARTED", "IN_PROGRESS"].includes(work.status);
}

export default function WorkCardActions({
  work, id, timers, t, onStart, onComplete, onCancel, onVerify,
}: Props) {
  const navigate = useNavigate();

  return (
    <>
      {/* TIMER */}
      {isActiveWork(work) && timers[id] && (
        <div className="mx-4 mb-3 flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-300">
          <Timer size={14} />
          {timers[id]}
        </div>
      )}

      {/* ACTIONS */}
      <div className="mt-auto grid grid-cols-1 gap-2 border-t bg-slate-50/60 px-4 py-3 dark:bg-slate-950/20 sm:grid-cols-3">
        {canStartOrCancel(work) && (
          <>
            <Button size="sm" onClick={() => onStart(work)} className="h-9 w-full text-xs font-semibold">
              {t("common.start")}
            </Button>

            <Button size="sm" variant="destructive" onClick={() => onCancel(work)} className="h-9 w-full text-xs font-semibold">
              {t("common.cancel")}
            </Button>

            <Button
              size="sm"
              onClick={() => navigate(`/chat/${work.bookingId}`)}
              className="flex h-9 w-full items-center justify-center gap-2 text-xs font-semibold"
            >
              <MessageCircle size={14} />
              {t("common.chat")}
            </Button>
          </>
        )}

        {isActiveWork(work) && (
          <div className="flex flex-col gap-2 sm:col-span-3 sm:flex-row">
            <Button
              size="sm"
              className="h-9 flex-1 text-xs font-semibold"
              onClick={() => onComplete({ ...work, elapsedTime: timers[id] || "00:00:00" })}
            >
              {t("common.complete")}
            </Button>

            <Button
              size="sm"
              onClick={() => navigate(`/chat/${work.bookingId}`)}
              className="flex h-9 flex-1 items-center gap-2 text-xs font-semibold"
            >
              <MessageCircle size={14} />
              {t("common.chat")}
            </Button>
          </div>
        )}

        {work.status === "WORK_COMPLETED_PENDING" && (
          <Button
            size="sm"
            className="h-9 w-full text-xs font-semibold sm:col-span-3"
            onClick={() => onVerify(work)}
          >
            {t("availableWork.verifyOtp")}
          </Button>
        )}
      </div>
    </>
  );
}
