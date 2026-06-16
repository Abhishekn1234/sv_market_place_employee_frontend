import { useState } from "react";
import { useSendOtpMobile } from "../hooks/useSendOtpMobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SendOtpMobilePage() {
  const [mobile, setMobile] = useState("");
  const sendOtpMutation = useSendOtpMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile) return;

    sendOtpMutation.mutate({ phone: mobile });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Send OTP to Mobile
        </h2>

        <Label className="block text-sm font-medium text-gray-700 mb-2">
          Mobile Number
        </Label>

        {/* ✅ PHONE INPUT */}
        <Input
          type="tel"
          name="mobile"
          value={mobile}
          required
          onChange={(e) => setMobile(e.target.value)}
        />

        <Button
          type="submit"
          disabled={sendOtpMutation.isPending}
          className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          {sendOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>
    </div>
  );
}