import type { BookingStatus } from "../../domain/entities/bookingstatus";

export function mapBookingStatus(apiStatus: string): BookingStatus {
  switch (apiStatus?.toUpperCase()) {
    case "REQUESTED":
      return "CREATED";

    case "CONFIRMED":
      return "COMPLETION_CONFIRMED";

    case "COMPLETED":
      return "COMPLETED";

    case "CANCELLED":
    case "CANCELED":
    case "WORK_CANCELLED":
    case "WORKER_CANCELLED": // ✅ THIS WAS MISSING
      return "CANCELLED";

    case "IN_PROGRESS":
    case "IN-PROGRESS":
      return "IN_PROGRESS";

    default:
      console.warn("Unknown booking status:", apiStatus);
      return "PENDING";
  }
}