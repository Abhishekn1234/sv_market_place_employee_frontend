"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { useOtp } from "../presentation/hooks/useOtp";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const { mutate, isPending } = useOtp();
  const navigate = useNavigate();
  const location = useLocation();

  const hash = location.state?.hash;

  // Direct access guard
  if (!hash) {
    navigate("/forgot-password", { replace: true });
    return null;
  }

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter complete OTP");
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
          toast.error(err?.response?.data?.message || "Invalid OTP");
        },
      }
    );
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
      <div className="
        w-full max-w-[360px] sm:max-w-sm md:max-w-md lg:max-w-lg 
        bg-white rounded-2xl shadow-lg sm:shadow-xl md:shadow-2xl 
        p-6 sm:p-8 md:p-10
      ">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center mb-2 text-gray-800">
          Verify OTP
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => { inputsRef.current[index] = el; }}

                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="
                  h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 
                  text-center text-lg sm:text-xl md:text-2xl font-semibold 
                  rounded-lg border-gray-300 focus:ring-blue-200 focus:border-blue-500
                "
              />
            ))}
          </div>

          <Button
            type="submit"
            className="w-full mt-2 sm:mt-3 md:mt-4 h-11 sm:h-12 md:h-14 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg sm:rounded-xl transition"
            disabled={isPending}
          >
            {isPending ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
}
