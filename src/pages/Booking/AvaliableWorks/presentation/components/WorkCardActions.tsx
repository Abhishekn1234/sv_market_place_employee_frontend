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
        <div className="flex items-center gap-1 text-green-700 text-[13px] font-medium">
          <Timer size={12} />
          {timers[id]}
        </div>
      )}

      {/* ACTIONS */}
      <div className="p-2 border-t grid grid-cols-3 gap-1">
        {canStartOrCancel(work) && (
          <>
            <Button size="sm" onClick={() => onStart(work)} className="h-7 w-full text-[13px]">
              {t("common.start")}
            </Button>

            <Button size="sm" variant="destructive" onClick={() => onCancel(work)} className="h-7 w-full text-[13px]">
              {t("common.cancel")}
            </Button>

            <Button
              size="sm"
              onClick={() => navigate(`/chat/${work.bookingId}`)}
              className="h-7 w-full text-[13px] flex items-center justify-center gap-1"
            >
              <MessageCircle size={14} />
              {t("common.chat")}
            </Button>
          </>
        )}

        {isActiveWork(work) && (
          <div className="flex gap-3 col-span-3">
            <Button
              size="sm"
              className="h-7 text-[13px]"
              onClick={() => onComplete({ ...work, elapsedTime: timers[id] || "00:00:00" })}
            >
              {t("common.complete")}
            </Button>

            <Button
              size="sm"
              onClick={() => navigate(`/chat/${work.bookingId}`)}
              className="h-7 text-[13px] flex items-center gap-1"
            >
              <MessageCircle size={14} />
              {t("common.chat")}
            </Button>
          </div>
        )}

        {work.status === "WORK_COMPLETED_PENDING" && (
          <Button
            size="sm"
            className="h-7 w-full text-[13px] col-span-3"
            onClick={() => onVerify(work)}
          >
            {t("availableWork.verifyOtp")}
          </Button>
        )}
      </div>
    </>
  );
}