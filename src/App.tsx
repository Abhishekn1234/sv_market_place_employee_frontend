import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer } from "react-toastify";

import { LocationProvider } from './context/LocationContext';
import { LocationTracker } from './pages/Profile/presentation/components/Location/LocationTracker';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

import ProtectedRoute from './ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';

import HomePage from './pages/Home/presentation/home.page';
import ProfileSettings from './pages/Profile/presentation/profile.page';
import RegisterPage from './pages/Auth/Register/presentation/register.page';
import LoginPage from './pages/Auth/Login/presentation/login.page';
import ForgotPasswordPage from './pages/Auth/ForgotPassword/presentation/forgot.password.page';
import VerifyOtpPage from './pages/Auth/VerifyOtp/presentation/verify.otp.page';
import ResetPasswordPage from './pages/Auth/ResetPassword/presentation/reset.password.page';

import BookingHistory from './pages/History/BookingHistory/presentation/BookingHistory';
import TransactionHistory from './pages/History/TransactionHistory/presentation/TransactionHistory';
import WorkingHistory from './pages/History/WorkHistory/presentation/WorkingHistory';

import ServiceSettings from './pages/Servicesettings/presentation/servicesettings.page';
import DocumentOnboarding from './pages/DocumentsOnboarding/presentation/document.onboarding.page';

import RecentActivity from './pages/Activity/RecentActivity/presentation/recent.activity.page';
import PastActivity from './pages/Activity/PastActivity/presentation/past.activity.page';

import Wallet from './pages/Wallet/presentation/wallet.page';
import NotificationsPage from './pages/Notifications/presentation/notification.page';

import AvailableBookingPage from './pages/Booking/AvailableBooking/presentation/availablebooking.page';
import AvailableWorkPage from './pages/Booking/AvaliableWorks/presentation/AvailableWorkPage';

import VerifyMobilePage from './pages/Auth/MobileVerification/presentation/VerifyMobilePage';
import { SendOtpEmailPage } from './pages/Auth/EmailVerification/presentation/SendOtpEmailPage';
import { VerifyOtpEmailPage } from './pages/Auth/EmailVerification/presentation/components/VerificationOtpEmail';
import SendOtpMobilePage from './pages/Auth/MobileVerification/presentation/components/SendOtpMobilePage';

import Disputespage from './pages/History/BookingHistory/presentation/components/Disputes.page';
import CurrentWorkPage from './pages/CurrentWork/presentation/CurrentWorkPage';

import { initOnMessage } from './components/firebase/notifications';
// import { useNotificationManager } from './pages/Notifications/presentation/hooks/useNotificationhandler';
import { useDynamicLocation } from '@/utils/useNotification';

function AppContent() {
  const navigate = useNavigate();
  const initializedRef = useRef(false);

  const [activeTab, setActiveTab] = useState<
    "location" | "profile" | "password"
  >("profile");

  useDynamicLocation();

  // ✅ FOREGROUND FCM (RUN ONLY ONCE)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    initOnMessage();
  }, []);

  // ✅ SERVICE WORKER REGISTER (SAFE GUARD)
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let isRegistered = false;

    if (!isRegistered) {
      isRegistered = true;

      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((reg) => console.log("✅ SW registered:", reg))
        .catch((err) => console.error("❌ SW error:", err));
    }
  }, []);

  // ✅ NAVIGATION FROM SERVICE WORKER
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const { type, payload } = event.data || {};

      if (type === "NAVIGATE" && payload?.url) {
        console.log("🚀 Navigating from SW:", payload.url);

        setActiveTab(payload.tab || "profile");
        navigate(payload.url);
      }
    };

    navigator.serviceWorker?.addEventListener("message", handler);

    return () => {
      navigator.serviceWorker?.removeEventListener("message", handler);
    };
  }, [navigate]);

  // ✅ IN-APP NOTIFICATION CLICK
  useEffect(() => {
    const handler = (e: any) => {
      const { url } = e.detail || {};
      if (url) navigate(url);
    };

    window.addEventListener("in-app-notification-click", handler);

    return () => {
      window.removeEventListener("in-app-notification-click", handler);
    };
  }, [navigate]);

  return (
    <LanguageProvider>
      <ToastContainer position="top-right" autoClose={5000} />

      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/services/employee" element={<ServiceSettings />} />
        <Route path="/services/documents" element={<DocumentOnboarding />} />

        <Route path="/verify-otp-mobile" element={<VerifyMobilePage />} />
        <Route path="/send-otp-mobile" element={<SendOtpMobilePage />} />

        <Route path="/email-verification" element={<SendOtpEmailPage />} />
        <Route path="/verify-otp-email" element={<VerifyOtpEmailPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />

          <Route
            path="settings/profile"
            element={
              <ProfileSettings
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            }
          />

          <Route path="history/booking" element={<BookingHistory />} />
          <Route path="/disputes" element={<Disputespage />} />
          <Route path="/currentWork" element={<CurrentWorkPage />} />

          <Route path="history/transaction" element={<TransactionHistory />} />
          <Route path="history/work" element={<WorkingHistory />} />

          <Route path="activity/recent" element={<RecentActivity />} />
          <Route path="activity/past" element={<PastActivity />} />

          <Route path="settings/wallet" element={<Wallet />} />

          <Route path="notifications" element={<NotificationsPage />} />

          <Route path="availableWork" element={<AvailableWorkPage />} />
          <Route
            path="availableBooking"
            element={<AvailableBookingPage />}
          />
        </Route>
      </Routes>

      <LocationTracker />
    </LanguageProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <AppContent />
      </LocationProvider>
    </ThemeProvider>
  );
}