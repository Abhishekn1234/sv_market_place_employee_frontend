import type { BookingStatus } from "../../domain/entities/bookingstatus";

export function mapBookingStatus(apiStatus: string): BookingStatus {
  switch (apiStatus?.toUpperCase()) {
    case "REQUESTED":
      return "requested";

    case "CONFIRMED":
      return "confirmed";

    case "COMPLETED":
      return "completed";

    case "CANCELLED":
    case "CANCELED":
    case "WORK_CANCELLED":
    case "WORKER_CANCELLED": // ✅ THIS WAS MISSING
      return "cancelled";

    case "IN_PROGRESS":
    case "IN-PROGRESS":
      return "IN_PROGRESS";

    default:
      console.warn("Unknown booking status:", apiStatus);
      return "pending";
  }
}