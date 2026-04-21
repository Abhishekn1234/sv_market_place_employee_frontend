import { useState } from "react";

import { useAvailableBookings } from "./presentation/hooks/useGet";
import { useAccept } from "./presentation/hooks/useAccept";

import { CommonModal } from "@/components/common/CommonModal";

import { useTheme } from "@/context/ThemeContext";

import { useNavigate } from "react-router-dom";
import { useBookingSocket } from "./presentation/utils/socketlogic";
import { parseLocation } from "./presentation/utils/locationparser";
import { BookingCard } from "./presentation/components/BookingCard";
import { X } from "lucide-react";
import { getSocket } from "./presentation/components/socket";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  open: boolean;
  onClose: () => void;
  onBookingAccepted?: () => void;
  isConnected: boolean; 
};

export default function SocketBookingsModal({
  open,
  onClose,
  onBookingAccepted,
  isConnected,
}: Props) {
 const { bookings, removeBooking,  refetch } =
  useAvailableBookings();
  const { mutate: acceptBooking, isPending } = useAccept();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

 useBookingSocket();

  const handleAccept = (id: string) => {
  setSelectedBooking(id);

  acceptBooking(
    { bookingId: id, bookingStatus: "WORKER_ACCEPTED" },
    {
      onSuccess: () => {
        // 1. instant UI update (remove from list immediately)
        queryClient.setQueryData(["availableBookings"], (old: any = []) =>
          old.filter((b: any) => b._id !== id)
        );

        // 2. optional: notify other devices via socket
        const socket = getSocket("/workers/requests");
        socket?.emit("booking.worker.accepted", { bookingId: id });

        // 3. UI actions
        onClose();
        onBookingAccepted?.();
        navigate("/availableWork");
      },
    }
  );
};

  const handleReload = () => refetch();

  return (
    <CommonModal open={open} onOpenChange={(v) => !v && onClose()}>
      <CommonModal.Content className="flex flex-col h-[100dvh]">
        <CommonModal.Header>
         
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Live Bookings</h2>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
              <X size={18} />
            </button>
          </div>


        </CommonModal.Header>

        <CommonModal.Body>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {bookings.map((b) => {
                const { lat, lng } = parseLocation(b.location);
                const accepting = isPending && selectedBooking === b._id;

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

        <CommonModal.Footer>
          <button onClick={handleReload}>
            {isConnected ? "Auto refresh" : "Socket disconnected"}
          </button>
        </CommonModal.Footer>
      </CommonModal.Content>
    </CommonModal>
  );
}