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

  const [liveBookingsOpen, setLiveBookingsOpen] = useState(true);
  const [assignedOpen, setAssignedOpen] = useState(false); // will update below

  const { assignedWorks, isLoading } = useAssign(true); // always fetch to check

  // Automatically open AssignedWorkModal if there’s already an assigned work
  useEffect(() => {
    if (assignedWorks.some((b: GetBooking) => b.status === "ASSIGNED")) {
      setAssignedOpen(true);
      setLiveBookingsOpen(false);
    }
  }, [assignedWorks]);

  // Handle window resize
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 1024) setMini(false);
  }, [windowWidth]);

  /** Apply offset to WHOLE content (header + main) */
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

  if (isLoading) return null; // avoid flicker

  // Callback when a live booking is accepted
  const handleBookingAccepted = () => {
    setLiveBookingsOpen(false); // close live bookings
    setAssignedOpen(true); // open assigned works
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

      {/* Modals */}
      {assignedOpen ? (
        <AssignedWorkModal
          open={assignedOpen}
          onClose={() => setAssignedOpen(false)}
          onCancelSuccess={() => {
            // Close AssignedWorkModal
            setAssignedOpen(false);
            // Open Live Bookings again
            setLiveBookingsOpen(true);
          }}
        />
      ) : (
        <SocketBookingsModal
          open={liveBookingsOpen}
          onClose={() => setLiveBookingsOpen(false)}
          onBookingAccepted={handleBookingAccepted} // Open assigned work after accept
        />
      )}
    </div>
  );
}
