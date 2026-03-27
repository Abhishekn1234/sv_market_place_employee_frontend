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
import type { GeoPoint } from "@/pages/Profile/domain/entities/location";

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
    className={`w-full h-[100dvh] sm:h-auto sm:max-w-4xl max-h-[100dvh] sm:max-h-[90vh] flex flex-col overflow-hidden rounded-none sm:rounded-2xl ${
      dark
        ? "bg-gray-900 text-gray-100"
        : "bg-gradient-to-br from-white to-gray-50 text-gray-900"
    }`}
  >
    {/* HEADER */}
    <CommonModal.Header
      className={`border-b px-4 sm:px-6 py-4 flex justify-between items-center ${
        dark ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <div className="flex flex-col">
        <h2 className="text-lg sm:text-2xl font-bold">Live Bookings</h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Real-time service requests
        </p>

        <div className="text-xs mt-1">
          {isConnected ? (
            <span className="text-green-500">● Connected</span>
          ) : (
            <span className="text-red-500">● Disconnected</span>
          )}
        </div>
      </div>

      <Button
        onClick={onClose}
        className="p-2 rounded-lg sm:rounded-xl"
      >
        <X />
      </Button>
    </CommonModal.Header>

    {/* BODY */}
    <CommonModal.Body className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <Clock className="h-12 w-12 text-gray-400" />
          <p className="text-gray-500 text-sm">Waiting for bookings…</p>

          {isConnected && (
            <Button onClick={handleReload}>Reload</Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bookings.map((booking) => {
  const accepting =
  isPending && selectedBooking === booking._id;

// ✅ Extract lat/lng from GeoPoint
let lat: number | null = null;
let lng: number | null = null;

const loc = booking.location as GeoPoint | string | undefined;

try {
  if (typeof loc === "string") {
    // format: "lat,lng"
    const [latVal, lngVal] = loc.split(",").map(Number);
    lat = latVal;
    lng = lngVal;
  } else if (loc?.type === "Point") {
    // ✅ YOUR FORMAT: [lat, lng]
    const [latVal, lngVal] = loc.coordinates;
    lat = latVal;
    lng = lngVal;
  }
} catch (err) {
  console.error("Invalid location format", err);
}

  const handleDirections = () => {
    if (!lat || !lng) return;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div
      key={booking._id}
      className={`border rounded-xl p-4 shadow-sm flex flex-col justify-between ${
        dark
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      {/* 🔹 Title */}
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-semibold text-base break-words">
          {booking.service?.name}
        </h3>
        <Badge>{booking.status}</Badge>
      </div>

      <p className="text-xs text-gray-500 mb-2 break-words">
        {booking.serviceTier?.displayName}
      </p>

      {/* 🔹 Info */}
      <div className="space-y-2 text-sm">
        <div className="flex gap-2">
          <User className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{booking.customer?.fullName}</span>
        </div>

        <div className="flex gap-2">
          <Phone className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{booking.customer?.phone}</span>
        </div>

        <div className="flex gap-2">
          <DollarSign className="h-4 w-4 mt-0.5 shrink-0" />
          <span>SAR {booking.amount}</span>
        </div>
      </div>

      {/* 🔹 ACTIONS */}
      <div className="mt-4 space-y-2">
        
        {/* 📍 Get Directions */}
        {lat && lng && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleDirections}
          >
            📍 Get Directions
          </Button>
        )}

        {/* Accept / Ignore */}
        {booking.status !== "WORKER_CANCELLED" && (
          <div className="flex flex-col gap-2">
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
              className="w-full bg-green-500 text-white py-2 rounded-lg disabled:opacity-60"
            >
              {accepting ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Accept"
              )}
            </button>

            <button
              onClick={() => removeBooking(booking._id)}
              className="w-full border border-gray-300 py-2 rounded-lg text-gray-700"
            >
              Ignore
            </button>
          </div>
        )}
      </div>
    </div>
  );
})}
        </div>
      )}
    </CommonModal.Body>

    {/* FOOTER */}
    <CommonModal.Footer className="border-t px-4 sm:px-6 py-3 text-xs sm:text-sm flex justify-between">
      {bookings.length === 0 ? (
        <Button onClick={handleReload}>Reload</Button>
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