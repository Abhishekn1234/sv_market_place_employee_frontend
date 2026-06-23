"use client";

import { useResetPassword } from '../presentation/hooks/useReset';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';
import CommonSpinner from '@/components/common/CommonSpinner';

export default function ResetPasswordForm() {
  const { resetPassword, loading } = useResetPassword();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword({ newPassword, confirmPassword });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Top bar */}
          <div className="bg-blue-600 px-6 py-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <KeyRound className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-medium text-base leading-tight">Reset password</h1>
              <p className="text-blue-200 text-xs mt-0.5">Create a new secure password</p>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Illustration */}
            <div className="bg-blue-50 rounded-xl h-20 flex items-center justify-center mb-5">
              <ShieldCheck className="h-9 w-9 text-blue-400" />
            </div>

            <p className="text-sm text-slate-500 mb-5">
              Choose a strong password. It must be at least 6 characters long.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New password */}
              <div>
                <label className="text-sm font-medium text-slate-600 block mb-1.5">
                  New password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400 pointer-events-none" />
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="pl-10 pr-11 h-11 border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="text-sm font-medium text-slate-600 block mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400 pointer-events-none" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`pl-10 pr-11 h-11 bg-slate-50 focus:bg-white focus:ring-2 transition-all ${
                      passwordMismatch
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : passwordsMatch
                        ? 'border-green-400 focus:border-green-400 focus:ring-green-100'
                        : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordMismatch && (
                  <p className="text-xs text-red-500 mt-1.5">Passwords don't match</p>
                )}
                {passwordsMatch && (
                  <p className="text-xs text-green-600 mt-1.5">Passwords match</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || passwordMismatch}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60 mt-2"
              >
                {loading ? <CommonSpinner /> : "Reset password"}
              </Button>
            </form>

            <div className="border-t border-slate-100 mt-6 pt-4 text-center text-xs text-slate-400">
              Remember your password?{" "}
              <a href="/login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
