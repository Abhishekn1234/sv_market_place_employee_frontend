"use client";

import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useAccept } from "@/core/Websocket/presentation/hooks/useAccept";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useNavigate } from "react-router-dom";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import { useAvailableBookings } from "@/core/Websocket/presentation/hooks/useGet";
import { toast } from "react-toastify";
import AvailableBookingGrid from "./components/AvailableBookingGrid";


export default function AvailableBookingPage() {
  const { translations, language, t } = useLanguage();
  const isRTL = language === "AR";
  const navigate = useNavigate();

  const { data: categories } = useServiceCategory();
  const { mutate: acceptWork, isPending } = useAccept();
  const { bookings: apiBookings } = useAvailableBookings();

  const socketBookings = useBookingSocketStore((state) => state.requestBookings);
  const removeBooking = useBookingSocketStore((state) => state.removeRequest);
  const upsertAssigned = useBookingSocketStore((state) => state.upsertAssigned);

  const [ignoredIds, setIgnoredIds] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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
      if (!merged.find((b: any) => b._id === booking._id)) {
        merged.unshift(booking);
      }
    });
    return merged.filter((b: any) => !ignoredIds.includes(b._id));
  }, [apiBookings, socketBookings, ignoredIds]);

  useEffect(() => {
    setVisibleCount(8);
    setHasMore(true);
  }, [normalizedBookings.length]);

  useEffect(() => {
    const handleScroll = () => {
      const isNearBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 200;

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
      { bookingId, bookingStatus: "WORKER_ACCEPTED" },
      {
        onSuccess: (data: any) => {
          const acceptedBooking = data?.booking ?? data;
          upsertAssigned({ ...booking, ...acceptedBooking, _id: bookingId, status: "WORKER_ACCEPTED" });
          removeBooking(bookingId);
          navigate("/availableWork");
        },
        onError: (err) => console.error("Failed to accept booking", err),
      }
    );
  };

  const handleIgnore = (bookingId: string) => {
    setIgnoredIds((prev) => [...prev, bookingId]);
    toast.success("Booking hidden");
  };

  return (
    <AvailableBookingGrid
      normalizedBookings={normalizedBookings}
      visibleBookings={visibleBookings}
      categoryMap={categoryMap}
      loadingMore={loadingMore}
      isPending={isPending}
      isRTL={isRTL}
      translations={translations}
      t={t}
      getLatLng={getLatLng}
      handleAccept={handleAccept}
      handleIgnore={handleIgnore}
    />
  );
}