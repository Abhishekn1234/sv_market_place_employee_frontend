import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";



export function formatBookingDurationText(booking: Booking): string {
  const mode = booking.pricingMode;
  const schedule = booking.schedule;

  if (!mode || !schedule) return "—";

  if (mode === "HOURLY" && schedule.estimatedHours != null) {
    const hours = schedule.estimatedHours;

    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} min${minutes > 1 ? "s" : ""}`;
    }

    if (hours === 1) {
      return `1 hr`;
    }

    if (hours > 1) {
      return `${hours} hrs`;
    }
  }

  if (mode === "PER_DAY" && schedule.estimatedDays != null) {
    const days = schedule.estimatedDays;
    return `${days} ${days === 1 ? "day" : "days"}`;
  }

  return "—";
}