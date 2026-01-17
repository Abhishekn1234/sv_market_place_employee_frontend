import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/Layout/AppSidebar";
import AppHeader from "@/components/Layout/AppHeader";
import { useLanguage } from "@/context/LanguageContext";
import SocketBookingsModal from "@/core/Websocket/socketchecking";
import AssignedWorkModal from "@/pages/AssignedWorks/presentation/assignedwork.page";
import { useAssign } from "@/pages/AssignedWorks/presentation/hooks/useAssign";
import type { GetBooking } from "@/core/Websocket/domain/entities/getrepo";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mini, setMini] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { language } = useLanguage();
  const isRTL = language === "AR";

  /** 🔑 START CLOSED — decide after API */
  const [liveBookingsOpen, setLiveBookingsOpen] = useState(false);
  const [assignedOpen, setAssignedOpen] = useState(false);

  /** Always fetch assigned works on layout load */
  const { assignedWorks, isLoading } = useAssign(true);

  /** ✅ Decide which modal to open AFTER data loads */
  useEffect(() => {
    if (isLoading) return;

    const hasAssigned = assignedWorks.some(
      (b: GetBooking) => b.status === "ASSIGNED"
    );

    if (hasAssigned) {
      setAssignedOpen(true);
      setLiveBookingsOpen(false);
    } else {
      setAssignedOpen(false);
      setLiveBookingsOpen(true);
    }
  }, [isLoading, assignedWorks]);

  /** Window resize */
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 1024) setMini(false);
  }, [windowWidth]);

  /** Sidebar offset */
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

  /** Prevent flicker */
  if (isLoading) return null;

  /** When live booking is accepted */
  const handleBookingAccepted = () => {
    setLiveBookingsOpen(false);
    setAssignedOpen(true);
  };

  return (
    <div
      className={`flex min-h-screen bg-gray-50 dark:bg-gray-900 ${
        isRTL ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Sidebar */}
      <AppSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        mini={mini}
        windowWidth={windowWidth}
      />

      {/* Content */}
      <div
        className={`flex flex-1 flex-col min-w-0 transition-all duration-300 ${contentOffset}`}
      >
        <AppHeader
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          mini={mini}
          setMini={setMini}
        />

        <main className="flex-1 overflow-y-auto p-2 md:p-4">
          <Outlet />
        </main>
      </div>

     
      {assignedOpen ? (
        <AssignedWorkModal
          open={assignedOpen}
          onClose={() => setAssignedOpen(false)}
          onCancelSuccess={() => {
            setAssignedOpen(false);
            setLiveBookingsOpen(true);
          }}
        />
      ) : (
        <SocketBookingsModal
          open={liveBookingsOpen}
          onClose={() => setLiveBookingsOpen(false)}
          onBookingAccepted={handleBookingAccepted}
        />
      )}
    </div>
  );
}

