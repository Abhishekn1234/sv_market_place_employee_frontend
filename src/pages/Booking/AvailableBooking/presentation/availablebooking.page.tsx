"use client";

import { useState, useMemo, useEffect } from "react";
import { CommonCard } from "@/components/common/CommonCard";
import { useLanguage } from "@/context/LanguageContext";
import { useAccept } from "@/core/Websocket/presentation/hooks/useAccept";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useNavigate } from "react-router-dom";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import { formatScheduleDate } from "./helpers/formatScheduledatetime";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useAvailableBookings } from "@/core/Websocket/presentation/hooks/useGet";
export default function AvailableBookingPage() {
  const { translations, language, t } = useLanguage();
  const isRTL = language === "AR";

  const navigate = useNavigate();

  const { data: categories } = useServiceCategory();
  const { mutate: acceptWork, isPending } = useAccept();

  const [visibleCount, setVisibleCount] = useState(8);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const {
    bookings: apiBookings,
  } = useAvailableBookings();

  const socketBookings = useBookingSocketStore(
    (state) => state.requestBookings
  );

  const removeBooking = useBookingSocketStore((state) => state.removeRequest);
  const upsertAssigned = useBookingSocketStore((state) => state.upsertAssigned);

  const [ignoredIds, setIgnoredIds] = useState<string[]>([]);

  const categoryMap = useMemo(() => {
    if (!categories) return {};
    return Object.fromEntries(categories.map((c) => [c._id, c.name]));
  }, [categories]);

  const getLatLng = (location?: { type: "Point"; coordinates: number[] }) => {
    if (!location?.coordinates || location.coordinates.length < 2) return null;
    const [lng, lat] = location.coordinates;
    return { lat, lng };
  };

  const normalizedBookings = useMemo(() => {
    const merged = [...apiBookings];

    socketBookings.forEach((socketBooking: any) => {
      const booking = socketBooking.booking ?? socketBooking;

      const exists = merged.find((b: any) => b._id === booking._id);

      if (!exists) {
        merged.unshift(booking);
      }
    });

    return merged.filter((b: any) => !ignoredIds.includes(b._id));
  }, [apiBookings, socketBookings, ignoredIds]);

  // ✅ RESET when data changes
  useEffect(() => {
    setVisibleCount(8);
    setHasMore(true);
  }, [normalizedBookings.length]);

  // ✅ INFINITE SCROLL
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      const isNearBottom = scrollTop + windowHeight >= fullHeight - 200;

      if (!isNearBottom || loadingMore || !hasMore) return;

      setLoadingMore(true);

      setTimeout(() => {
        setVisibleCount((prev) => {
          const next = prev + 4;

          if (next >= normalizedBookings.length) {
            setHasMore(false);
            return normalizedBookings.length;
          }

          return next;
        });

        setLoadingMore(false);
      }, 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [normalizedBookings.length, loadingMore, hasMore]);

  const visibleBookings = normalizedBookings.slice(0, visibleCount);

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

          removeBooking(bookingId);

          navigate("/availableWork");
        },
        onError: (err) => {
          console.error("Failed to accept booking", err);
        },
      }
    );
  };

  const handleIgnore = (bookingId: string) => {
    setIgnoredIds((prev) => [...prev, bookingId]);
    toast.success("Booking hidden");
  };

  return (
    <div className="mt-8 px-4 lg:px-6">
      <CommonCard
        title={
          translations?.sidebar?.availableBooking || "Available Booking"
        }
        
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
              {visibleBookings.map((booking: any) => {
                const coords = getLatLng(booking.location);
                 const isScheduled =
                 String(booking.bookingType).toUpperCase().includes("SCHEDULE");
                return (
                <CommonCard
                  key={booking._id}
                  className="relative flex flex-col rounded-xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all"
                >

                  {/* HEADER */}
                  <div className="p-2 border-b">
                    <h3 className="font-semibold text-sm line-clamp-1">
                      {booking.service?.name || "-"}
                    </h3>

                    <p className="text-[13px] text-muted-foreground">
                      {booking.service?.category ? categoryMap[booking.service.category] : "-"}
                    </p>
                  </div>

                  {/* BODY */}
                  <div className="p-2 space-y-2 text-[13px]">

                    {/* CUSTOMER */}
                    <div className="rounded-md bg-muted/30 p-2 space-y-1">
                      <p className="text-[13px] font-semibold text-muted-foreground uppercase">
                        {t("availableBooking.customer")}
                      </p>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("availableBookings.name")}</span>
                        <span className="font-medium text-right">
                          {booking.customer?.fullName || "-"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("availableBookings.email")}</span>
                        <span className="text-right break-all max-w-[160px]">
                          {booking.customer?.email || "-"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("availableBookings.phone")}</span>
                        <span className="text-right">
                          {booking.customer?.phone || "-"}
                        </span>
                      </div>

                      {booking.customer?.phone && (
                        <a
                          href={`tel:${booking.customer.phone}`}
                          className="mt-1 block text-center bg-green-600 text-white rounded-md py-1 text-[13px]"
                        >
                          📞 {t("availableBookings.callCustomer")}
                        </a>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="space-y-1">

                      {/* Estimated */}
                      {(booking.schedule?.estimatedHours || booking.schedule?.estimatedDays) && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {booking.schedule?.estimatedDays
                              ? t("availableBookings.EstimatedDays")
                              : t("availableBookings.EstimatedHours")}
                          </span>

                          <span className="font-medium text-blue-600">
                            {booking.schedule?.estimatedDays
                              ? `${booking.schedule.estimatedDays} days`
                              : `${booking.schedule.estimatedHours} hrs`}
                          </span>
                        </div>
                      )}

                      {/* Type */}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("availableBooking.bookingType")}
                        </span>
                        <span className="font-medium">
                          {booking.bookingType || "-"}
                        </span>
                      </div>

                      {/* Earnings */}
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground uppercase text-[13px]">
                          {t("availableBookings.You Earn")}
                        </span>

                        <span className="font-semibold text-green-600">
                          {booking.currency} {booking.workerPoolAmount ?? 0}
                        </span>
                      </div>

                      {/* NOTE */}
                      <p className="text-[13px] text-muted-foreground">
                        {t("availableBookings.hourlyNote")}
                      </p>

                      {/* DATE */}
                      {isScheduled && (
                        <div className="flex justify-between border-t pt-1">
                          <span className="text-muted-foreground">
                            {t("common.date")}
                          </span>

                          <span className="font-medium">
                            {formatScheduleDate(booking.schedule?.startDateTime)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* MAP */}
                    {coords && (
                      <Button
                      variant="ghost"
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`,
                            "_blank"
                          )
                        }
                        className="w-full flex items-center justify-center gap-1 border rounded-md py-1 text-[13px]"
                      >
                        📍 {t("availableBooking.getDirections")}
                      </Button>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="p-2 border-t grid grid-cols-2 gap-1">

                    <Button
                      disabled={isPending}
                      onClick={() => handleAccept(booking)}
                      className="h-7 text-[13px]"
                    >
                      {t("common.accept")}
                    </Button>

                    <Button
                      onClick={() => handleIgnore(booking._id)}
                      className="h-7 text-[13px] dark:bg-slate-800"
                    >
                      {t("common.ignore")}
                    </Button>

                  </div>

                </CommonCard>
                );
              })}
            </div>

            {/* Spinner */}
            {loadingMore && (
              <div className="flex justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
              </div>
            )}
          </>
        )}
      </CommonCard>
    </div>
  );
}