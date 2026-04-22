"use client";

import { useEffect, useState } from "react";
import { CommonModal } from "@/components/common/CommonModal";
import { useAccept } from "./presentation/hooks/useAccept";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { parseLocation } from "./presentation/utils/locationparser";
import { BookingCard } from "./presentation/components/BookingCard";
import { X } from "lucide-react";

import { getSocket, initializeSocket } from "./presentation/components/socket";
import { useBookingSocketStore } from "../store/useBookingSocketStore";

type Props = {
  open: boolean;
  onClose: () => void;
  onBookingAccepted?: () => void;
};

export default function SocketBookingsModal({
  open,
  onClose,
  onBookingAccepted,
}: Props) {
  const { mutate: acceptBooking, isPending } = useAccept();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dark = theme === "dark";

  /* ================= STORE ================= */
  const bookings = useBookingSocketStore((s) => s.bookings);
  const upsertBooking = useBookingSocketStore((s) => s.upsertBooking);
  const removeBooking = useBookingSocketStore((s) => s.removeBooking);
  const connected = useBookingSocketStore((s) => s.connected);

  const isConnected = connected;

  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  /* ================= DEBUG (IMPORTANT) ================= */
  useEffect(() => {
    console.log("📦 MODAL OPEN:", open);
    console.log("📦 BOOKINGS:", bookings);
  }, [open, bookings]);

  /* ================= NORMALIZER ================= */
  const normalizeBooking = (payload: any) => {
    if (!payload) return null;
    return payload.booking ?? payload;
  };

  /* ================= SOCKET ================= */
  useEffect(() => {
    const socket =
      getSocket("/workers/requests") ||
      initializeSocket("/workers/requests");

    if (!socket) return;

    socket.connect();

    console.log("📡 Worker socket connected");

    const upsert = (data: any) => {
      const booking = normalizeBooking(data);

      if (!booking?._id) {
        console.warn("❌ Invalid booking:", data);
        return;
      }

      upsertBooking({
        ...booking,
        source: "socket",
      });
    };

    const remove = (data: any) => {
      const id = data?.bookingId || data?._id;
      if (!id) return;

      removeBooking(id);
    };

    socket.on("booking.created", upsert);
    socket.on("booking.updated", upsert);
    socket.on("booking.worker.accepted", upsert);

    socket.on("booking.worker.rejected", remove);
    socket.on("booking.cancelled", remove);

    socket.onAny((event, data) => {
      console.log("📡 EVENT:", event, data);
    });

    return () => {
      socket.off("booking.created", upsert);
      socket.off("booking.updated", upsert);
      socket.off("booking.worker.accepted", upsert);
      socket.off("booking.worker.rejected", remove);
      socket.off("booking.cancelled", remove);

      socket.disconnect();
    };
  }, [upsertBooking, removeBooking]);

  /* ================= ACCEPT ================= */
  const handleAccept = (id: string) => {
  setSelectedBooking(id);

  acceptBooking(
    { bookingId: id, bookingStatus: "WORKER_ACCEPTED" },
    {
      onSuccess: () => {
        // ✅ Optimistic / immediate UI update
        upsertBooking({
          _id: id,
          bookingStatus: "WORKER_ACCEPTED",
          status:"WORKER_ACCEPTED",
          source: "local-update",
        });

        onClose();
        onBookingAccepted?.();
        navigate("/availableWork");
      },
    }
  );
};

  /* ================= SAFETY CHECK (IMPORTANT FIX) ================= */
  if (!open) return null;

  /* ================= UI ================= */
  return (
    <CommonModal open={open} onOpenChange={(v) => !v && onClose()}>
      <CommonModal.Content className="flex flex-col h-[100dvh]">

        {/* HEADER */}
        <CommonModal.Header>
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Live Bookings</h2>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <X size={18} />
            </button>
          </div>
        </CommonModal.Header>

        {/* BODY */}
        <CommonModal.Body>
          <div className="flex-1 overflow-y-auto p-4">

            {bookings.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                No live bookings
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bookings.map((b) => {
                const { lat, lng } = parseLocation(b.location);
                const accepting =
                  isPending && selectedBooking === b._id;

                return (
                  <BookingCard
                    key={b._id}
                    booking={b}
                    dark={dark}
                    accepting={accepting}
                    onNavigate={() => navigate("/availableWork")}
                    onIgnore={() => removeBooking(b._id)}
                    onDirections={() => {
                      if (!lat || !lng) return;

                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
                      );
                    }}
                    onAccept={() => handleAccept(b._id)}
                  />
                );
              })}
            </div>
          </div>
        </CommonModal.Body>

        {/* FOOTER */}
        <CommonModal.Footer>
          <button className="text-sm opacity-70">
            {isConnected ? "🟢 Live" : "🔴 Disconnected"}
          </button>
        </CommonModal.Footer>

      </CommonModal.Content>
    </CommonModal>
  );
}