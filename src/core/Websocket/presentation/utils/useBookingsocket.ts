import { useEffect } from "react";
import { initializeSocket } from "../components/socket";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";

/* ================= NORMALIZER ================= */

const normalize = (data: any): Booking | null => {
  const b = data?.booking ?? data;
  const id = b?._id || data?.bookingId;

  if (!id) return null;

  return {
    ...b,
    _id: id,
    status: (b.status || b.bookingStatus || "").toUpperCase(),
  };
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

    const onUpsert = (data: any) => {
      const b = normalize(data);
      if (!b) return;

      upsertRequest(b);
    };

    const onAssigned = (data: any) => {
      const b = normalize(data);
      if (!b) return;

      upsertAssigned(b);
      removeRequest(String(b._id));
    };

    const onRemove = (data: any) => {
      const id = data?.bookingId || data?._id;
      if (!id) return;

      removeRequest(String(id));
      removeAssigned(String(id));
    };

    // REQUEST EVENTS
    socket.on("booking.created", onUpsert);
    socket.on("booking.updated", onUpsert);
    socket.on("booking.worker.rejected", onRemove);

    // ASSIGNED EVENTS
    socket.on("booking.worker.accepted", onAssigned);
    socket.on("booking.work.started", onAssigned);
    socket.on("booking.work.completed-by-worker", onAssigned);
    socket.on("booking.completion.confirmed", onAssigned);

    socket.on("booking.dispute.created", onAssigned);
    socket.on("booking.dispute.responded", onAssigned);
    socket.on("booking.dispute.resolved", onAssigned);

    return () => {
      console.log("[Socket] cleanup");
      socket.disconnect();
      socket = null;
    };
  }, [upsertRequest, removeRequest, upsertAssigned, removeAssigned, setConnected]);
}