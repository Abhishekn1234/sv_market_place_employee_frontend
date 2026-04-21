import { useEffect } from "react";
import { getSocket } from "../components/socket";
import { useQueryClient } from "@tanstack/react-query";

export function useBookingSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket("/workers/requests");

    if (!socket) {
      console.warn("Socket not initialized");
      return;
    }

    console.log("📡 Booking socket active:", socket);

    // -----------------------------
    // 🆕 NEW BOOKING
    // -----------------------------
    const newBookingHandler = (data: any) => {
      const booking = data?.booking;
      if (!booking?._id) return;

      queryClient.setQueryData(["availableBookings"], (old: any = []) => {
        if (!Array.isArray(old)) return [booking];

        const exists = old.some((b: any) => b._id === booking._id);
        if (exists) return old;

        return [booking, ...old];
      });
    };

    // -----------------------------
    // 🔄 UPDATE BOOKING
    // -----------------------------
    const bookingUpdatedHandler = (data: any) => {
      const booking = data?.booking || data;
      if (!booking?._id) return;

      queryClient.setQueryData(["availableBookings"], (old: any = []) => {
        if (!Array.isArray(old)) return old;

        return old.map((b: any) =>
          b._id === booking._id ? { ...b, ...booking } : b
        );
      });
    };

    // -----------------------------
    // ❌ CANCELLED
    // -----------------------------
    const bookingCancelledHandler = (data: any) => {
      const bookingId = data?.bookingId || data?.booking?._id;

      queryClient.setQueryData(["availableBookings"], (old: any = []) => {
        if (!Array.isArray(old)) return old;

        return old.filter((b: any) => b._id !== bookingId);
      });
    };

    // -----------------------------
    // 👷 ACCEPTED
    // -----------------------------
    const workerAcceptedHandler = (data: any) => {
      const bookingId = data?.bookingId;

      queryClient.setQueryData(["availableBookings"], (old: any = []) => {
        if (!Array.isArray(old)) return old;

        return old.map((b: any) =>
          b._id === bookingId
            ? { ...b, status: "WORKER_ACCEPTED" }
            : b
        );
      });
    };

    // -----------------------------
    // 🚀 WORK STARTED (IMPORTANT)
    // -----------------------------
    const workStartedHandler = (data: any) => {
      const bookingId = data?.bookingId || data?.booking?._id;

      queryClient.setQueryData(["availableBookings"], (old: any = []) => {
        if (!Array.isArray(old)) return old;

        return old.map((b: any) =>
          b._id === bookingId
            ? {
                ...b,
                status: "IN_PROGRESS",
                workStartedAt: data?.startedAt,
              }
            : b
        );
      });
    };

    // -----------------------------
    // ❌ REJECTED
    // -----------------------------
    const workerRejectedHandler = (data: any) => {
      const bookingId = data?.bookingId;

      queryClient.setQueryData(["availableBookings"], (old: any = []) => {
        if (!Array.isArray(old)) return old;

        return old.filter((b: any) => b._id !== bookingId);
      });
    };

    // -----------------------------
    // ⚠️ DISPUTES
    // -----------------------------
    const disputeHandler = (data: any) => {
      const bookingId = data?.bookingId;

      queryClient.setQueryData(["availableBookings"], (old: any = []) => {
        if (!Array.isArray(old)) return old;

        return old.map((b: any) =>
          b._id === bookingId ? { ...b, ...data } : b
        );
      });
    };

    // -----------------------------
    // EVENTS
    // -----------------------------
    socket.on("booking.created", newBookingHandler);
    socket.on("booking.updated", bookingUpdatedHandler);
    socket.on("booking.cancelled", bookingCancelledHandler);

    socket.on("booking.worker.accepted", workerAcceptedHandler);
    socket.on("booking.worker.rejected", workerRejectedHandler);

    socket.on("booking.work.started", workStartedHandler);

    socket.on("booking.dispute.created", disputeHandler);
    socket.on("booking.dispute.responded", disputeHandler);
    socket.on("booking.dispute.resolved", disputeHandler);

    // -----------------------------
    // CLEANUP
    // -----------------------------
    return () => {
      socket.off("booking.created", newBookingHandler);
      socket.off("booking.updated", bookingUpdatedHandler);
      socket.off("booking.cancelled", bookingCancelledHandler);

      socket.off("booking.worker.accepted", workerAcceptedHandler);
      socket.off("booking.worker.rejected", workerRejectedHandler);

      socket.off("booking.work.started", workStartedHandler);

      socket.off("booking.dispute.created", disputeHandler);
      socket.off("booking.dispute.responded", disputeHandler);
      socket.off("booking.dispute.resolved", disputeHandler);
    };
  }, [queryClient]);
}