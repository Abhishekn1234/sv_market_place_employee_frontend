import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import type {
  DisplayWork,
  WorkLocation,
  WorkStatus,
} from "../types/workPresentation.types";

// ✅ FINAL STATUSES
export const FINAL_WORK_STATUSES: WorkStatus[] = [
  "COMPLETED",
  "WORK_COMPLETED_PENDING",
  "WORKER_CANCELLED",
  "WORKER_REJECTED",
  "CUSTOMER_CANCELLED",
];

// ✅ ALWAYS USE BOOKING ID
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

// ✅ STATUS NORMALIZER
export function normalizeWorkStatus(status?: unknown): WorkStatus {
  const normalized = String(status ?? "UNKNOWN").trim().toUpperCase();

  if (
    [
      "UNKNOWN",
      "ASSIGNED",
      "WORKER_ACCEPTED",
      "STARTED",
      "IN_PROGRESS",
      "WORK_COMPLETED_PENDING",
      "COMPLETED",
       "INVOICE_GENERATED"
      
    ].includes(normalized)
  ) {
    return normalized as WorkStatus;
  }

  return "UNKNOWN";
}
const isCancelled = (status?: string) => {
  const s = status?.toUpperCase();
  return (
    s === "CUSTOMER_CANCELLED" ||
    s === "WORKER_CANCELLED"
  );
};


// ✅ MAIN NORMALIZER (MOST IMPORTANT FIX)
export function normalizeAssignedWorks(
  assignedBookings: Array<Partial<DisplayWork> | Partial<Booking>>
): DisplayWork[] {
  const map = new Map<string, DisplayWork>();

 assignedBookings.forEach((item: any) => {
  const booking = item.booking;
  const id = getBookingId(item);

  if (!id) return;

  const statusSource =
    item.status ?? booking?.status;

  // 🔥 HARD BLOCK CANCELLED
  if (isCancelled(statusSource)) return;

  const existing = map.get(id);

  map.set(id, {
    ...(existing ?? {}),
    ...item,
    _id: id,
    id,
    booking,
    status: normalizeWorkStatus(statusSource),
    workStartedAt:
      item.workStartedAt ||
      item.startedAt ||
      booking?.startedAt ||
      existing?.workStartedAt,
  });
});

  return Array.from(map.values());
}

// ✅ LOCATION HELPERS
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

      if (index === 0) return total + value * 60; // hours → minutes
      if (index === 1) return total + value;      // minutes
      return total + value / 60;                  // seconds → minutes
    }, 0);

  return minutes.toFixed(0);
}
export function getWorkLocation(work: DisplayWork) {
  return work.location ?? work.booking?.location;
}

export function getWorkerAmount(work: DisplayWork): string {
  const pool = work.workerPoolAmount ?? work.booking?.workerPoolAmount;
  const workers = work.booking?.numberOfWorkers ?? work.numberOfWorkers;

  return workers && pool ? (pool / workers).toFixed(2) : "0.00";
}