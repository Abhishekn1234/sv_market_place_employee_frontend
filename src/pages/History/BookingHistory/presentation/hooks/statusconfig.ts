import { useLanguage } from "@/context/LanguageContext";
import type { BookingStatus } from "../../../../Booking/AvailableBooking/domain/entities/bookingstatus";
import type { StatusOptions } from "../../domain/entities/statusoptions.types";

export function useStatusConfig(): Record<
  BookingStatus,
  { label: string; color: string }
> {
  const { translations } = useLanguage();
  const completed = translations.bookingHistory.statusOptions.completed;
  const C = completed.toLocaleUpperCase();
  console.log(C);

  const statusOptions = translations.bookingHistory.statusOptions as unknown as StatusOptions;
  console.log(statusOptions);

  return {
    [C]: {  // <- dynamic key
      label: statusOptions.completed,
      color: "bg-green-100 text-green-700",
    },
    INVOICE_GENERATED:{
      label:statusOptions.completed,
      color:"bg-gray-100"
    },
    completed:{
      label:statusOptions.completed,
      color:"bg-gray-100"
    },
    confirmed: {
      label: statusOptions.confirmed,
      color: "bg-blue-100 text-blue-700",
    },
    pending: {
      label: statusOptions.pending,
      color: "bg-yellow-100 text-yellow-700",
    },
    IN_PROGRESS: {
      label: statusOptions.inProgress,
      color: "bg-purple-100 text-purple-700",
    },
    cancelled: {
      label: statusOptions.cancelled,
      color: "bg-red-100 text-red-700",
    },
    requested: {
      label: statusOptions.requested,
      color: "bg-red-100 text-red-700",
    },
    ongoing: {
      label: statusOptions.ongoing,
      color: "bg-red-100 text-red-700",
    },
    workCompletedPending:{
      label:statusOptions.completed,
      color:"bg-blue-100"
    },
    WORK_COMPLETED_PENDING:{
      label:statusOptions.completed,
      color:"bg-green-100"
    },
   
    WORK_COMPLETED:{
      label:statusOptions.completed,
      color:"bg-gray-100"
    },
    WORKER_ACCEPTED:{
      label:statusOptions.completed,
      color:"bg-blue-100"
    }
  };
}