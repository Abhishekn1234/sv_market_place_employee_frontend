import { useState } from "react";
import { useSendOtpEmail } from "./hooks/useSendOtpEmail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send } from "lucide-react";

export function SendOtpEmailPage() {
  const [email, setEmail] = useState("");
  const sendOtpMutation = useSendOtpEmail();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    sendOtpMutation.mutate({ email });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Top bar */}
          <div className="bg-blue-600 px-6 py-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-medium text-base leading-tight">Verify your email</h1>
              <p className="text-blue-200 text-xs mt-0.5">Step 1 of 2</p>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Illustration */}
            <div className="bg-blue-50 rounded-xl h-20 flex items-center justify-center mb-5">
              <Mail className="h-9 w-9 text-blue-400" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              We'll send a 6-digit code to your inbox
            </div>

            <p className="text-sm text-slate-500 mb-5">
              Enter your email address to receive a one-time verification code.
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
                    required
                    value={email}
                    placeholder="you@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={sendOtpMutation.isPending}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {sendOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>

            <div className="border-t border-slate-100 mt-6 pt-4 text-center text-xs text-slate-400">
              Already verified?{" "}
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