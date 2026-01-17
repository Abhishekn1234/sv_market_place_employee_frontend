

/* ------------------ TYPES ------------------ */

export type BookingStatus =
  | "completed"
  | "confirmed"
  | "pending"
  | "inProgress"
  | "in-progress"
  | "cancelled";

export type NormalizedBookingStatus =
  | "completed"
  | "confirmed"
  | "pending"
  | "inProgress"
  | "cancelled";

export type StatusOptions = {
  all: string;
  completed: string;
  confirmed: string;
  pending: string;
  inProgress: string;
  cancelled: string;
};

export type TableHeaders = {
  id: string;
  client: string;
  service: string;
  date: string;
  time: string;
  payment: string;
  status: string;
  actions: string;
};

export interface BookingTranslations {
  clientInfo: string;
  bookingDetails: string;
  notes: string;
  bookingDetailsLabels: {
    service: string;
    duration: string;
    payment: string;
    status: string;
  };
}

/* ------------------ HELPERS ------------------ */

export function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function getNestedString(
  value: unknown,
  key: string
): string {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    key in value
  ) {
    const record = value as Record<string, unknown>;
    return typeof record[key] === "string" ? record[key] : "";
  }
  return "";
}

export const formatTime = (time: string) => {
  if (!time) return "";
  const parts = time.trim().split(" ");
  if (parts.length === 2) {
    const [ampm, clock] = parts;
    return `${clock} ${ampm.toUpperCase()}`;
  }
  return time;
};
