import { useEffect } from "react";
import { initializeSocket } from "../components/socket";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";

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
      removeRequest(String(id));
      removeAssigned(String(id));
    };

    const onUpsert = (data: any) => {
      const b = normalize(data);
      if (!b) return;

      if (isCancelledStatus(b.status)) {
        removeBooking(String(b._id));
        return;
      }

      upsertRequest(b);
    };

    // REQUEST EVENTS ONLY (for modal)
    socket.on("booking.created", onUpsert);

    return () => {
      console.log("[Socket] cleanup");
      socket.disconnect();
      socket = null;
    };
  }, [upsertRequest, removeRequest, upsertAssigned, removeAssigned, setConnected]);
}