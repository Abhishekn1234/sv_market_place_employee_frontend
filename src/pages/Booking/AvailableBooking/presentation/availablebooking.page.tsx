"use client";

import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useAccept } from "@/core/Websocket/presentation/hooks/useAccept";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useNavigate } from "react-router-dom";
import { useAvailableBookings } from "@/core/Websocket/presentation/hooks/useGet";
import { toast } from "react-toastify";
import AvailableBookingGrid from "./components/AvailableBookingGrid";
import { BookingEvents } from "@/components/common/BookingEvents";
import { getSocket, initializeSocket } from "@/core/Websocket/presentation/components/socket";


const BOOKING_NAMESPACE = "/workers/requests";

const idOf = (b: any) => (b?.booking ?? b)?._id;

const REMOVE_EVENTS = [
  BookingEvents.ASSIGNED,
  BookingEvents.WORKER_ACCEPTED,
  BookingEvents.EXPIRED,
  BookingEvents.CANCELLED_BY_CUSTOMER,
  BookingEvents.CANCELLED_BY_WORKER,
  BookingEvents.COORDINATOR_ASSIGNED_WORKER,
];

export default function AvailableBookingPage() {
  const { translations, language, t } = useLanguage();
  const isRTL = language === "AR";
  const navigate = useNavigate();

  const { data: categories } = useServiceCategory();
  const { mutate: acceptWork, isPending } = useAccept();
  const { bookings: apiBookings } = useAvailableBookings();

  const [liveBookings, setLiveBookings] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Hydrate from API once on load / reload
  useEffect(() => {
    if (apiBookings?.length) setLiveBookings(apiBookings);
  }, [apiBookings]);

  // Live socket updates drive everything after that
  useEffect(() => {
    const socket = getSocket(BOOKING_NAMESPACE) ?? initializeSocket(BOOKING_NAMESPACE);

    const add = (payload: any) => {
      const booking = payload.booking ?? payload;
      const id = idOf(booking);
      if (!id) return;
      setLiveBookings((prev) => (prev.some((b) => idOf(b) === id) ? prev : [booking, ...prev]));
    };

    const remove = (payload: any) => {
      const id = idOf(payload);
      if (!id) return;
      setLiveBookings((prev) => prev.filter((b) => idOf(b) !== id));
    };

    socket.on(BookingEvents.CREATED, add);
    REMOVE_EVENTS.forEach((event) => socket.on(event, remove));

    return () => {
      socket.off(BookingEvents.CREATED, add);
      REMOVE_EVENTS.forEach((event) => socket.off(event, remove));
    };
  }, []);

  const categoryMap = useMemo(() => {
    if (!categories) return {};
    return Object.fromEntries(categories.map((c) => [c._id, c.name]));
  }, [categories]);

  const getLatLng = (location?: { type: "Point"; coordinates: number[] }) => {
    if (!location?.coordinates || location.coordinates.length < 2) return null;
    const [lng, lat] = location.coordinates;
    return { lat, lng };
  };

  const visibleBookings = liveBookings.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(8);
    setHasMore(liveBookings.length > 8);
  }, [liveBookings.length]);

  useEffect(() => {
    const handleScroll = () => {
      const isNearBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 200;

      if (!isNearBottom || loadingMore || !hasMore) return;

      setLoadingMore(true);
      setTimeout(() => {
        setVisibleCount((prev) => {
          const next = prev + 4;
          if (next >= liveBookings.length) setHasMore(false);
          return Math.min(next, liveBookings.length);
        });
        setLoadingMore(false);
      }, 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [liveBookings.length, loadingMore, hasMore]);

  const handleAccept = (booking: any) => {
    const bookingId = booking._id;
    acceptWork(
      { bookingId, bookingStatus: "WORKER_ACCEPTED" },
      {
        onSuccess: () => {
          setLiveBookings((prev) => prev.filter((b) => idOf(b) !== bookingId));
          navigate("/availableWork");
        },
        onError: (err) => console.error("Failed to accept booking", err),
      }
    );
  };

  const handleIgnore = (bookingId: string) => {
    setLiveBookings((prev) => prev.filter((b) => idOf(b) !== bookingId));
    toast.success("Booking hidden");
  };

  return (
    <AvailableBookingGrid
      normalizedBookings={liveBookings}
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