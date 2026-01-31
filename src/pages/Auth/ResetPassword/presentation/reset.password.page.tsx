"use client";

import { useResetPassword } from '../presentation/hooks/useReset';
import { useState } from 'react';
import { Input } from '@/components/ui/input';   
import { Button } from '@/components/ui/button'; 
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react'; 

export default function ResetPasswordForm() {
  const { resetPassword, loading } = useResetPassword();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword({ newPassword, confirmPassword });
    navigate('/login');
  };

  return (
    <div className="
      min-h-[100dvh] 
      flex flex-col items-center justify-start 
      lg:justify-center 
      overflow-y-auto 
      bg-gradient-to-br from-blue-50 via-white to-blue-100 
      px-4 py-6 lg:py-10
    ">
      <form
        onSubmit={handleSubmit}
        className="
          bg-white shadow-lg rounded-2xl 
          w-full max-w-[360px] sm:max-w-sm md:max-w-md lg:max-w-lg 
          p-6 sm:p-8 md:p-10
        "
      >
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-800">
          Reset Your Password
        </h2>

        <div className="space-y-4">
          {/* New Password */}
          <div className="relative">
            <Input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full pr-10 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              required
            />
            <button
              type="button"
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowNewPassword(prev => !prev)}
            >
              {showNewPassword ? <EyeOff className="h-5 w-5 sm:h-6 sm:w-6" /> : <Eye className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full pr-10 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              required
            />
            <button
              type="button"
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(prev => !prev)}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5 sm:h-6 sm:w-6" /> : <Eye className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="
            w-full mt-6 sm:mt-7 md:mt-8 py-3 sm:py-3.5 md:py-4 
            bg-blue-600 hover:bg-blue-700 text-white font-semibold 
            rounded-lg sm:rounded-xl flex items-center justify-center 
            transition
          "
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>

        <p className="text-center text-sm sm:text-base md:text-lg mt-4">
          Remember your password?{" "}
          <a href="/login" className="text-blue-600 hover:text-blue-800 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

