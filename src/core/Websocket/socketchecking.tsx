import { useState } from "react";
import {
  X,
  Clock,
  User,
  Phone,
  DollarSign,
  // Wifi,
  // WifiOff,
  Loader2,
} from "lucide-react";

import { useAvailableBookings } from "./presentation/hooks/useGet";
import { useAccept } from "./presentation/hooks/useAccept";

import { CommonModal } from "@/components/common/CommonModal";

type Props = {
  open: boolean;
  onClose: () => void;
  onBookingAccepted?: () => void; // ✅ callback for parent
};

export default function SocketBookingsModal({
  open,
  onClose,
  onBookingAccepted,
}: Props) {
  const { bookings,  removeBooking } = useAvailableBookings();
  // connected,
  const { mutate: acceptBooking, isPending } = useAccept();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  return (
    <CommonModal open={open} onOpenChange={(v) => !v && onClose()}>
      <CommonModal.Content className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50">
        {/* HEADER */}
        <CommonModal.Header className="border-b px-6 py-5 flex justify-between items-center bg-white/95">
          <div className="flex items-center gap-3">
            {/* {connected ? (
              <Wifi className="text-green-600" />
            ) : (
              <WifiOff className="text-red-600" />
            )} */}
            <div>
              <h2 className="text-2xl font-bold">Live Bookings</h2>
              <p className="text-sm text-gray-500">Real-time service requests</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl">
            <X />
          </button>
        </CommonModal.Header>

        {/* BODY */}
        <CommonModal.Body className="p-6">
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center py-20">
              <Clock className="h-14 w-14 text-gray-400" />
              <p className="mt-4 text-gray-500">Waiting for bookings…</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {bookings.map((booking) => {
                const accepting = isPending && selectedBooking === booking._id;
                return (
                  <div
                    key={booking._id}
                    className="bg-white border rounded-2xl p-6 shadow"
                  >
                    <h3 className="font-bold text-lg">{booking.service?.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {booking.serviceTier?.displayName}
                    </p>

                    <div className="flex gap-2 text-sm mb-3">
                      <User className="h-4 w-4" />
                      {booking.customer?.fullName}
                    </div>

                    <div className="flex gap-2 text-sm mb-3">
                      <Phone className="h-4 w-4" />
                      {booking.customer?.phone}
                    </div>

                    <div className="flex gap-2 text-sm mb-4">
                      <DollarSign className="h-4 w-4" />
                      SAR {booking.amount}
                    </div>

                    <div className="flex gap-3">
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

                                // ✅ Close this modal
                                onClose();

                                // ✅ Open AssignedWorkModal
                                onBookingAccepted?.();
                              },
                            }
                          );
                        }}
                        className="flex-1 bg-green-500 text-white py-2 rounded-xl disabled:opacity-60"
                      >
                        {accepting ? (
                          <Loader2 className="animate-spin mx-auto" />
                        ) : (
                          "Accept"
                        )}
                      </button>

                      <button
                        onClick={() => removeBooking(booking._id)}
                        className="px-4 border rounded-xl"
                      >
                        Ignore
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CommonModal.Body>

        {/* FOOTER */}
        <CommonModal.Footer className="border-t px-6 py-4 text-sm text-gray-500 flex justify-between">
          {/* <span>{connected ? "Socket connected" : "Socket disconnected"}</span> */}
          <span>Auto refresh</span>
        </CommonModal.Footer>
      </CommonModal.Content>
    </CommonModal>
  );
}
