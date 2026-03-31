import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "@/components/Layout/AppSidebar";
import AppHeader from "@/components/Layout/AppHeader";
import { useLanguage } from "@/context/LanguageContext";
import SocketBookingsModal from "@/core/Websocket/socketchecking";
import AssignedWorkModal from "@/pages/Booking/AvaliableWorks/presentation/components/AssignedWork/assignedwork.page";
import { useAssign } from "@/pages/Booking/AvaliableWorks/presentation/hooks/useAssign";
import type { GetBooking } from "@/core/Websocket/domain/entities/getrepo";
import { initializeSocket, socket } from "@/core/Websocket/presentation/components/socket";
import { useAuthStore } from "@/core/store/auth";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mini, setMini] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { language } = useLanguage();
  const isRTL = language === "AR";

  const [liveBookingsOpen, setLiveBookingsOpen] = useState(false);
  const [assignedOpen, setAssignedOpen] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // 🔥 NEW: socket trigger for realtime UI update
  const [socketTrigger, setSocketTrigger] = useState(0);

  const { assignedWorks, isLoading } = useAssign(true);
  const { accessToken } = useAuthStore();

  // ✅ Initialize socket
  useEffect(() => {
    if (!accessToken) return;

    const s = initializeSocket(accessToken);

    if (!s.connected) {
      s.connect();
    }
  }, [accessToken]);

  const location = useLocation();
  const isAvailableWorkPage = location.pathname.startsWith("/availableWork");

  // ✅ Track socket connection
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log("✅ Socket Connected");
      setIsSocketConnected(true);
    };

    const handleDisconnect = () => {
      console.log("❌ Socket Disconnected");
      setIsSocketConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      setIsSocketConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [accessToken]);

  // 🔥 NEW: listen for realtime bookings
  useEffect(() => {
    if (!socket) return;

    const handleNewBooking = (data: any) => {
      console.log("🔥 New booking in AppLayout", data);

      // trigger UI update
      setSocketTrigger((prev) => prev + 1);

      // open modal instantly
      setLiveBookingsOpen(true);
      setAssignedOpen(false);
    };

    socket.on("new-booking", handleNewBooking);

    return () => {
      socket.off("new-booking", handleNewBooking);
    };
  }, []);

  const workerStatus = useAuthStore((s) => s.user?.worker?.status);
  const isWorkerOnline = workerStatus === "ONLINE";

  // ✅ Modal switching logic
  useEffect(() => {
    if (isLoading) return;

    if (!isSocketConnected || !isWorkerOnline) {
      setLiveBookingsOpen(false);
      setAssignedOpen(false);
      return;
    }

    const worksArray = Array.isArray(assignedWorks)
      ? assignedWorks
      : assignedWorks
      ? [assignedWorks]
      : [];

    const hasAssigned = worksArray.some((b: GetBooking) =>
      ["IN_PROGRESS", "WORKER_ACCEPTED", "STARTED", "ASSIGNED", "REQUESTED"].includes(
        b.status as string
      )
    );

    if (hasAssigned) {
      setAssignedOpen(true);
      setLiveBookingsOpen(false);
    } else {
      setAssignedOpen(false);
      setLiveBookingsOpen(true);
    }
  }, [isLoading, assignedWorks, isSocketConnected, isWorkerOnline, socketTrigger]);

  // UI resize
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

  if (isLoading) return null;

  const handleBookingAccepted = () => {
    setLiveBookingsOpen(false);
    setAssignedOpen(true);
  };

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

      {/* ✅ Modal switching */}
      {!isAvailableWorkPage && (
        assignedOpen ? (
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
            isConnected={isSocketConnected}
          />
        )
      )}
    </div>
  );
}