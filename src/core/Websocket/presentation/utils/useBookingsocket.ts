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

    /* ================= REQUEST SOCKET ================= */
    const setupRequestSocket = () => {
      const socket = initializeSocket("/workers/requests");

      socket.connect();

      socket.on("connect", () => {
        console.log("[Socket] Request connected:", socket.id);
        setConnected(true);
      });

      socket.on("disconnect", (reason: any) => {
        console.log("[Socket] Request disconnected:", reason);
        setConnected(false);
      });

      const onUpsert = (data: any) => {
        console.log("[Socket][Request Upsert]", data);

        const b = normalize(data);
        if (!b) return;

        upsertRequest(b);
      };

      const onRemove = (data: any) => {
        console.log("[Socket][Request Remove]", data);

        const id = data?.bookingId || data?._id;
        if (!id) return;

        removeRequest(String(id));
      };

      socket.on("booking.created", onUpsert);
      socket.on("booking.updated", onUpsert);
      socket.on("booking.worker.rejected", onRemove);

      return socket;
    };

    /* ================= ASSIGNED SOCKET ================= */
    const setupAssignedSocket = () => {
      const socket = initializeSocket("/workers/assigned-updates");

      socket.connect();

      socket.on("connect", () => {
        console.log("[Socket] Assigned connected:", socket.id);
      });

      socket.on("disconnect", (reason: any) => {
        console.log("[Socket] Assigned disconnected:", reason);
      });

      const onUpsert = (data: any) => {
        console.log("[Socket][Assigned Upsert]", data);

        const b = normalize(data);
        if (!b) return;

        upsertAssigned(b);
      };

      const onRemove = (data: any) => {
        console.log("[Socket][Assigned Remove]", data);

        const id = data?.bookingId || data?._id;
        if (!id) return;

        removeAssigned(String(id));
      };

      socket.on("booking.worker.accepted", onUpsert);
      socket.on("booking.worker.rejected", onRemove);

      socket.on("booking.work.started", onUpsert);
      socket.on("booking.work.completed-by-worker", onUpsert);
      socket.on("booking.completion.confirmed", onUpsert);

      socket.on("booking.dispute.created", onUpsert);
      socket.on("booking.dispute.responded", onUpsert);
      socket.on("booking.dispute.resolved", onUpsert);

      return socket;
    };

    /* ================= INIT BOTH ================= */
    const requestSocket = setupRequestSocket();
    const assignedSocket = setupAssignedSocket();

    console.log("[Socket] Both sockets initialized");

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