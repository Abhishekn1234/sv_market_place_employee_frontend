"use client";

import { useEffect } from "react";
import { getSocket, initializeSocket } from "../components/socket";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";

export function useBookingSocket() {
  const { upsertBooking, removeBooking, setConnected } =
    useBookingSocketStore();

  useEffect(() => {
    const socket =
      getSocket("/workers/requests") ||
      initializeSocket("/workers/requests");

    if (!socket) return;

    socket.connect();

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    /* ✅ NORMALIZE SAFELY */
    const normalize = (data: any) => data?.booking ?? data;

    /* ✅ UPSERT */
    const upsert = (data: any) => {
      const booking = normalize(data);

      if (!booking?._id) {
        console.warn("❌ Invalid booking payload:", data);
        return;
      }

      upsertBooking({
        ...booking,
        source: "socket",
      });
    };

    /* ❌ REMOVE */
    const remove = (data: any) => {
      const id = data?.bookingId || data?._id;
      if (!id) return;

      removeBooking(id);
    };

    /* ✅ EVENTS */
    const eventsUpsert = [
      "booking.created",
      "booking.updated",
      "booking.worker.accepted",
      "booking.work.started",
      "booking.work.completed-by-worker",
      "booking.completion.confirmed",
      "booking.dispute.created",
      "booking.dispute.responded",
      "booking.dispute.resolved",
    ];

    const eventsRemove = [
      "booking.worker.rejected",
      "booking.cancelled",
    ];

    /* REGISTER */
    eventsUpsert.forEach((e) => socket.on(e, upsert));
    eventsRemove.forEach((e) => socket.on(e, remove));

    socket.onAny((event, data) => {
      console.log("📡 SOCKET EVENT:", event, data);
    });

    return () => {
      eventsUpsert.forEach((e) => socket.off(e, upsert));
      eventsRemove.forEach((e) => socket.off(e, remove));
      socket.disconnect();
    };
  }, [upsertBooking, removeBooking, setConnected]);
}