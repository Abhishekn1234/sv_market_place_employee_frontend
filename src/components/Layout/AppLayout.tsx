"use client";

import { useState, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";

import AppSidebar from "@/components/Layout/AppSidebar";
import AppHeader from "@/components/Layout/AppHeader";

import { useLanguage } from "@/context/LanguageContext";
import SocketBookingsModal from "@/core/Websocket/socketchecking";

import { useAssign } from "@/pages/Booking/AvaliableWorks/presentation/hooks/useAssign";
import { useAuthStore } from "@/core/store/auth";

import {
  initializeSocket,
  getSocket,
} from "@/core/Websocket/presentation/components/socket";

// --------------------
// helper
// --------------------
const resolveModalState = (
  connected: boolean,
  isOnline: boolean
) => {
  if (!connected || !isOnline) {
    return { live: false };
  }

  return {
    live: true,
  };
};

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mini, setMini] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { language } = useLanguage();
  const isRTL = language === "AR";

  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [newBookingSignal, setNewBookingSignal] = useState(0);

  const { assignedWorks, isLoading } = useAssign(true);
  const { accessToken } = useAuthStore();

 

  const workerStatus = useAuthStore((s) => s.user?.worker?.status);
  const isWorkerOnline = workerStatus === "ONLINE";

  // --------------------
  // MODAL STATE (ONLY SOCKET)
  // --------------------
  const [showLiveModal, setShowLiveModal] = useState(false);

  // --------------------
  // SOCKET INIT
  // --------------------
useEffect(() => {
  if (!accessToken) return;

  const socket = initializeSocket("/workers/requests", accessToken);

  if (!socket.connected) socket.connect();

  const handleConnect = () => setIsSocketConnected(true);
  const handleDisconnect = () => setIsSocketConnected(false);

  socket.on("connect", handleConnect);
  socket.on("disconnect", handleDisconnect);

  return () => {
    socket.off("connect", handleConnect);
    socket.off("disconnect", handleDisconnect);
  };
}, [accessToken]);

  // --------------------
  // NEW BOOKING EVENT
  // --------------------
useEffect(() => {
  const socket = getSocket("/workers/requests");
  if (!socket) return;

  const handleNewBooking = (data: any) => {
    console.log("🔥 New booking received", data);
    setNewBookingSignal((prev) => prev + 1);
  };

  socket.on("booking.created", handleNewBooking);

  return () => {
    socket.off("booking.created", handleNewBooking);
  };
}, []);
  // --------------------
  // RESPONSIVE
  // --------------------
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 1024) setMini(false);
  }, [windowWidth]);

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

  // --------------------
  // COMPUTE MODAL STATE
  // --------------------
  const modalState = useMemo(() => {
    return resolveModalState(isSocketConnected, isWorkerOnline);
  }, [assignedWorks, isSocketConnected, isWorkerOnline, newBookingSignal]);

  // --------------------
  // SYNC SOCKET MODAL ONLY
  // --------------------
  useEffect(() => {
    setShowLiveModal(modalState.live);
  }, [modalState]);

  if (isLoading) return null;

  return (
    <div className={`flex min-h-screen ${isRTL ? "flex-row-reverse" : ""}`}>
      <AppSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        mini={mini}
        windowWidth={windowWidth}
      />

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

      {/* -------------------- */}
      {/* ONLY SOCKET MODAL */}
      {/* -------------------- */}
     
        <SocketBookingsModal
          open={showLiveModal}
          onClose={() => setShowLiveModal(false)}
          isConnected={isSocketConnected}
          onBookingAccepted={() => {}}
        />
      
    </div>
  );
}