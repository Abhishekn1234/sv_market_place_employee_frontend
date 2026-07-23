import type { BookingStatus } from "@/pages/Booking/AvailableBooking/domain/entities/bookingstatus";

  export const getBookingStatusColor = (status: BookingStatus) => {
  const statusMap: Record<BookingStatus, string> = {
    UNKNOWN: "bg-gray-100 text-gray-700",

    CREATED: "bg-blue-100 text-blue-700",
    ACCEPTED: "bg-blue-100 text-blue-700",
    ASSIGNED: "bg-blue-100 text-blue-700",
    WORKER_ACCEPTED: "bg-blue-100 text-blue-700",

    WORKER_REJECTED: "bg-red-100 text-red-700",
    WORKER_CANCELLED: "bg-red-100 text-red-700",
    CUSTOMER_CANCELLED: "bg-red-100 text-red-700",
    ADMIN_CANCELLED: "bg-red-100 text-red-700",
    CANCELLED: "bg-red-100 text-red-700",

    WORKER_STARTED: "bg-yellow-100 text-yellow-700",
    WORK_STARTED: "bg-yellow-100 text-yellow-700",
    STARTED: "bg-yellow-100 text-yellow-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",

    WORKER_COMPLETED: "bg-purple-100 text-purple-700",
    WORK_COMPLETED_PENDING: "bg-purple-100 text-purple-700",
    COMPLETION_CONFIRMED: "bg-purple-100 text-purple-700",

    PAYMENT_PENDING: "bg-orange-100 text-orange-700",
    PENDING: "bg-orange-100 text-orange-700",
    INVOICE_GENERATED: "bg-orange-100 text-orange-700",

    PAYMENT_COMPLETED: "bg-emerald-100 text-emerald-700",
    PAID: "bg-emerald-100 text-emerald-700",
    COMPLETED: "bg-green-100 text-green-700",
  };

  return statusMap[status] ?? "bg-gray-100 text-gray-700";
};