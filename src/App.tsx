import './App.css';
import { Route, Routes } from 'react-router-dom'; // make sure to use 'react-router-dom'
import RegisterPage from './pages/Auth/Register/presentation/register.page';
import LoginPage from './pages/Auth/Login/presentation/login.page';
import HomePage from './pages/Home/presentation/home.page';
import AppLayout from './components/Layout/AppLayout';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from "react-toastify";
import ProfileSettings from './pages/Profile/presentation/profile.page';
import ProtectedRoute from './ProtectedRoute';
import ForgotPassword from './pages/Auth/ForgotPassword/presentation/forgot.password.page';
import VerifyOtp from './pages/Auth/VerifyOtp/presentation/verify.otp.page';
import ResetPassword from './pages/Auth/ResetPassword/presentation/reset.password.page';
import BookingHistory from './pages/History/BookingHistory/presentation/BookingHistory';
import TransactionHistory from './pages/History/TransactionHistory/presentation/TransactionHistory';
import WorkingHistory from './pages/History/WorkHistory/presentation/WorkingHistory';
import ServiceSettings from './pages/Servicesettings/presentation/servicesettings.page';
import DocumentOnboarding from './pages/DocumentsOnboarding/presentation/document.onboarding.page';
import { LanguageProvider } from './context/LanguageContext';
import RecentActivity from './pages/Activity/RecentActivity/presentation/recent.activity.page';
import PastActivity from './pages/Activity/PastActivity/presentation/past.activity.page';
import Wallet from './pages/Wallet/presentation/wallet.page';
import NotificationsPage from './pages/Notifications/presentation/notification.page';






function App() {
  
  return (
    <ThemeProvider>
      <LanguageProvider>
      <ToastContainer />
      
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
         <Route path='/services/employee' element={<ServiceSettings/>}/>
         <Route path='/services/documents' element={<DocumentOnboarding/>}/>
        
        {/* <Route path="/reset-password" element={<} */}
        <Route path='/verify-otp' element={<VerifyOtp/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        {/* Layout wrapper */}
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
            path="/settings/profile"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route path='/history/booking' element={
            <ProtectedRoute>
              <BookingHistory/>
            </ProtectedRoute>
          }/>
          <Route path='/activity/recent' element={
            <ProtectedRoute>
              <RecentActivity/>
            </ProtectedRoute>
          }/>
          <Route path="/activity/past" element={
            <ProtectedRoute>
              <PastActivity/>
            </ProtectedRoute>
          }/>
          <Route path='/history/transaction' element={<ProtectedRoute>
            <TransactionHistory/>
          </ProtectedRoute>}/>
         
          <Route path='/history/work' element={<ProtectedRoute><WorkingHistory/></ProtectedRoute>}/>
         <Route path='/settings/wallet' element={<ProtectedRoute><Wallet/></ProtectedRoute>}/>
         <Route path='/notifications' element={<NotificationsPage/>}/>
        </Route>
      </Routes>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
