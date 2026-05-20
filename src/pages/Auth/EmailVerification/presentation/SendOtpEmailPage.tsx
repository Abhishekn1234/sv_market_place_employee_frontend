import { useState } from "react";
import { useSendOtpEmail } from "./hooks/useSendOtpEmail";
import { Button } from "@/components/ui/button";

export function SendOtpEmailPage() {
  const [email, setEmail] = useState("");
  const sendOtpMutation = useSendOtpEmail();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    sendOtpMutation.mutate({ email });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Verify Your Email
        </h2>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-4"
        />

        <Button
          type="submit"
          disabled={sendOtpMutation.isPending}
          className={`w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            sendOtpMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {sendOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>
    </div>
  );
}