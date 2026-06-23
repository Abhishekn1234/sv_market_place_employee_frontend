"use client";

import { useState } from "react";
import { Mail, Send, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { useForgot } from "./hooks/useForgot";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { mutate, isPending } = useForgot();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    mutate(email, {
      onSuccess: (data: any) => {
        toast.success("OTP sent to your email");
        navigate("/verify-otp", { state: { hash: data.hash } });
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to send reset link");
      },
    });
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
              <h1 className="text-white font-medium text-base leading-tight">Forgot password</h1>
              <p className="text-blue-200 text-xs mt-0.5">We'll email you a reset code</p>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Illustration */}
            <div className="bg-blue-50 rounded-xl h-20 flex items-center justify-center mb-5">
              <Mail className="h-9 w-9 text-blue-400" />
            </div>

            <p className="text-sm text-slate-500 mb-5">
              Enter the email address associated with your account and we'll send you a 6-digit verification code.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600 block mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400 pointer-events-none" />
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {isPending ? "Sending OTP..." : "Send OTP"}
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

