import { useLanguage } from "@/context/presentation/components/LanguageContext";
import type { BookingStatus } from "../../../../Booking/AvailableBooking/domain/entities/bookingstatus";
import type { StatusOptions } from "../../domain/entities/statusoptions.types";

export function useStatusConfig(): Record<
  BookingStatus,
  { label: string; color: string }
> {
  const { translations } = useLanguage();

  const statusOptions =
    translations.bookingHistory.statusOptions as unknown as StatusOptions;

  return {
    UNKNOWN: {
      label: statusOptions.pending,
      color: "bg-gray-100 text-gray-700",
    },

    CREATED: {
      label: statusOptions.requested,
      color: "bg-blue-100 text-blue-700",
    },

    ACCEPTED: {
      label: statusOptions.ongoing,
      color: "bg-blue-100 text-blue-700",
    },

    ASSIGNED: {
      label: statusOptions.ongoing,
      color: "bg-blue-100 text-blue-700",
    },

    WORKER_ACCEPTED: {
      label: statusOptions.ongoing,
      color: "bg-blue-100 text-blue-700",
    },

    WORKER_REJECTED: {
      label: statusOptions.cancelled,
      color: "bg-red-100 text-red-700",
    },

    WORKER_STARTED: {
      label: statusOptions.inProgress,
      color: "bg-purple-100 text-purple-700",
    },

    WORKER_COMPLETED: {
      label: statusOptions.completed,
      color: "bg-green-100 text-green-700",
    },

    WORK_STARTED: {
      label: statusOptions.inProgress,
      color: "bg-purple-100 text-purple-700",
    },

    STARTED: {
      label: statusOptions.inProgress,
      color: "bg-purple-100 text-purple-700",
    },

    IN_PROGRESS: {
      label: statusOptions.inProgress,
      color: "bg-purple-100 text-purple-700",
    },

    WORK_COMPLETED_PENDING: {
      label: statusOptions.completed,
      color: "bg-green-100 text-green-700",
    },

    COMPLETION_CONFIRMED: {
      label: statusOptions.confirmed,
      color: "bg-green-100 text-green-700",
    },

    PAYMENT_PENDING: {
      label: statusOptions.pending,
      color: "bg-yellow-100 text-yellow-700",
    },

    PENDING: {
      label: statusOptions.pending,
      color: "bg-yellow-100 text-yellow-700",
    },

    PAYMENT_COMPLETED: {
      label: statusOptions.completed,
      color: "bg-green-100 text-green-700",
    },

    PAID: {
      label: statusOptions.completed,
      color: "bg-green-100 text-green-700",
    },

    INVOICE_GENERATED: {
      label: statusOptions.completed,
      color: "bg-green-100 text-green-700",
    },

    COMPLETED: {
      label: statusOptions.completed,
      color: "bg-green-100 text-green-700",
    },

    WORKER_CANCELLED: {
      label: statusOptions.cancelled,
      color: "bg-red-100 text-red-700",
    },

    CUSTOMER_CANCELLED: {
      label: statusOptions.cancelled,
      color: "bg-red-100 text-red-700",
    },

    ADMIN_CANCELLED: {
      label: statusOptions.cancelled,
      color: "bg-red-100 text-red-700",
    },

    CANCELLED: {
      label: statusOptions.cancelled,
      color: "bg-red-100 text-red-700",
    },
  };
}