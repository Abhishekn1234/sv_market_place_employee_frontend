import { useState } from "react";
import { useSendOtpMobile } from "../hooks/useSendOtpMobile";

export default function SendOtpMobilePage() {
  const [mobile, setMobile] = useState("");
  const sendOtpMutation = useSendOtpMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile) return;
    sendOtpMutation.mutate({ phone:mobile });
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

        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
          Mobile Number
        </label>
        <input
          type="tel"
          id="mobile"
          name="mobile"
          required
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="+91 9876543210"
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-4"
        />

        <button
          type="submit"
          disabled={sendOtpMutation.isPending}
          className={`w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            sendOtpMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {sendOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}
