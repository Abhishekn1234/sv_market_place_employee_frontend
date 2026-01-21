import { useLanguage } from "@/context/LanguageContext";
import type { BookingStatus } from "../../domain/entities/bookingstatus";
import type { StatusOptions } from "../../domain/entities/statusoptions.types";

export function useStatusConfig(): Record<
  BookingStatus,
  { label: string; color: string }
> {
  const { translations } = useLanguage();
  const statusOptions = translations.statusOptions as StatusOptions;

  return {
    completed: {
      label: statusOptions.completed,
      color: "bg-green-100 text-green-700",
    },
    confirmed: {
      label: statusOptions.confirmed,
      color: "bg-blue-100 text-blue-700",
    },
    pending: {
      label: statusOptions.pending,
      color: "bg-yellow-100 text-yellow-700",
    },
    inProgress: {
      label: statusOptions.inProgress,
      color: "bg-purple-100 text-purple-700",
    },
    cancelled: {
      label: statusOptions.cancelled,
      color: "bg-red-100 text-red-700",
    },
  };
}
