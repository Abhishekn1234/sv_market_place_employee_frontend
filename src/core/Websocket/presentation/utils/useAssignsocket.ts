import { useEffect } from "react";
import { initializeSocket } from "../components/socket";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import { normalizeBooking } from "./normalizeBooking";
import { BookingEvents } from "@/components/common/BookingEvents";


const isCancelledStatus = (status?: string) => {
  const normalized = String(status ?? "").trim().toUpperCase();
  return [
    "CUSTOMER_CANCELLED",
    "WORKER_CANCELLED",
    "CANCELLED",
    "CANCELLED_BY_CUSTOMER",
    "ADMIN_CANCELLED",
  ].includes(normalized);
};

export function useAssignedSocket() {
  const { upsertAssigned, removeAssigned, setConnected } =
    useBookingSocketStore();

  useEffect(() => {
    const socket = initializeSocket("/workers/assigned-updates");

    socket.connect();

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    const handleUpdate = (data: any) => {
      const booking = normalizeBooking(data);
      if (!booking) return;

      if (isCancelledStatus(booking.status)) {
        removeAssigned(String(booking._id));
        return;
      }

      upsertAssigned(booking);
    };

    const handleRemove = (data: any) => {
      const id = data?.bookingId || data?._id || data?.booking?._id;
      if (!id) return;

      removeAssigned(String(id));
    };

    // Events that update the booking
    [
      BookingEvents.CREATED,
      BookingEvents.ACCEPTED,
      BookingEvents.ASSIGNED,

      BookingEvents.WORKER_ACCEPTED,
      BookingEvents.WORKER_STARTED,
      BookingEvents.WORKER_COMPLETED,

      BookingEvents.ALL_WORKERS_STARTED,
      BookingEvents.ALL_WORKERS_COMPLETED,

      BookingEvents.FINALIZED,
      BookingEvents.PARTIALLY_PAID,
      BookingEvents.PAID,
      BookingEvents.REFUNDED,

      BookingEvents.REVIEWED,
      BookingEvents.EXPIRED,

      BookingEvents.WORK_START_OTP_GENERATED,
      BookingEvents.WORK_STARTED,
      BookingEvents.WORK_COMPLETED_BY_WORKER,
      BookingEvents.COMPLETION_OTP_GENERATED,
      BookingEvents.COMPLETION_CONFIRMED,

      BookingEvents.COMPLETED,
      BookingEvents.INVOICE_GENERATED,
      BookingEvents.PAYMENT_INITIATED,
      BookingEvents.PAYMENT_COMPLETED,
      BookingEvents.PAYMENT_FAILED,

      BookingEvents.CHAT_MESSAGE,

      BookingEvents.DISPUTE_CREATED,
      BookingEvents.DISPUTE_RESPONDED,
      BookingEvents.DISPUTE_RESOLVED,

      BookingEvents.COORDINATOR_ASSIGNED_WORKER,
      BookingEvents.COORDINATOR_REASSIGNED_WORKER,
    ].forEach((event) => socket.on(event, handleUpdate));

    // Events that remove the booking
    [
      BookingEvents.WORKER_REJECTED,
      BookingEvents.CANCELLED_BY_CUSTOMER,
      BookingEvents.CANCELLED_BY_WORKER,
      BookingEvents.CANCELLEDLED_BY_PLATFORM,
    ].forEach((event) => socket.on(event, handleRemove));

    return () => {
      [
        BookingEvents.CREATED,
        BookingEvents.ACCEPTED,
        BookingEvents.ASSIGNED,

        BookingEvents.WORKER_ACCEPTED,
        BookingEvents.WORKER_STARTED,
        BookingEvents.WORKER_COMPLETED,

        BookingEvents.ALL_WORKERS_STARTED,
        BookingEvents.ALL_WORKERS_COMPLETED,

        BookingEvents.FINALIZED,
        BookingEvents.PARTIALLY_PAID,
        BookingEvents.PAID,
        BookingEvents.REFUNDED,

        BookingEvents.REVIEWED,
        BookingEvents.EXPIRED,

        BookingEvents.WORK_START_OTP_GENERATED,
        BookingEvents.WORK_STARTED,
        BookingEvents.WORK_COMPLETED_BY_WORKER,
        BookingEvents.COMPLETION_OTP_GENERATED,
        BookingEvents.COMPLETION_CONFIRMED,

        BookingEvents.COMPLETED,
        BookingEvents.INVOICE_GENERATED,
        BookingEvents.PAYMENT_INITIATED,
        BookingEvents.PAYMENT_COMPLETED,
        BookingEvents.PAYMENT_FAILED,

        BookingEvents.CHAT_MESSAGE,

        BookingEvents.DISPUTE_CREATED,
        BookingEvents.DISPUTE_RESPONDED,
        BookingEvents.DISPUTE_RESOLVED,

        BookingEvents.COORDINATOR_ASSIGNED_WORKER,
        BookingEvents.COORDINATOR_REASSIGNED_WORKER,

        BookingEvents.WORKER_REJECTED,
        BookingEvents.CANCELLED_BY_CUSTOMER,
        BookingEvents.CANCELLED_BY_WORKER,
        BookingEvents.CANCELLEDLED_BY_PLATFORM,
      ].forEach((event) => socket.off(event));

      socket.disconnect();
    };
  }, [upsertAssigned, removeAssigned, setConnected]);
}