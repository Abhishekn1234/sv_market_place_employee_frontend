import type { DisplayWork } from "../types/workPresentation.types";

export const HIDDEN_STATUSES = [
  "UNKNOWN",

  // cancellations
  "CUSTOMER_CANCELLED",
  "WORKER_CANCELLED",
  "CANCELLED_BY_CUSTOMER",
  "CANCELLED_BY_WORKER",
  "ADMIN_CANCELLED",

 
];

export const isHidden = (work: DisplayWork) => {
  const status = work.status?.toUpperCase();
  const bookingStatus = work.booking?.status?.toUpperCase();

  return HIDDEN_STATUSES.includes(status) ||
         HIDDEN_STATUSES.includes(String(bookingStatus));
};