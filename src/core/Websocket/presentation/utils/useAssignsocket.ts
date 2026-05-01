import { useEffect } from "react";
import { initializeSocket } from "../components/socket";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import { normalizeBooking } from "./normalizeBooking";

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

    // ✅ CORRECT EVENT MAPPING
    const handleUpdate = (data: any) => {
      const booking = normalizeBooking(data);
      if (!booking) return;

      upsertAssigned(booking); // 🔥 triggers UI update
    };

    const handleRemove = (data: any) => {
      const id = data?.bookingId || data?._id;
      if (!id) return;

      removeAssigned(id);
    };

    socket.on("booking.worker.accepted", handleUpdate);
    socket.on("booking.worker.rejected", handleRemove);

    socket.on("booking.work.started", handleUpdate);
    socket.on("booking.work.completed-by-worker", handleUpdate);

    socket.on("booking.completion.confirmed", handleUpdate);

    socket.on("booking.dispute.created", handleUpdate);
    socket.on("booking.dispute.responded", handleUpdate);
    socket.on("booking.dispute.resolved", handleUpdate);

    return () => {
      socket.disconnect();
    };
  }, [upsertAssigned, removeAssigned, setConnected]);
}