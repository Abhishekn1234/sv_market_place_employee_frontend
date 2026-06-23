import { useEffect, useState } from "react";
import { getSocket, initializeSocket } from "../components/socket";
import { useAuthStore } from "@/core/store/auth";

export function useAssignedWorksSocket() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [works, setWorks] = useState<any[]>([]);

  useEffect(() => {
    if (!accessToken) return;

    let socket = getSocket("/workers/assigned-updates");

    if (!socket) {
      socket = initializeSocket("/workers/assigned-updates");
      socket.auth = { token: accessToken };
      socket.connect();
    }

    // console.log("📡 Socket connected");

    // =========================
    // 🔥 NORMALIZE FUNCTION
    // =========================
    const normalize = (data: any) => {
      if (!data) return null;

      const booking = data.booking || data;

      return {
        _id: booking._id || data.bookingId, // ✅ FIX HERE
        booking,
        status: booking.status,
        workStartedAt: booking.workStartedAt || null,
      };
    };

    // =========================
    // 🟢 UPSERT
    // =========================
    const upsert = (raw: any) => {
      const incoming = normalize(raw);
      if (!incoming?._id) return;

      setWorks((prev) => {
        const exists = prev.some((w) => w._id === incoming._id);

        if (!exists) return [incoming, ...prev];

        return prev.map((w) =>
          w._id === incoming._id
            ? {
                ...w,
                ...incoming,
                booking: {
                  ...w.booking,
                  ...incoming.booking,
                },
              }
            : w
        );
      });
    };

    // =========================
    // 🔴 REMOVE
    // =========================
    const remove = (id: string) => {
      setWorks((prev) => prev.filter((w) => w._id !== id));
    };

    // =========================
    // 📡 EVENTS
    // =========================
    socket.on("booking.worker.accepted", upsert);

    socket.on("booking.worker.rejected", (d: any) =>
      remove(d.bookingId)
    );

    socket.on("booking.work.started", (d: any) =>
      upsert({
        booking: {
          _id: d.bookingId,
          status: "IN_PROGRESS",
          workStartedAt: d.startedAt,
        },
      })
    );

    socket.on("booking.work.completed-by-worker", (d: any) =>
      upsert({
        booking: {
          _id: d.bookingId,
          status: "WORK_COMPLETED_PENDING",
        },
      })
    );

    socket.on("booking.completion.confirmed", (d: any) =>
      upsert({
        booking: {
          _id: d.bookingId,
          status: "COMPLETED",
        },
      })
    );

    // 🔍 DEBUG
    socket.onAny((event, data) => {
      console.log("📡 EVENT:", event);
      console.log("📦 DATA:", data);
    });

    return () => {
      socket.off("booking.worker.accepted", upsert);
      socket.off("booking.worker.rejected");
      socket.off("booking.work.started");
      socket.off("booking.work.completed-by-worker");
      socket.off("booking.completion.confirmed");
    };
  }, [accessToken]);

  return works;
}