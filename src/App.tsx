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

/* PAGES */
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
import DocumentOnboarding from "./pages/DocumentsOnboarding/presentation/document.onboarding.page";
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

/* NOTIFICATIONS */
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

  useDynamicLocation();
  useNotificationManager();

  /* FOREGROUND FCM */
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    initOnMessage();
  }, []);

  /* SERVICE WORKER */
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (swRegisteredRef.current) return;

    swRegisteredRef.current = true;

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        console.log("SW ready:", reg);

        if (reg.waiting) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
        }
      } catch (err) {
        console.error("SW error:", err);
      }
    };

    registerSW();
  }, []);

  /* =========================
     SMART NAVIGATION
  ========================= */

  const handleNavigate = (url?: string, data?: any) => {
    if (!url) return;

    let finalUrl = url;

    // 🔥 CENTRAL RULE
    if (data?.status === "REQUESTED") {
      finalUrl = `/availableBooking?status=requested&bookingId=${data.bookingId}`;
    } else if (data?.bookingId) {
      finalUrl = `/availableWork?bookingId=${data.bookingId}`;
    }

    const current =
      window.location.pathname + window.location.search;

    if (current === finalUrl) return;

    navigate(finalUrl);
  };

  useEffect(() => {
    const channel = new BroadcastChannel("fcm_channel");

    const handler = (event: MessageEvent) => {
      const data = event.data;

      if (data?.type === "NAVIGATE" && data.isUserAction) {
        handleNavigate(data.url, data);
      }
    };

    channel.addEventListener("message", handler);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        const data = event.data;
        if (data?.type === "NAVIGATE" && data.isUserAction) {
          handleNavigate(data.url, data);
        }
      });
    }

    return () => {
      channel.removeEventListener("message", handler);
      channel.close();
    };
  }, [navigate]);

  /* ROUTES */
  return (
    <LanguageProvider>
      <ToastContainer position="top-right" autoClose={5000} />

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

          <Route path="settings/profile" element={
            <ProfileSettings activeTab={activeTab} setActiveTab={setActiveTab} />
          } />

          <Route path="history/booking" element={<BookingHistory />} />
          <Route path="history/transaction" element={<TransactionHistory />} />
          <Route path="history/work" element={<WorkingHistory />} />

          <Route path="/disputes" element={<Disputespage />} />
          <Route path="/currentWork" element={<CurrentWorkPage />} />

          <Route path="/chat/:bookingId" element={<ChatWorkerPage />} />

          <Route path="settings/wallet" element={<Wallet />} />
          <Route path="notifications" element={<NotificationsPage />} />

          <Route path="availableWork" element={<AvailableWorkPage />} />
          <Route path="availableBooking" element={<AvailableBookingPage />} />
        </Route>
      </Routes>

      <LocationTracker />
    </LanguageProvider>
  );
}

/* ROOT */
export default function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <AppContent />
      </LocationProvider>
    </ThemeProvider>
  );
}