import { useEffect } from "react";
import { initializeSocket } from "../components/socket";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import { BookingEvents } from "@/components/common/BookingEvents";


/* ================= NORMALIZER ================= */

const normalize = (data: any): Booking | null => {
  const b = data?.booking ?? data;
  const id = b?._id || data?.bookingId || data?.booking?._id;

  if (!id) return null;

  return {
    ...b,
    _id: String(id),
    status: String(b.status || b.bookingStatus || "").toUpperCase(),
  };
};

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

/* ================= SOCKET INSTANCE ================= */

let socket: any = null;

/* ================= HOOK ================= */

export function useBookingSocket() {
  const {
    upsertRequest,
    removeRequest,
    upsertAssigned,
    removeAssigned,
    setConnected,
  } = useBookingSocketStore();

  useEffect(() => {
    console.log("[Socket] initializing...");

    socket = initializeSocket("/workers/requests");
    socket.connect();

    socket.on("connect", () => {
      console.log("[Socket] connected:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("[Socket] disconnected");
      setConnected(false);
    });

    const removeBooking = (id: string) => {
      removeRequest(id);
      removeAssigned(id);
    };

    const onUpsert = (data: any) => {
      const booking = normalize(data);

      if (!booking) return;

      if (isCancelledStatus(booking.status)) {
        removeBooking(String(booking._id));
        return;
      }

      upsertRequest(booking);
    };

    const onRemove = (data: any) => {
      const id =
        data?.bookingId ||
        data?.booking?._id ||
        data?._id;

      if (!id) return;

      removeBooking(String(id));
    };

    /* ================= REQUEST EVENTS ================= */

    socket.on(BookingEvents.CREATED, onUpsert);

    /* ================= REMOVE EVENTS ================= */

    socket.on(BookingEvents.CANCELLED_BY_CUSTOMER, onRemove);
    socket.on(BookingEvents.CANCELLED_BY_WORKER, onRemove);
    socket.on(BookingEvents.CANCELLEDLED_BY_PLATFORM, onRemove);
    socket.on(BookingEvents.EXPIRED, onRemove);

    return () => {
      console.log("[Socket] cleanup");

      socket.off(BookingEvents.CREATED, onUpsert);

      socket.off(BookingEvents.CANCELLED_BY_CUSTOMER, onRemove);
      socket.off(BookingEvents.CANCELLED_BY_WORKER, onRemove);
      socket.off(BookingEvents.CANCELLEDLED_BY_PLATFORM, onRemove);
      socket.off(BookingEvents.EXPIRED, onRemove);

      socket.disconnect();
      socket = null;
    };
  }, [
    upsertRequest,
    removeRequest,
    upsertAssigned,
    removeAssigned,
    setConnected,
  ]);
}