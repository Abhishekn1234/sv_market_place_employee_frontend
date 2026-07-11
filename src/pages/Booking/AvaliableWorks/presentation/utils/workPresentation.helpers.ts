import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import type {
  DisplayWork,
  WorkLocation,
  WorkStatus,
} from "../types/workPresentation.types";

// ✅ Final statuses
export const FINAL_WORK_STATUSES: WorkStatus[] = [
  "COMPLETED",
  "WORK_COMPLETED_PENDING",
  "COMPLETION_CONFIRMED",
  "INVOICE_GENERATED",
  "PARTIALLY_PAID",
  "PAYMENT_INITIATED",
  "PAYMENT_COMPLETED",

  "WORKER_CANCELLED",
  "WORKER_REJECTED",
  "CUSTOMER_CANCELLED",
];

// ✅ Always use booking id
export function getBookingId(work: {
  bookingId?: string;
  booking?: { _id?: string };
  _id?: string;
  id?: string;
}): string {
  return (
    work.booking?._id ||
    work.bookingId ||
    work._id ||
    work.id ||
    ""
  );
}

// ✅ Normalize all booking/work statuses
export function normalizeWorkStatus(status?: unknown): WorkStatus {
  const normalized = String(status ?? "UNKNOWN")
    .trim()
    .toUpperCase();

  const validStatuses = [
    "UNKNOWN",

    // Booking lifecycle
    "CREATED",
    "ACCEPTED",
    "ASSIGNED",
    "FINALIZED",
    "REVIEWED",
    "EXPIRED",

    // Worker lifecycle
    "WORKER_ACCEPTED",
    "WORKER_REJECTED",
    "WORKER_STARTED",
    "WORKER_COMPLETED",

    // Work lifecycle
    "WORK_START_OTP_GENERATED",
    "WORK_STARTED",
    "STARTED",
    "IN_PROGRESS",
    "WORK_COMPLETED_BY_WORKER",
    "WORK_COMPLETED_PENDING",
    "COMPLETION_OTP_GENERATED",
    "COMPLETION_CONFIRMED",

    // Multi-worker
    "ALL_WORKERS_STARTED",
    "ALL_WORKERS_COMPLETED",

    // Invoice & Payment
    "INVOICE_GENERATED",
    "PARTIALLY_PAID",
    "PAYMENT_INITIATED",
    "PAYMENT_COMPLETED",
    "PAYMENT_FAILED",
    "PAYMENT_PENDING",

    // Final
    "COMPLETED",

    // Cancellation
    "CUSTOMER_CANCELLED",
    "WORKER_CANCELLED",
    "ADMIN_CANCELLED",
    "CANCELLED",
    "CANCELLED_BY_CUSTOMER",
    "CANCELLED_BY_WORKER",
    "CANCELLED_BY_PLATFORM",
  ];

  return validStatuses.includes(normalized)
    ? (normalized as WorkStatus)
    : "UNKNOWN";
}

const isCancelled = (status?: string) => {
  const s = status?.toUpperCase();

  return [
    "CUSTOMER_CANCELLED",
    "WORKER_CANCELLED",
    "ADMIN_CANCELLED",
    "CANCELLED",
    "CANCELLED_BY_CUSTOMER",
    "CANCELLED_BY_WORKER",
    "CANCELLED_BY_PLATFORM",
  ].includes(s ?? "");
};

// ✅ Statuses that should not render as a work card
const isExcludedFromCards = (status?: string) => {
  const s = status?.toUpperCase();

  return ["INVOICE_GENERATED"].includes(s ?? "");
};

// ✅ Main normalizer
export function normalizeAssignedWorks(
  assignedBookings: Array<Partial<DisplayWork> | Partial<Booking>>
): DisplayWork[] {
  const map = new Map<string, DisplayWork>();

  assignedBookings.forEach((item: any) => {
    const booking = item.booking;
    const id = getBookingId(item);

    if (!id) return;

    // ✅ Socket status takes priority over booking status
    const statusSource = item.status ?? booking?.status;

    // Skip cancelled bookings
    if (isCancelled(statusSource)) return;

    // Skip bookings whose invoice has already been generated
    if (isExcludedFromCards(statusSource)) return;

    const existing = map.get(id);

    map.set(id, {
      ...(existing ?? {}),
      ...item,

      _id: id,
      id,

      // ✅ Keep booking object in sync with latest socket status
      booking: booking
        ? {
            ...booking,
            status: item.status ?? booking.status,
          }
        : existing?.booking,

      // ✅ Latest status
      status: normalizeWorkStatus(statusSource),

      // ✅ Preserve work start time
      workStartedAt:
        item.workStartedAt ??
        item.startedAt ??
        booking?.workStartedAt ??
        booking?.startedAt ??
        existing?.workStartedAt,
    } as DisplayWork);
  });

  return Array.from(map.values());
}

// ✅ Location helpers
export function getWorkCoordinates(
  location?: WorkLocation | null
): { lat: number; lng: number } | null {
  if (!location) return null;

  if (typeof location === "string") {
    const [lat, lng] = location.split(",").map(Number);

    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      return { lat, lng };
    }

    return null;
  }

  const coords = location.coordinates;

  if (!coords) return null;

  const [lng, lat] = coords;

  if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
    return { lat, lng };
  }

  return null;
}

export function elapsedMinutes(elapsedTime?: string): string {
  if (!elapsedTime) return "0";

  const minutes = elapsedTime
    .split(":")
    .map(Number)
    .reduce((total, value, index) => {
      if (Number.isNaN(value)) return total;

      if (index === 0) return total + value * 60;
      if (index === 1) return total + value;

      return total + value / 60;
    }, 0);

  return minutes.toFixed(0);
}

export function getWorkLocation(work: DisplayWork) {
  return work.location ?? work.booking?.location;
}

export function getWorkerAmount(work: DisplayWork): string {
  const pool =
    work.booking?.finalWorkerPoolAmount ?? work.booking?.workerPoolAmount;

  const workers =
    work.booking?.numberOfWorkers ?? work.numberOfWorkers;

  return workers && pool
    ? (pool / workers).toFixed(2)
    : "0.00";
}