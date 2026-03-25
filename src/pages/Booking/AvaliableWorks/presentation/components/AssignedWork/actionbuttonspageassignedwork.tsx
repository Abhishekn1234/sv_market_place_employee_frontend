import { Button } from "@/components/ui/button";
import type { Work } from "../../../domain/entities/work";
import { Loader2 } from "lucide-react";




type ActionButtonsProps = {
  work: Work;
  cancellingId: string | null;
  isCancelling: boolean;
  handleCancel: (id?: string) => void;
  handleStartWork: (work: Work) => void;
  dark: boolean;
  navigate: (path: string) => void;
  onClose: () => void;
};

export const ActionButtons = ({
  work,
  cancellingId,
  isCancelling,
  handleCancel,
  handleStartWork,
  dark,
  navigate,
  onClose,
}: ActionButtonsProps) => {
  const statusLower = work.status?.toLowerCase();
  const bookingId = work.booking?._id;

  return (
    <div className="flex justify-end gap-3">
      {(statusLower === "in_progress" || statusLower === "started") && (
        <Button
          onClick={() => {
            navigate("/availableWork");
            onClose();
          }}
          className={`${
            dark
              ? "px-5 py-2 bg-green-600 text-gray-100 rounded-xl font-medium"
              : "px-5 py-2 bg-green-600 text-white rounded-xl font-medium"
          }`}
        >
          Check Work
        </Button>
      )}

      {statusLower !== "completed" && statusLower !== "in_progress" && statusLower !== "started" && (
        <Button
          onClick={() => handleCancel(bookingId)}
          disabled={isCancelling && cancellingId === bookingId}
          className={`${
            dark
              ? "px-5 py-2 bg-red-200 rounded-xl font-medium disabled:opacity-60 flex items-center gap-2"
              : "px-5 py-2 bg-red-900 rounded-xl font-medium disabled:opacity-60 flex items-center gap-2"
          }`}
        >
          {isCancelling && cancellingId === bookingId && <Loader2 className="h-4 w-4 animate-spin" />}
          Cancel Booking
        </Button>
      )}

      {(statusLower === "worker_accepted" || statusLower === "assigned") && (
        <Button
          onClick={() => handleStartWork(work)}
          className={`${
            dark
              ? "px-5 py-2 bg-blue-600 text-gray-100 rounded-xl font-medium"
              : "px-5 py-2 bg-blue-600 text-white rounded-xl font-medium"
          }`}
        >
          Start Work
        </Button>
      )}
    </div>
  );
};
