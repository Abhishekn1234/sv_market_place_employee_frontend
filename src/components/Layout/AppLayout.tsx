"use client";

import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import AppSidebar from "@/components/Layout/AppSidebar";
import AppHeader from "@/components/Layout/AppHeader";

import { useLanguage } from "@/context/LanguageContext";
import { useBookingSocket } from "@/core/Websocket/presentation/utils/useBookingsocket";
import { useAssignedSocketInit } from "@/core/Websocket/presentation/hooks/socketinitliazation";
import { useAssignedSocket } from "@/core/Websocket/presentation/utils/useAssignsocket";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mini, setMini] = useState(false);

  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const { language } = useLanguage();
  const isRTL = language === "AR";

  /* ================= SOCKETS ================= */

  useBookingSocket();
  useAssignedSocketInit();
  useAssignedSocket();

  /* ================= RTL ================= */

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language.toLowerCase();
  }, [isRTL, language]);

  /* ================= RESPONSIVE ================= */

  useEffect(() => {
    const onResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

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
      : "";

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* ================= SIDEBAR ================= */}
      <AppSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        mini={mini}
        windowWidth={windowWidth}
      />

      {/* ================= MAIN ================= */}
      <div
        className={`flex flex-1 min-w-0 flex-col transition-all duration-300 ${contentOffset}`}
      >
        <AppHeader
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          mini={mini}
          setMini={setMini}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}