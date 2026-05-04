export const CATEGORY_MAP: Record<string, string | undefined> = {
  all: undefined,
  booking: "BOOKING_REQUEST",   // or BOOKING_UPDATE if needed
  payment: "BOOKING_UPDATE",    // adjust based on backend meaning
  system: "ADMIN_MESSAGE",
  alert: "ADMIN_MESSAGE",
};