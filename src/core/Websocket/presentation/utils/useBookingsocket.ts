"use client";

import { useEffect } from "react";
import { initializeSocket } from "../components/socket";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";

const normalize = (data: any) => {
  const b = data?.booking ?? data;
  const id = b?._id || data?.bookingId;
  if (!id) return null;

  return {
    ...b,
    _id: id,
    status: (b.status || b.bookingStatus || "").toUpperCase(),
  };
};

export function useBookingSocket() {
  const {
    upsertRequest,
    removeRequest,
    upsertAssigned,
    removeAssigned,
    setConnected,
  } = useBookingSocketStore();

  useEffect(() => {
    const requestSocket = initializeSocket("/workers/requests");
    const assignedSocket = initializeSocket("/workers/assigned-updates");

    requestSocket.connect();
    assignedSocket.connect();

    /* ================= CONNECTION ================= */
    requestSocket.on("connect", () => setConnected(true));
    requestSocket.on("disconnect", () => setConnected(false));

    /* ================= REQUEST EVENTS ================= */
    const onRequestUpsert = (data: any) => {
      const b = normalize(data);
      if (!b) return;

      upsertRequest(b);
    };

    const onRequestRemove = (data: any) => {
      const id = data?.bookingId || data?._id;
      if (!id) return;

      removeRequest(String(id));
    };

    requestSocket.on("booking.created", onRequestUpsert);
    requestSocket.on("booking.updated", onRequestUpsert);
    requestSocket.on("booking.worker.rejected", onRequestRemove);

    /* ================= ASSIGNED EVENTS ================= */
    const onAssigned = (data: any) => {
      const b = normalize(data);
      if (!b) return;

      upsertAssigned(b);
    };

    const onRemoveAssigned = (data: any) => {
      const id = data?.bookingId || data?._id;
      if (!id) return;

      removeAssigned(String(id));
    };

    assignedSocket.on("booking.worker.accepted", onAssigned);
    assignedSocket.on("booking.worker.rejected", onRemoveAssigned);

    assignedSocket.on("booking.work.started", onAssigned);
    assignedSocket.on("booking.work.completed-by-worker", onAssigned);
    assignedSocket.on("booking.completion.confirmed", onAssigned);

    /* ================= DISPUTE ================= */
    assignedSocket.on("booking.dispute.created", onAssigned);
    assignedSocket.on("booking.dispute.responded", onAssigned);
    assignedSocket.on("booking.dispute.resolved", onAssigned);

    return () => {
      requestSocket.disconnect();
      assignedSocket.disconnect();
    };
  }, [
    upsertRequest,
    removeRequest,
    upsertAssigned,
    removeAssigned,
    setConnected,
  ]);
}