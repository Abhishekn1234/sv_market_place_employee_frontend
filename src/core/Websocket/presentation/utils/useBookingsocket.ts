import { useEffect } from "react";
import { initializeSocket } from "../components/socket";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";

import { Socket } from "socket.io-client";
import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";

/* ================= TYPES ================= */



type RequestSocketDeps = {
  upsertRequest: (b: Booking) => void;
  removeRequest: (id: string) => void;
  setConnected: (v: boolean) => void;
};

type AssignedSocketDeps = {
  upsertAssigned: (b: Booking) => void;
  removeAssigned: (id: string) => void;
  removeRequest: (id: string) => void;
};

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

/* ================= SINGLETON SOCKETS ================= */

let requestSocket: Socket | null = null;
let assignedSocket: Socket | null = null;

/* ================= REQUEST SOCKET ================= */

export const setupRequestSocket = ({
  upsertRequest,
  removeRequest,
  setConnected,
}: RequestSocketDeps): Socket => {
  if (requestSocket) return requestSocket; // ✅ prevent duplicate

  requestSocket = initializeSocket("/workers/requests");

  requestSocket.connect();

  requestSocket.on("connect", () => {
    console.log("[Socket] Request connected:", requestSocket?.id);
    setConnected(true);
  });

  requestSocket.on("disconnect", (reason) => {
    console.log("[Socket] Request disconnected:", reason);
    setConnected(false);
  });

  const onUpsert = (data: any) => {
    const b = normalize(data);
    if (!b) return;
    upsertRequest(b);
  };

  const onRemove = (data: any) => {
    const id = data?.bookingId || data?._id;
    if (!id) return;
    removeRequest(String(id));
  };

  requestSocket.on("booking.created", onUpsert);
  requestSocket.on("booking.updated", onUpsert);
  requestSocket.on("booking.worker.rejected", onRemove);

  return requestSocket;
};

/* ================= ASSIGNED SOCKET ================= */

export const setupAssignedSocket = ({
  upsertAssigned,
  removeAssigned,
  removeRequest,
}: AssignedSocketDeps): Socket => {
  if (assignedSocket) return assignedSocket; // ✅ prevent duplicate

  assignedSocket = initializeSocket("/workers/assigned-updates");

  assignedSocket.connect();

  assignedSocket.on("connect", () => {
    console.log("[Socket] Assigned connected:", assignedSocket?.id);
  });

  assignedSocket.on("disconnect", (reason) => {
    console.log("[Socket] Assigned disconnected:", reason);
  });

  const onUpsert = (data: any) => {
    const b = normalize(data);
    if (!b) return;
    upsertAssigned(b);
    removeRequest(String(b._id));
  };

  const onRemove = (data: any) => {
    const id = data?.bookingId || data?._id;
    if (!id) return;
    removeAssigned(String(id));
  };

  requestSocket?.on("booking.worker.accepted", onUpsert);
  requestSocket?.on("booking.worker.rejected", onRemove);
  assignedSocket.on("booking.worker.accepted", onUpsert);

  assignedSocket.on("booking.work.started", onUpsert);
  assignedSocket.on("booking.work.completed-by-worker", onUpsert);
  assignedSocket.on("booking.completion.confirmed", onUpsert);

  assignedSocket.on("booking.dispute.created", onUpsert);
  assignedSocket.on("booking.dispute.responded", onUpsert);
  assignedSocket.on("booking.dispute.resolved", onUpsert);

  return assignedSocket;
};

/* ================= CLEANUP ================= */

export const disconnectSockets = () => {
  if (requestSocket) {
    requestSocket.disconnect();
    requestSocket = null;
  }

  if (assignedSocket) {
    assignedSocket.disconnect();
    assignedSocket = null;
  }

  console.log("[Socket] All sockets disconnected");
};

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
    console.log("[Socket] Hook initialized");
=======
import { normalizeBooking } from "./normalizeBooking";

export function useBookingSocket() {
  const { upsertRequest, removeRequest, setConnected } =
    useBookingSocketStore();

  useEffect(() => {
    console.log("[Socket] Connecting /workers/requests");

    const socket = initializeSocket("/workers/requests");
    socket.connect();

    socket.on("connect", () => {
      console.log("[Socket] connected:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", (reason: any) => {
      console.log("[Socket] disconnected:", reason);
      setConnected(false);
    });

    const onUpsert = (data: any) => {
      console.log("[Socket] booking.created/updated:", data);

      const b = normalizeBooking(data);
      if (!b) return;

      upsertRequest(b);
    };

    const onRemove = (data: any) => {
      console.log("[Socket] booking removed:", data);

      const id = data?.bookingId || data?._id;
      if (!id) return;

      removeRequest(String(id));
    };

    socket.on("booking.created", onUpsert);
    socket.on("booking.updated", onUpsert);
    socket.on("booking.worker.rejected", onRemove);


    setupRequestSocket({
  upsertRequest,
  removeRequest,
  setConnected,
});

setupAssignedSocket({
  upsertAssigned,
  removeAssigned,
  removeRequest,
});
    return () => {

      console.log("[Socket] Cleaning up sockets");
      disconnectSockets();
    };
  }, [
    upsertRequest,
    removeRequest,
    upsertAssigned,
    removeAssigned,
    setConnected,
  ]);
}

      console.log("[Socket] disconnect cleanup");
      socket.disconnect();
    };
  }, [upsertRequest, removeRequest, setConnected]);
}

