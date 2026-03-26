import { useState, useEffect } from "react";
import {
  X,
  Clock,
  User,
  Phone,
  DollarSign,
  Loader2,
} from "lucide-react";

import {  socket } from "./presentation/components/socket";
import { useAvailableBookings } from "./presentation/hooks/useGet";
import { useAccept } from "./presentation/hooks/useAccept";

import { CommonModal } from "@/components/common/CommonModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

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
  const { bookings, removeBooking } = useAvailableBookings();
  const { mutate: acceptBooking, isPending } = useAccept();

  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  

  const { theme } = useTheme();
  const dark = theme === "dark";

  useEffect(() => {
    if (!socket) return;

    const handleNewBooking = (data: any) => {
      console.log("📦 New booking:", data);
    };

    socket.on("new-booking", handleNewBooking);

    return () => {
      socket.off("new-booking", handleNewBooking);
    };
  }, []);

  const handleReload = () => {
    if (!socket?.connected) {
      socket?.connect();
    }
    console.log("🔄 Reload triggered");
  };

  return (
    <CommonModal open={open} onOpenChange={(v) => !v && onClose()}>
     <CommonModal.Content
  className={`w-full max-w-full sm:max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl ${
    dark
      ? "bg-gray-900 text-gray-100"
      : "bg-gradient-to-br from-white to-gray-50 text-gray-900"
  }`}
>
        {/* HEADER */}
        <CommonModal.Header
          className={`border-b px-6 py-5 flex justify-between items-center ${
            dark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold">Live Bookings</h2>
              <p className={dark ? "text-gray-400" : "text-gray-500"}>
                Real-time service requests
              </p>

              {/* ✅ Connection status */}
               <div className="text-sm mt-1">
              {isConnected ? (
                <span className="text-green-500">● Connected</span>
              ) : (
                <span className="text-red-500">● Disconnected</span>
              )}
            </div>
            </div>
          </div>

          <Button
            onClick={onClose}
            className={`p-2 rounded-xl ${
              dark
                ? "bg-gray-800 text-gray-300"
                : "bg-white text-black"
            }`}
          >
            <X />
          </Button>
        </CommonModal.Header>

        {/* BODY */}
        <CommonModal.Body className="p-6">
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Clock className="h-14 w-14 text-gray-400" />
              <p className="text-gray-500">Waiting for bookings…</p>

              {/* ✅ Show reload when connected but empty */}
               {isConnected && (
                <Button onClick={handleReload} className="mt-3">
                  Reload
                </Button>
              )}
            </div>
          ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {bookings.map((booking) => {
                const accepting =
                  isPending && selectedBooking === booking._id;

                return (
                  <div
                        key={booking._id}
                        className={`border rounded-2xl p-4 sm:p-6 shadow w-full min-w-0 ${
                          dark
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                   <div className="flex flex-wrap items-start justify-between gap-2 mb-1 min-w-0">
                                  <h3 className="font-bold text-lg break-words">
                                    {booking.service?.name}
                                  </h3>

                      <Badge className="shrink-0">
                        {booking.status}
                      </Badge>
                    </div>

                    <p className="text-sm mb-3 break-words text-gray-500">
                            {booking.serviceTier?.displayName}
                          </p>

                                      <div className="flex items-start gap-2 text-sm mb-3 min-w-0">
                      <User className="h-4 w-4 shrink-0 mt-0.5" />
                      <span className="break-words">
                        {booking.customer?.fullName}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-sm mb-3 min-w-0">
                      <Phone className="h-4 w-4 shrink-0 mt-0.5" />
                      <span className="break-words">
                        {booking.customer?.phone}
                      </span>
                    </div>

                   <div className="flex items-start gap-2 text-sm mb-4">
                        <DollarSign className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>SAR {booking.amount}</span>
                      </div>

                  {booking.status !== "WORKER_CANCELLED" && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        disabled={accepting}
                        onClick={() => {
                          setSelectedBooking(booking._id);

                          acceptBooking(
                            {
                              bookingId: booking._id,
                              bookingStatus: "WORKER_ACCEPTED",
                            },
                            {
                              onSuccess: () => {
                                removeBooking(booking._id);
                                onClose();
                                onBookingAccepted?.();
                              },
                            }
                          );
                        }}
                        className="w-full sm:flex-1 bg-green-500 text-white py-2 rounded-xl disabled:opacity-60"
                      >
                        {accepting ? (
                          <Loader2 className="animate-spin mx-auto" />
                        ) : (
                          "Accept"
                        )}
                      </button>

                      <button
                        onClick={() => removeBooking(booking._id)}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-300 text-gray-700"
                      >
                        Ignore
                      </button>
                    </div>
                  )}
                  </div>
                );
              })}
            </div>
          )}
        </CommonModal.Body>

        {/* FOOTER */}
        <CommonModal.Footer className="border-t px-6 py-4 text-sm text-gray-500 flex justify-between">
          {bookings.length === 0 ? (
            <Button
              onClick={handleReload}
              className={`px-4 py-1 rounded-lg ${
                dark
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              Reload
            </Button>
          ) : (
            <span>
                 {isConnected ? "Auto refresh" : "Socket disconnected"}
            </span>
          )}
        </CommonModal.Footer>
      </CommonModal.Content>
    </CommonModal>
  );
}