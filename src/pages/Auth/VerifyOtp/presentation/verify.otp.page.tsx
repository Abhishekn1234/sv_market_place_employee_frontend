"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useOtp } from "../presentation/hooks/useOtp";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Mail, RefreshCw } from "lucide-react";

const OTP_LENGTH = 6;

export default function VerifyOtp() {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { mutate, isPending } = useOtp();
  const navigate = useNavigate();
  const location = useLocation();
  const hash = location.state?.hash;

  if (!hash) {
    navigate("/forgot-password", { replace: true });
    return null;
  }

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = [...digits];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = digits.join("");
    if (otpValue.length !== OTP_LENGTH) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }
    mutate(
      { hash, otp: otpValue },
      {
        onSuccess: (data: any) => {
          sessionStorage.setItem("resetPasswordToken", data.accessToken);
          toast.success("OTP verified");
          navigate("/reset-password", { replace: true });
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || "Invalid OTP");
        },
      }
    );
  };

  const filledCount = digits.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Top bar */}
          <div className="bg-blue-600 px-6 py-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-medium text-base leading-tight">Verify OTP</h1>
              <p className="text-blue-200 text-xs mt-0.5">Check your email for the code</p>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Illustration */}
            <div className="bg-blue-50 rounded-xl h-20 flex items-center justify-center mb-5">
              <Mail className="h-9 w-9 text-blue-400" />
            </div>

            <p className="text-sm text-slate-500 mb-6 text-center">
              Enter the 6-digit code sent to your email address to continue resetting your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* OTP boxes */}
              <div
                className="flex gap-2 justify-center"
                onPaste={handlePaste}
                aria-label="Enter 6-digit OTP"
              >
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    aria-label={`Digit ${i + 1}`}
                    style={{ height: "52px", width: "44px" }}
                    className={`text-center text-xl font-medium rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                      digit
                        ? "border-blue-400 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-slate-50 text-slate-800"
                    }`}
                  />
                ))}
              </div>

              {/* Progress bar */}
              <div className="flex gap-1">
                {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i < filledCount ? "bg-blue-500" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              <Button
                type="submit"
                disabled={isPending || filledCount < OTP_LENGTH}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all disabled:opacity-60"
              >
                {isPending ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>

            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-slate-400">
                Expires in <span className="text-blue-600 font-medium">10:00</span>
              </span>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Resend code
              </button>
            </div>

            <div className="border-t border-slate-100 mt-6 pt-4 text-center text-xs text-slate-400">
              Wrong email?{" "}
              <a href="/forgot-password" className="text-blue-600 hover:underline font-medium">
                Go back
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}