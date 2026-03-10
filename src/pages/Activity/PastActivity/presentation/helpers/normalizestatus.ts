export function normalizeStatus(status: string) {
  switch (status) {

    case "completed":
    case "WORK_COMPLETED":
      return "completed";

    case "IN_PROGRESS":
    case "WORKER_ACCEPTED":
    case "requested":
    case "ongoing":
    case "pending":
    case "WORK_COMPLETED_PENDING":
    case "workCompletedPending":
    case "INVOICE_GENERATED":
      return "pending";

    case "cancelled":
    case "CUSTOMER_CANCELLED":
    case "WORKER_CANCELLED":
      return "cancelled";

    default:
      return "pending";
  }
}