import { AlertCircle, CheckCircle2, PlayCircle, XCircle } from "lucide-react";
import type { Work } from "../../domain/entities/workhistory";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";

    case "inProgress":
      return "bg-blue-100 text-blue-700 border-blue-200";

    case "assigned":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";

    case "workAccepted":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";

    case "workCancelled":
      return "bg-red-100 text-red-700 border-red-200";

    case "workCompletedPending": // ✅ lowercase w
      return "bg-blue-100 text-blue-700 border-blue-200";

    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-4 h-4" />;

    case "inProgress":
      return <PlayCircle className="w-4 h-4" />;

    case "assigned":
      return <AlertCircle className="w-4 h-4" />;

    case "workAccepted":
      return <CheckCircle2 className="w-4 h-4" />;

    case "workCancelled":
      return <XCircle className="w-4 h-4" />;

    case "workCompletedPending": // ✅ lowercase w
      return <CheckCircle2 className="w-4 h-4" />;

    default:
      return null;
  }
};

export const getNormalizedStatus = (w: Work): string => {
  const rawStatus = (w.booking?.status || w.status || "").trim().toUpperCase();

  switch (rawStatus) {
    case "WORK_COMPLETED_PENDING":
      return "workCompletedPending";

    case "WORKER_ACCEPTED":
      return "workAccepted";

    case "WORK_CANCELLED":
      return "workCancelled";

    case "IN_PROGRESS":
      return "inProgress";

    case "COMPLETED":
      return "completed";

    case "ASSIGNED":
      return "assigned";

    default:
      return rawStatus.toLowerCase();
  }
};