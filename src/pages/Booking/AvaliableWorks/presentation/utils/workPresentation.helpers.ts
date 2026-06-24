import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import type {
  DisplayWork,
  WorkLocation,
  WorkStatus,
} from "../types/workPresentation.types";

export const FINAL_WORK_STATUSES: WorkStatus[] = [
  "COMPLETED",
  "INVOICE_GENERATED",
  "WORK_COMPLETED_PENDING",
  "WORKER_CANCELLED",
  "WORKER_REJECTED",
  "CUSTOMER_CANCELLED",
];

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
      "INVOICE_GENERATED",
      "COMPLETED",
      "WORKER_CANCELLED",
      "WORKER_REJECTED",
      "CUSTOMER_CANCELLED",
    ].includes(normalized)
  ) {
    return normalized as WorkStatus;
  }

  return "UNKNOWN";
}

const shouldExclude = (status?: string): boolean => {
  const s = status?.toUpperCase();
  return (
    s === "CUSTOMER_CANCELLED" ||
    s === "WORKER_CANCELLED"   ||
    s === "WORKER_REJECTED"    ||
    s === "INVOICE_GENERATED"  ||
    s === "COMPLETED"
  );
};

export function normalizeAssignedWorks(
  assignedBookings: Array<Partial<DisplayWork> | Partial<Booking>>
): DisplayWork[] {
  const map = new Map<string, DisplayWork>();

  assignedBookings.forEach((item: any) => {
    const booking = item.booking;
    const id = getBookingId(item);

    if (!id) return;

    const bStatus = booking?.status?.toUpperCase();
    const statusSource =
      bStatus && FINAL_WORK_STATUSES.includes(bStatus as any)
        ? booking.status
        : item.status ?? booking?.status;

    const normalizedStatus = normalizeWorkStatus(statusSource);

    if (shouldExclude(normalizedStatus)) return;

    const existing = map.get(id);

    map.set(id, {
      ...(existing ?? {}),
      ...item,
      _id: id,
      id,
      booking,
      status: normalizedStatus,
      workStartedAt:
        item.workStartedAt ||
        item.startedAt ||
        booking?.startedAt ||
        existing?.workStartedAt,
    });
  });

  return Array.from(map.values());
}

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
  const pool = work.workerPoolAmount ?? work.booking?.workerPoolAmount;
  const workers = work.booking?.numberOfWorkers ?? work.numberOfWorkers;
  return workers && pool ? (pool / workers).toFixed(2) : "0.00";
}