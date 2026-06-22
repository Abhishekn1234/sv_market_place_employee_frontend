import { CommonCard } from "@/components/common/CommonCard";
import CommonSpinner from "@/components/common/CommonSpinner";
import AvailableBookingCard from "./AvailableBookingCard";

interface Props {
  normalizedBookings: any[];
  visibleBookings: any[];
  categoryMap: Record<string, string>;
  loadingMore: boolean;
  isPending: boolean;
  isRTL: boolean;
  translations: any;
  t: (key: string) => string;
  getLatLng: (location?: { type: "Point"; coordinates: number[] }) => { lat: number; lng: number } | null;
  handleAccept: (booking: any) => void;
  handleIgnore: (id: string) => void;
}

export default function AvailableBookingGrid({
  normalizedBookings,
  visibleBookings,
  categoryMap,
  loadingMore,
  isPending,
  isRTL,
  translations,
  t,
  getLatLng,
  handleAccept,
  handleIgnore,
}: Props) {
  return (
    <div className="mt-8 px-4 lg:px-6">
      <CommonCard
        title={translations?.sidebar?.availableBooking || "Available Booking"}
        headerAlign={isRTL ? "right" : "left"}
      >
        {normalizedBookings.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            {translations?.common?.noData || "No bookings available"}
          </div>
        )}

        {normalizedBookings.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
              {visibleBookings.map((booking: any) => (
                <AvailableBookingCard
                  key={booking._id}
                  booking={booking}
                  categoryMap={categoryMap}
                  isPending={isPending}
                  t={t}
                  getLatLng={getLatLng}
                  handleAccept={handleAccept}
                  handleIgnore={handleIgnore}
                />
              ))}
            </div>

            {loadingMore && (
              <div className="flex justify-center py-10">
                <CommonSpinner />
              </div>
            )}
          </>
        )}
      </CommonCard>
    </div>
  );
}