"use client";

import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import AppSidebar from "@/components/Layout/AppSidebar";
import AppHeader from "@/components/Layout/AppHeader";

import { useLanguage } from "@/context/LanguageContext";
import SocketBookingsModal from "@/core/Websocket/socketchecking";

import { useAuthStore } from "@/core/store/auth";
import { useInitSockets } from "@/core/Websocket/presentation/hooks/socketinitliazation";
import { useBookingSocket } from "@/core/Websocket/presentation/utils/socketlogic";

import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mini, setMini] = useState(false);

  // ✅ SSR-safe window width
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // ✅ modal should NOT open by default
  const [modalOpen, setModalOpen] = useState(false);

  const { language } = useLanguage();
  const isRTL = language === "AR";

  const { user } = useAuthStore();
  const workerStatus = user?.worker?.status;
  const isWorkerOnline = workerStatus === "ONLINE";

  /* ================= SOCKET INIT ================= */
  useInitSockets();
  useBookingSocket();

  /* ================= STORE ================= */
  const { bookings, connected } = useBookingSocketStore();

  /* ================= RESPONSIVE ================= */
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ================= AUTO OPEN MODAL ================= */
  useEffect(() => {
    if (connected && isWorkerOnline && bookings.length > 0) {
      setModalOpen(true);
    }
  }, [connected, isWorkerOnline, bookings.length]);

  /* ================= LAYOUT OFFSET ================= */
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

      {/* ================= LIVE BOOKINGS MODAL ================= */}
      <SocketBookingsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}