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

  // ✅ GET HASH FROM FORGOT PASSWORD
  const hash = location.state?.hash;

  // Safety guard (direct access protection)
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

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
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
      { hash, otp: otpValue }, // ✅ USE HASH HERE
      {
        onSuccess: (data: any) => {
          sessionStorage.setItem(
            "resetPasswordToken",
            data.accessToken
          );

          toast.success("OTP verified");
          navigate("/reset-password", { replace: true });
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Invalid OTP"
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          Verify OTP
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) =>{ (inputsRef.current[index] = el)}}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="h-12 w-12 text-center text-lg font-semibold"
              />
            ))}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isPending}
          >
            {isPending ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
}
