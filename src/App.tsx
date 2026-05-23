import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";

import { LocationProvider } from "./context/LocationContext";
import { LocationTracker } from "./pages/Profile/presentation/components/Location/LocationTracker";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";

import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "./components/Layout/AppLayout";

/* =========================
   PAGES
========================= */
import HomePage from "./pages/Home/presentation/home.page";
import ProfileSettings from "./pages/Profile/presentation/profile.page";
import RegisterPage from "./pages/Auth/Register/presentation/register.page";
import LoginPage from "./pages/Auth/Login/presentation/login.page";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword/presentation/forgot.password.page";
import VerifyOtpPage from "./pages/Auth/VerifyOtp/presentation/verify.otp.page";
import ResetPasswordPage from "./pages/Auth/ResetPassword/presentation/reset.password.page";

import BookingHistory from "./pages/History/BookingHistory/presentation/BookingHistory";
import TransactionHistory from "./pages/History/TransactionHistory/presentation/TransactionHistory";
import WorkingHistory from "./pages/History/WorkHistory/presentation/WorkingHistory";

import ServiceSettings from "./pages/Servicesettings/presentation/servicesettings.page";
import DocumentOnboarding from "./pages/DocumentsOnboarding/presentation/document.onboarding.page"
import Wallet from "./pages/Wallet/presentation/wallet.page";
import NotificationsPage from "./pages/Notifications/presentation/notification.page";

import AvailableBookingPage from "./pages/Booking/AvailableBooking/presentation/availablebooking.page";
import AvailableWorkPage from "./pages/Booking/AvaliableWorks/presentation/AvailableWorkPage";

import VerifyMobilePage from "./pages/Auth/MobileVerification/presentation/VerifyMobilePage";
import { SendOtpEmailPage } from "./pages/Auth/EmailVerification/presentation/SendOtpEmailPage";
import { VerifyOtpEmailPage } from "./pages/Auth/EmailVerification/presentation/components/VerificationOtpEmail";
import SendOtpMobilePage from "./pages/Auth/MobileVerification/presentation/components/SendOtpMobilePage";

import Disputespage from "./pages/History/BookingHistory/presentation/components/Disputes.page";
import CurrentWorkPage from "./pages/CurrentWork/presentation/CurrentWorkPage";

import ChatWorkerPage from "./ChatCustomer/presentation/ChatWorkerPage";

/* =========================
   NOTIFICATIONS
========================= */
import { initOnMessage } from "./components/firebase/notifications";
import { useNotificationManager } from "./pages/Notifications/presentation/hooks/useNotificationhandler";
import { useDynamicLocation } from "@/utils/useNotification";

/* =========================
   APP CONTENT
========================= */

function AppContent() {
  const navigate = useNavigate();

  const initializedRef = useRef(false);
  const swRegisteredRef = useRef(false);

  const [activeTab, setActiveTab] = useState<
    "location" | "profile" | "password"
  >("profile");

  /* =========================
     CUSTOM HOOKS
  ========================= */
  useDynamicLocation();
  useNotificationManager();

  /* =========================
     FOREGROUND FCM
  ========================= */
  useEffect(() => {
    if (initializedRef.current) return;

    initializedRef.current = true;
    initOnMessage();
  }, []);

  /* =========================
     SERVICE WORKER REGISTER
  ========================= */
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (swRegisteredRef.current) return;

    swRegisteredRef.current = true;

    const registerSW = async () => {
      try {
        // Keep only one SW registration path (main.tsx). This is a no-op if already controlled.
        const reg = await navigator.serviceWorker.ready;


        console.log("✅ SW registered:", reg);

        await navigator.serviceWorker.ready;

        if (reg.waiting) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
        }
      } catch (err) {
        console.error("❌ SW registration error:", err);
      }
    };

    registerSW();
  }, []);

  /* =========================
     NAVIGATION HANDLER
  ========================= */

  useEffect(() => {
    const allowedRoutes = [
      "/availableBooking",
      "/chat",
      "/currentWork",
      "/availableWork",
      "/notifications",
    ];

    const normalize = (url: string) =>
      url.split("?")[0];

    const canNavigate = (url?: string) => {
      if (!url) return false;

      try {
        const path = new URL(url, window.location.origin)
          .pathname;

        return allowedRoutes.some((route) =>
          path.startsWith(route)
        );
      } catch {
        return false;
      }
    };

    const handleNavigate = (url?: string) => {
      if (!canNavigate(url)) return;

      const current =
        window.location.pathname +
        window.location.search;

      if (normalize(current) === normalize(url!)) return;

      console.log("🚀 Navigating:", url);
      navigate(url!);
    };

    /* =========================
       BROADCAST CHANNEL
    ========================= */
    const channel = new BroadcastChannel(
      "fcm_channel"
    );

    const channelHandler = (event: MessageEvent) => {
      const data = event.data;

      console.log("📡 BroadcastChannel:", data);

      if (data?.type === "NAVIGATE" && data.isUserAction) {
        handleNavigate(data.url);
      }
    };

    channel.addEventListener(
      "message",
      channelHandler
    );

    /* =========================
       SERVICE WORKER MESSAGES
    ========================= */
    const swHandler = (event: MessageEvent) => {
      const data = event.data;

      console.log("📨 SW Message:", data);

      if (data?.type === "NAVIGATE" && data.isUserAction) {
        handleNavigate(data.url);
      }
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener(
        "message",
        swHandler
      );
    }

    // Guarded window message handler to prevent collision with other libraries
    const windowHandler = (e: MessageEvent) => {
      if (e.data?.type === "NAVIGATE" && e.data?.isUserAction) swHandler(e);
    };
    window.addEventListener("message", windowHandler);

    /* =========================
       CLEANUP
    ========================= */
    return () => {
      channel.removeEventListener(
        "message",
        channelHandler
      );

      channel.close();

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener(
          "message",
          swHandler
        );
      }
    };
  }, [navigate]);

  /* =========================
     ROUTES
  ========================= */

  return (
    <LanguageProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
      />

      <Routes>
        {/* AUTH */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* SERVICES */}
        <Route path="/services/employee" element={<ServiceSettings />} />
        <Route path="/services/documents" element={<DocumentOnboarding />} />

        {/* MOBILE */}
        <Route path="/verify-otp-mobile" element={<VerifyMobilePage />} />
        <Route path="/send-otp-mobile" element={<SendOtpMobilePage />} />

        {/* EMAIL */}
        <Route path="/email-verification" element={<SendOtpEmailPage />} />
        <Route path="/verify-otp-email" element={<VerifyOtpEmailPage />} />

        {/* PROTECTED */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />

          {/* PROFILE */}
          <Route
            path="settings/profile"
            element={
              <ProfileSettings
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            }
          />

          {/* HISTORY */}
          <Route path="history/booking" element={<BookingHistory />} />
          <Route path="history/transaction" element={<TransactionHistory />} />
          <Route path="history/work" element={<WorkingHistory />} />

          {/* OTHER */}
          <Route path="/disputes" element={<Disputespage />} />
          <Route path="/currentWork" element={<CurrentWorkPage />} />

          {/* CHAT */}
          <Route path="/chat/:bookingId" element={<ChatWorkerPage />} />

          {/* WALLET */}
          <Route path="settings/wallet" element={<Wallet />} />

          {/* NOTIFICATIONS */}
          <Route path="notifications" element={<NotificationsPage />} />

          {/* BOOKINGS */}
          <Route path="availableWork" element={<AvailableWorkPage />} />
          <Route path="availableBooking" element={<AvailableBookingPage />} />
        </Route>
      </Routes>

      {/* LOCATION TRACKER */}
      <LocationTracker />
    </LanguageProvider>
  );
}

/* =========================
   ROOT APP
========================= */

export default function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <AppContent />
      </LocationProvider>
    </ThemeProvider>
  );
}