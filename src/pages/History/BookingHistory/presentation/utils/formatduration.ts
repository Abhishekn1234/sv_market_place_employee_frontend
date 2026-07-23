import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";

export function formatBookingDurationText(booking: Booking): string {
  const { pricingMode, schedule, actualWorkHours, actualWorkDays } = booking;

  // Prefer actual duration once work is completed
  if (
    pricingMode === "HOURLY" &&
    typeof actualWorkHours === "number" &&
    actualWorkHours > 0
  ) {
    const hours = Math.floor(actualWorkHours);
    const minutes = Math.round((actualWorkHours - hours) * 60);

    if (hours === 0) {
      return `${minutes} min${minutes !== 1 ? "s" : ""}`;
    }

    if (minutes === 0) {
      return `${hours} hr${hours > 1 ? "s" : ""}`;
    }

    return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min`;
  }

  if (
    pricingMode === "PER_DAY" &&
    typeof actualWorkDays === "number" &&
    actualWorkDays > 0
  ) {
    const days = Math.floor(actualWorkDays);
    const hours = Math.round((actualWorkDays - days) * 24);

    if (days === 0) {
      return `${hours} hr${hours !== 1 ? "s" : ""}`;
    }

    if (hours === 0) {
      return `${days} day${days > 1 ? "s" : ""}`;
    }

    return `${days} day${days > 1 ? "s" : ""} ${hours} hr`;
  }

  // Estimated duration (before completion)
  if (pricingMode === "HOURLY" && schedule?.estimatedHours != null) {
    const hours = schedule.estimatedHours;

    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} min${minutes !== 1 ? "s" : ""}`;
    }

    return `${hours} hr${hours > 1 ? "s" : ""}`;
  }

  if (pricingMode === "PER_DAY" && schedule?.estimatedDays != null) {
    const days = schedule.estimatedDays;
    return `${days} day${days > 1 ? "s" : ""}`;
  }

  return "—";
}