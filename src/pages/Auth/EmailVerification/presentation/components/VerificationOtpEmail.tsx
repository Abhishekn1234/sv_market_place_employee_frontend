import { useState } from "react";
import { useVerifyOtpEmail } from "../hooks/useVerifyOtpEmail";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

export function VerifyOtpEmailPage() {
  const location = useLocation();
  const hash = (location.state as { hash: string })?.hash;

  const [otp, setOtp] = useState("");
  const verifyOtpMutation = useVerifyOtpEmail();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !hash) return toast.error("Invalid OTP process");

    verifyOtpMutation.mutate({ hash, otp });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Enter OTP
        </h2>

        <p className="text-sm text-gray-600 mb-4 text-center">
          Please enter the OTP sent to your email
        </p>

        <input
          type="text"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-4"
        />

        <Button
          type="submit"
          disabled={verifyOtpMutation.isPending}
          className={`w-full py-2 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
            verifyOtpMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
        </Button>
      </form>
    </div>
  );
}