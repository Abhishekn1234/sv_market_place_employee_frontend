import { useEffect } from "react";
import { initializeSocket } from "../components/socket";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
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

    return () => {
      console.log("[Socket] disconnect cleanup");
      socket.disconnect();
    };
  }, [upsertRequest, removeRequest, setConnected]);
}