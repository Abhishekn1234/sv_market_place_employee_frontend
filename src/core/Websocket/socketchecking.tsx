"use client";

import { useEffect, useRef, useState } from "react";
import { CommonModal } from "@/components/common/CommonModal";
import { useAccept } from "./presentation/hooks/useAccept";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { parseLocation } from "./presentation/utils/locationparser";
import { BookingCard } from "./presentation/components/BookingCard";
import { X } from "lucide-react";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";

export default function SocketBookingsModal({
  open,
  onClose,
  onBookingAccepted,
}: any) {
  const { mutate: acceptBooking, isPending } = useAccept();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const dark = theme === "dark";

  const requestBookings = useBookingSocketStore((s) => s.requestBookings);
  console.log(requestBookings);
  const removeRequestBooking = useBookingSocketStore((s) => s.removeRequest);

  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  // 🔊 AUDIO
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevCount = useRef(0);

  useEffect(() => {
    audioRef.current = new Audio("/ubereats_ping.mp3");
    audioRef.current.volume = 0.8;
  }, []);

  useEffect(() => {
    const currentCount = requestBookings.length;

    if (currentCount > prevCount.current) {
      audioRef.current?.play().catch(() => {
        console.log("Autoplay blocked until user interacts");
      });
    }

    prevCount.current = currentCount;
  }, [requestBookings.length]);

  const handleAccept = (id: string) => {
    setSelectedBooking(id);

    acceptBooking(
      { bookingId: id, bookingStatus: "WORKER_ACCEPTED" },
      {
        onSuccess: () => {
          removeRequestBooking(id);

          setTimeout(() => {
            onClose();
            onBookingAccepted?.();
            navigate("/availableWork");
          }, 100);
        },
      }
    );
  };
const normalizedBookings = requestBookings.map((b: any) => b.booking ?? b);
  if (!open) return null;

  return (
    <CommonModal open={open} onOpenChange={(v) => !v && onClose()}>
      <CommonModal.Content className="flex flex-col h-[100dvh]">

        {/* HEADER */}
        <CommonModal.Header>
          <div className="flex justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Live Bookings</h2>
            <button onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </CommonModal.Header>

        {/* BODY */}
        <CommonModal.Body>
          <div className="p-4">

            {normalizedBookings.length === 0 && (
              <div className="text-center text-gray-500">
                No live bookings
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {normalizedBookings.map((b: any) => {
                const { lat, lng } = parseLocation(b.location);

                return (
                  <BookingCard
                    key={b._id}
                    booking={b}
                    dark={dark}
                    accepting={isPending && selectedBooking === b._id}
                    onAccept={() => handleAccept(b._id)}
                    onDirections={() =>
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${Number(
                          lat
                        )},${Number(lng)}`
                      )
                    }
                  />
                );
              })}
            </div>
          </div>
        </CommonModal.Body>

      </CommonModal.Content>
    </CommonModal>
  );
}