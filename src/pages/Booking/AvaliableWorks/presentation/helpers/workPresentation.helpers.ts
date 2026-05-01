import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import type {
  DisplayWork,
  WorkLocation,
  WorkStatus,
} from "../types/workPresentation.types";

export const FINAL_WORK_STATUSES: WorkStatus[] = [
  "COMPLETED",
  "WORK_COMPLETED_PENDING",
  "WORKER_CANCELLED",
  "WORKER_REJECTED",
  "CUSTOMER_CANCELLED",
];

export function normalizeWorkStatus(status?: unknown): WorkStatus {
  const normalized = String(status ?? "UNKNOWN").trim().toUpperCase();

  if (isWorkStatus(normalized)) {
    return normalized;
  }

  return "UNKNOWN";
}

export function normalizeAssignedWorks(
  assignedBookings: Array<Partial<DisplayWork> | Partial<Booking>>
): DisplayWork[] {
  const worksById = new Map<string, DisplayWork>();

  assignedBookings.forEach((bookingLike) => {
    const booking = bookingLike as Partial<DisplayWork>;
    const nestedBooking = booking.booking;
    const id = booking._id || booking.bookingId || nestedBooking?._id || nestedBooking?.id;

    if (!id) return;

    const existing = worksById.get(id);
    const statusSource = booking.status || nestedBooking?.status || existing?.status;

    const startedAt =
      booking.workStartedAt ||
      booking.startedAt ||
      nestedBooking?.workStartedAt ||
      nestedBooking?.startedAt ||
      existing?.workStartedAt ||
      existing?.startedAt;

    worksById.set(id, {
      ...(existing ?? {}),
      ...booking,
      _id: id,
      id,
      status: normalizeWorkStatus(statusSource),
      workStartedAt: startedAt,
      startedAt,
      booking: nestedBooking,
    } as DisplayWork);
  });

  return Array.from(worksById.values());
}

export function getWorkCoordinates(
  location?: WorkLocation | null
): { lat: number; lng: number } | null {
  if (!location) return null;

  if (typeof location === "string") {
    const [lat, lng] = location.split(",").map(Number);
    return isValidCoordinate(lat, lng) ? { lat, lng } : null;
  }

  const coordinates = location.coordinates;
  if (!coordinates) return null;

  const [lng, lat] = coordinates;
  return isValidCoordinate(lat, lng) ? { lat, lng } : null;
}

export function getWorkLocation(work: DisplayWork): WorkLocation | undefined {
  return work.location ?? work.booking?.location;
}

export function getBookingId(work: {
  bookingId?: string;
  booking?: { _id?: string };
  _id?: string;
  id?: string;
}): string {
  return work.bookingId || work.booking?._id || work._id || work.id || "";
}

export function getWorkerAmount(work: DisplayWork): string {
  const poolAmount = work.workerPoolAmount ?? work.booking?.workerPoolAmount;
  const workers = work.booking?.numberOfWorkers ?? work.numberOfWorkers;

  return workers && poolAmount ? (poolAmount / workers).toFixed(2) : "0.00";
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

function isWorkStatus(status: string): status is WorkStatus {
  return [
    "UNKNOWN",
    "ASSIGNED",
    "WORKER_ACCEPTED",
    "STARTED",
    "IN_PROGRESS",
    "WORK_COMPLETED_PENDING",
    "COMPLETED",
    "WORKER_CANCELLED",
    "WORKER_REJECTED",
    "CUSTOMER_CANCELLED",
  ].includes(status);
}

function isValidCoordinate(lat?: number, lng?: number): lat is number {
  return typeof lat === "number" && typeof lng === "number" && !Number.isNaN(lat) && !Number.isNaN(lng);
}
