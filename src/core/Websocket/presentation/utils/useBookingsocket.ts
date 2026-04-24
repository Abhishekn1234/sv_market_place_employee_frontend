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
    console.log("[Socket] Hook initialized");

    const requestSocket = initializeSocket("/workers/requests");
    const assignedSocket = initializeSocket("/workers/assigned-updates");

    console.log("[Socket] Initializing sockets...", {
      request: requestSocket?.id,
      assigned: assignedSocket?.id,
    });

    requestSocket.connect();
    assignedSocket.connect();

    /* ================= CONNECTION ================= */
    requestSocket.on("connect", () => {
      console.log("[Socket] Request connected:", requestSocket.id);
      setConnected(true);
    });

    requestSocket.on("disconnect", (reason: any) => {
      console.log("[Socket] Request disconnected:", reason);
      setConnected(false);
    });

    assignedSocket.on("connect", () => {
      console.log("[Socket] Assigned connected:", assignedSocket.id);
    });

    assignedSocket.on("disconnect", (reason: any) => {
      console.log("[Socket] Assigned disconnected:", reason);
    });

    /* ================= REQUEST EVENTS ================= */
    const onRequestUpsert = (data: any) => {
      console.log("[Socket][Request Upsert Event]", data);

      const b = normalize(data);
      if (!b) {
        console.log("[Socket][Request Upsert] Invalid payload");
        return;
      }

      console.log("[Socket][Request Upsert Normalized]", b);
      upsertRequest(b);
    };

    const onRequestRemove = (data: any) => {
      console.log("[Socket][Request Remove Event]", data);

      const id = data?.bookingId || data?._id;
      if (!id) {
        console.log("[Socket][Request Remove] Missing ID");
        return;
      }

      console.log("[Socket][Request Remove ID]", id);
      removeRequest(String(id));
    };

    requestSocket.on("booking.created", onRequestUpsert);
    requestSocket.on("booking.updated", onRequestUpsert);
    requestSocket.on("booking.worker.rejected", onRequestRemove);

    /* ================= ASSIGNED EVENTS ================= */
    const onAssigned = (data: any) => {
      console.log("[Socket][Assigned Upsert Event]", data);

      const b = normalize(data);
      if (!b) {
        console.log("[Socket][Assigned Upsert] Invalid payload");
        return;
      }

      console.log("[Socket][Assigned Upsert Normalized]", b);
      upsertAssigned(b);
    };

    const onRemoveAssigned = (data: any) => {
      console.log("[Socket][Assigned Remove Event]", data);

      const id = data?.bookingId || data?._id;
      if (!id) {
        console.log("[Socket][Assigned Remove] Missing ID");
        return;
      }

      console.log("[Socket][Assigned Remove ID]", id);
      removeAssigned(String(id));
    };

    assignedSocket.on("booking.worker.accepted", onAssigned);
    assignedSocket.on("booking.worker.rejected", onRemoveAssigned);

    assignedSocket.on("booking.work.started", onAssigned);
    assignedSocket.on("booking.work.completed-by-worker", onAssigned);
    assignedSocket.on("booking.completion.confirmed", onAssigned);

    /* ================= DISPUTE ================= */
    assignedSocket.on("booking.dispute.created", (d) => {
      console.log("[Socket][Dispute Created]", d);
      onAssigned(d);
    });

    assignedSocket.on("booking.dispute.responded", (d) => {
      console.log("[Socket][Dispute Responded]", d);
      onAssigned(d);
    });

    assignedSocket.on("booking.dispute.resolved", (d) => {
      console.log("[Socket][Dispute Resolved]", d);
      onAssigned(d);
    });

    return () => {
      console.log("[Socket] Cleaning up sockets");

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