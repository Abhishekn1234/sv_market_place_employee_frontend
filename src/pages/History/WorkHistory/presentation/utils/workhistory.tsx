import { AlertCircle, Calendar, CheckCircle2, PlayCircle } from "lucide-react";
import type { WorkStatus } from "../../domain/entities/workstatus";

export const getStatusColor = (status: WorkStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "in-progress":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "upcoming":
      return "bg-purple-100 text-purple-700 border-purple-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export const getStatusIcon = (status: WorkStatus) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-4 h-4" />;
    case "in-progress":
      return <PlayCircle className="w-4 h-4" />;
    case "pending":
      return <AlertCircle className="w-4 h-4" />;
    case "upcoming":
      return <Calendar className="w-4 h-4" />;
    default:
      return null;
  }
};
