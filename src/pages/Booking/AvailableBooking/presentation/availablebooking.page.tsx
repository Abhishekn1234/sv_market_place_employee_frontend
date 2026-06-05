"use client";

import { useState, useMemo } from "react";
import { CommonCard } from "@/components/common/CommonCard";
import { useLanguage } from "@/context/LanguageContext";
import { useAvailableBookings } from "@/core/Websocket/presentation/hooks/useGet";
import { useAccept } from "@/core/Websocket/presentation/hooks/useAccept";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useNavigate } from "react-router-dom";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";

export default function AvailableBookingPage() {
  const { translations, language, t } = useLanguage();
  const isRTL = language === "AR";

  const { data: categories } = useServiceCategory();
  const { bookings, removeBooking } = useAvailableBookings();
  const { mutate: acceptWork, isPending } = useAccept();
  const upsertAssigned = useBookingSocketStore((state) => state.upsertAssigned);
  const removeRequest = useBookingSocketStore((state) => state.removeRequest);

  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 8;
  const navigate = useNavigate();

  const categoryMap = useMemo(() => {
    if (!categories) return {};
    return Object.fromEntries(categories.map((c) => [c._id, c.name]));
  }, [categories]);
  const getLatLng = (location?: {
  type: "Point";
  coordinates: number[];
}) => {
  if (!location?.coordinates || location.coordinates.length < 2) {
    return null;
  }

  const [lng, lat] = location.coordinates;

  return { lat, lng };
};



  const visibleBookings = showAll ? bookings : bookings.slice(0, 8);
  const totalPages = Math.ceil(visibleBookings.length / limit);
  const start = (page - 1) * limit;
  const paginated = visibleBookings.slice(start, start + limit);

  const handleAccept = (booking: any) => {
    const bookingId = booking._id;

    acceptWork(
      {
        bookingId,
        bookingStatus: "WORKER_ACCEPTED",
      },
      {
        onSuccess: (data: any) => {
          const acceptedBooking = data?.booking ?? data;

          upsertAssigned({
            ...booking,
            ...acceptedBooking,
            _id: bookingId,
            status: "WORKER_ACCEPTED",
          });
          removeRequest(bookingId);
          removeBooking(bookingId);
          navigate("/availableWork");
        },
        onError: (err) => {
          console.error("Failed to accept work", err);
        },
      }
    );
  };

  const handleIgnore = (bookingId: string) => {
    removeBooking(bookingId);
  };

  return (
    <div className="mt-8 px-4 lg:px-6">
      <CommonCard
        title={translations?.sidebar.availableBooking || "Available Booking"}
        headerAlign={isRTL ? "right" : "left"}
      >
        {/* SEE ALL BUTTON */}
        {bookings.length > 8 && !showAll && (
          <div className={`flex justify-end mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <button
              onClick={() => setShowAll(true)}
              className="text-primary font-medium hover:underline text-sm"
            >
              {t("common.seeAll")}
            </button>
          </div>
        )}

        {/* NO DATA */}
        {bookings.length === 0 && (
          <div className="text-center py-16 text-gray-500">{translations.common.noData}</div>
        )}

        {/* BOOKINGS GRID */}
        {bookings.length > 0 && (
         
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginated.map((booking) => {
                const status = booking.status?.trim()?.toUpperCase();
                 const coords = getLatLng(booking.location);
                return (
                  <CommonCard
                    key={booking._id}
                    className="flex flex-col justify-between shadow-sm hover:shadow-lg transition p-4"
                    contentClassName="space-y-2"
                  >
                    {/* BOOKING DETAILS */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-base">
                        {booking.service?.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {t("availableBooking.customer")}: {booking.customer?.fullName || "-"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {t("availableBooking.tier")}: {booking.serviceTier?.displayName || "-"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {t("availableBooking.bookingType")}: {booking.bookingType || "-"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {t("availableBooking.pricing")}: {booking.pricingMode || "-"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {t("availableBooking.status")}: {booking.status || "-"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {t("availableBooking.serviceCategory")}:{" "}
                        {booking.service?.category
                          ? categoryMap[booking.service.category]
                          : "-"}
                      </p>
                    </div>
                  
                      {coords && (
                        <button
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`,
                              "_blank"
                            )
                          }
                          className="w-full border mt-2 py-2 rounded"
                        >
                          📍 {t("availableBooking.getDirections")}
                        </button>
                      )}
                    {/* ACTIONS */}
                    {status !== "WORKER_CANCELLED" ? (
                      <div className="flex gap-2 pt-4">
                        <button
                          disabled={isPending}
                          onClick={() => handleAccept(booking)}
                          className="flex-1 bg-primary text-white py-2 rounded-lg text-sm disabled:opacity-50"
                        >
                          {t("common.accept")}
                        </button>

                        <button
                          onClick={() => handleIgnore(booking._id)}
                          className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm"
                        >
                          {t("common.ignore")}
                        </button>
                      </div>
                    ) : (
                      <div className="pt-4 text-center text-red-500 text-sm font-medium">
                        {t("availableBooking.cancelledMessage")}
                      </div>
                    )}
                  </CommonCard>
                );
              })}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div
                className={`flex justify-center gap-2 pt-6 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      page === i + 1
                        ? "bg-primary text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </CommonCard>
    </div>
  );
}
