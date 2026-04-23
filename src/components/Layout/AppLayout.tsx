"use client";

import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";

import AppSidebar from "@/components/Layout/AppSidebar";
import AppHeader from "@/components/Layout/AppHeader";

import { useLanguage } from "@/context/LanguageContext";
import SocketBookingsModal from "@/core/Websocket/socketchecking";

import { useAuthStore } from "@/core/store/auth";
import { useBookingSocket } from "@/core/Websocket/presentation/utils/useBookingsocket";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mini, setMini] = useState(false);

  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [lastAcceptedAt, setLastAcceptedAt] = useState<number | null>(null);

  const { language } = useLanguage();
  const isRTL = language === "AR";

  const { user } = useAuthStore();
  const isWorkerOnline = user?.worker?.status === "ONLINE";

  /* ================= SOCKET ================= */
  useBookingSocket();

  /* ================= STORE ================= */
  const requestBookings = useBookingSocketStore((s) => s.requestBookings);
  const connected = useBookingSocketStore((s) => s.connected);

  const lastSeenRef = useRef<string | null>(null);

  /* ================= RESPONSIVE ================= */
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ================= MODAL TRIGGER ================= */
  useEffect(() => {
    if (!connected || !isWorkerOnline) return;
    if (!requestBookings.length) return;

    // 🔥 cooldown after accept (prevents spam modal)
    if (lastAcceptedAt && Date.now() - lastAcceptedAt < 4000) return;

    const latest = requestBookings.at(0)?._id;
    if (!latest) return;

    if (lastSeenRef.current !== latest) {
      lastSeenRef.current = latest;
      setModalOpen(true);
    }
  }, [connected, isWorkerOnline, requestBookings, lastAcceptedAt]);

  /* ================= LAYOUT ================= */
  const contentOffset =
    windowWidth >= 1024
      ? mini
        ? isRTL
          ? "lg:mr-20"
          : "lg:ml-20"
        : isRTL
        ? "lg:mr-72"
        : "lg:ml-72"
      : "ml-0 mr-0";

  return (
    <div className={`flex min-h-screen ${isRTL ? "flex-row-reverse" : ""}`}>
      {/* ================= SIDEBAR ================= */}
      <AppSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        mini={mini}
        windowWidth={windowWidth}
      />

      {/* ================= MAIN ================= */}
      <div className={`flex flex-1 flex-col ${contentOffset}`}>
        <AppHeader
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          mini={mini}
          setMini={setMini}
        />

        <main className="flex-1 overflow-y-auto px-4">
          <Outlet />
        </main>
      </div>

      {/* ================= MODAL ================= */}
      <SocketBookingsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onBookingAccepted={() => {
          setModalOpen(false);
          setLastAcceptedAt(Date.now()); // 🔥 cooldown instead of permanent disable
        }}
      />
    </div>
  );
}