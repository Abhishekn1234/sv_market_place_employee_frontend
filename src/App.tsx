// src/App.tsx
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer } from "react-toastify";

import { LocationProvider } from './context/LocationContext';
import { LocationTracker } from './pages/Profile/presentation/components/LocationTracker';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';

// Pages
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
import { ThemeProvider } from './context/ThemeContext';
import { useDynamicLocation } from './utils/useNotification';



function AppContent() {

  // Request permission on mount
const [notificationsGranted, setNotificationsGranted] = useState(false);

useEffect(() => {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    setNotificationsGranted(true);
  } else if (Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") setNotificationsGranted(true);
    });
  }
}, []);

// Pass the flag to the hook
useDynamicLocation(notificationsGranted);







  return (
    <>
      <LanguageProvider>
        <ToastContainer position="top-right" autoClose={5000} />
        <Routes>
          {/* Auth Routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/services/employee" element={<ServiceSettings />} />
          <Route path="/services/documents" element={<DocumentOnboarding />} />

          {/* Protected Routes (inside app) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="/settings/profile" element={
              <ProtectedRoute><ProfileSettings /></ProtectedRoute>
            }/>
            <Route path="/history/booking" element={
              <ProtectedRoute><BookingHistory /></ProtectedRoute>
            }/>
            <Route path="/history/transaction" element={
              <ProtectedRoute><TransactionHistory /></ProtectedRoute>
            }/>
            <Route path="/history/work" element={
              <ProtectedRoute><WorkingHistory /></ProtectedRoute>
            }/>
            <Route path="/activity/recent" element={
              <ProtectedRoute><RecentActivity /></ProtectedRoute>
            }/>
            <Route path="/activity/past" element={
              <ProtectedRoute><PastActivity /></ProtectedRoute>
            }/>
            <Route path="/settings/wallet" element={
              <ProtectedRoute><Wallet /></ProtectedRoute>
            }/>
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
        </Routes>
      </LanguageProvider>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        {/* LocationTracker now uses debounced pure web tracking */}
        <LocationTracker />
        <AppContent />
      </LocationProvider>
    </ThemeProvider>
  );
}

export default App;
