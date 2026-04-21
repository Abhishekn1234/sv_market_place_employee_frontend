import { useEffect } from "react";
import { getSocket } from "../components/socket";
import { useQueryClient } from "@tanstack/react-query";

export function useBookingSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket("/workers/requests");
    if (!socket) return;
    console.log(socket);

    // ✅ NEW BOOKING
    const newBookingHandler = (data: any) => {
      console.log("📦 New booking:", data);

      queryClient.setQueryData(["availableBookings"], (old: any = []) => {
        if (!Array.isArray(old)) return [data];

        const exists = old.some((b: any) => b._id === data._id);
        if (exists) return old;

        return [data, ...old];
      });
    };

    // ✅ BOOKING UPDATED (ACCEPTED / CANCELLED)
    const updateHandler = (data: any) => {
      console.log("🔄 Booking updated:", data);

      if (data.status === "WORKER_ACCEPTED") {
        queryClient.setQueryData(["availableBookings"], (old: any = []) => {
          if (!Array.isArray(old)) return [];

          return old.filter((b: any) => b._id !== data.bookingId);
        });
      }
    };

    socket.on("new-booking", newBookingHandler);
    socket.on("booking-updated", updateHandler);

    return () => {
      socket.off("new-booking", newBookingHandler);
      socket.off("booking-updated", updateHandler);
    };
  }, [queryClient]);
}