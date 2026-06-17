export const BookingEvents = {
  CREATED: "booking.created",
  ACCEPTED: "booking.accepted",
  ASSIGNED: "booking.assigned",

  WORKER_ACCEPTED: "booking.worker.accepted",
  WORKER_REJECTED: "booking.worker.rejected",
  WORKER_STARTED: "booking.worker.started",
  WORKER_COMPLETED: "booking.worker.completed",

  ALL_WORKERS_STARTED: "booking.all-workers.started",
  ALL_WORKERS_COMPLETED: "booking.all-workers.completed",

  FINALIZED: "booking.finalized",
  PARTIALLY_PAID: "booking.partially-paid",
  PAID: "booking.paid",
  REFUNDED: "booking.refunded",

  CANCELLED_BY_CUSTOMER: "booking.cancelled.customer",
  CANCELLED_BY_WORKER: "booking.cancelled.worker",
  CANCELLEDLED_BY_PLATFORM: "booking.cancelled.platform",

  REVIEWED: "booking.reviewed",
  EXPIRED: "booking.expired",

  WORK_START_OTP_GENERATED: "booking.work-start-otp.generated",
  WORK_STARTED: "booking.work.started",
  WORK_COMPLETED_BY_WORKER: "booking.work.completed-by-worker",
  COMPLETION_OTP_GENERATED: "booking.completion-otp.generated",
  COMPLETION_CONFIRMED: "booking.completion.confirmed",

  COMPLETED: "booking.completed",
  INVOICE_GENERATED: "booking.invoice.generated",
  PAYMENT_INITIATED: "booking.payment.initiated",
  PAYMENT_COMPLETED: "booking.payment.completed",
  PAYMENT_FAILED: "booking.payment.failed",

  CHAT_MESSAGE: "booking.chat-message",

  DISPUTE_CREATED: "booking.dispute.created",
  DISPUTE_RESPONDED: "booking.dispute.responded",
  DISPUTE_RESOLVED: "booking.dispute.resolved",

  COORDINATOR_ASSIGNED_WORKER: "booking.coordinator.assigned-worker",
  COORDINATOR_REASSIGNED_WORKER:
    "booking.coordinator.reassigned-worker",
} as const;