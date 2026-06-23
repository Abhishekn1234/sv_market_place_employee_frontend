import { useState } from "react";
import { useSendOtpMobile } from "../hooks/useSendOtpMobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone, Send } from "lucide-react";
import CommonSpinner from "@/components/common/CommonSpinner";

export default function SendOtpMobilePage() {
  const [mobile, setMobile] = useState("");
  const sendOtpMutation = useSendOtpMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile) return;
    sendOtpMutation.mutate({ phone: mobile });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          {/* Top bar */}
          <div className="bg-blue-600 px-6 py-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-medium text-base leading-tight">
                Verify your number
              </h1>
              <p className="text-blue-200 text-xs mt-0.5">Step 1 of 2</p>
            </div>
          </div>

          <div className="px-6 py-6">

            {/* Illustration */}
            <div className="relative bg-gradient-to-br from-blue-50 to-slate-100 rounded-2xl h-28 flex items-center justify-center mb-5 overflow-hidden">
              <div className="absolute h-24 w-24 rounded-full border-2 border-blue-100 opacity-60" />
              <div className="absolute h-16 w-16 rounded-full border-2 border-blue-200 opacity-60" />
              <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-blue-100 flex items-center justify-center z-10">
                <Phone className="h-6 w-6 text-blue-500" />
              </div>
              <div className="absolute top-4 right-10 flex gap-0.5 items-end">
                <div className="w-1 h-2 bg-blue-300 rounded-sm" />
                <div className="w-1 h-3 bg-blue-400 rounded-sm" />
                <div className="w-1 h-4 bg-blue-500 rounded-sm" />
                <div className="w-1 h-5 bg-blue-600 rounded-sm" />
              </div>
            </div>

            {/* Info badge */}
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              We'll send a 6-digit code via SMS
            </div>

            <p className="text-sm text-slate-500 mb-5">
              Enter your mobile number to receive a one-time verification code.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="text-sm font-medium text-slate-600 block mb-1.5">
                  Mobile number
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                    <Phone className="h-4 w-4 text-blue-400" />
                    <span className="text-xs text-slate-300">|</span>
                  </div>
                  <Input
                    type="tel"
                    name="mobile"
                    value={mobile}
                    required
                    placeholder="+1 (555) 000-0000"
                    onChange={(e) => setMobile(e.target.value)}
                    className="pl-11 h-12 border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-slate-800 placeholder:text-slate-300 rounded-xl transition-all"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-slate-300 inline-block" />
                  Include your country code (e.g. +1, +44, +91)
                </p>
              </div>

              <Button
                type="submit"
                disabled={sendOtpMutation.isPending || !mobile}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-sm shadow-blue-200"
              >
                {sendOtpMutation.isPending ? (
                  <>
                    <CommonSpinner color="white"/>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send OTP
                  </>
                )}
              </Button>
            </form>

            {/* Security note */}
            <div className="mt-4 flex items-start gap-2 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
              <div className="h-4 w-4 mt-0.5 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-[9px] font-bold">i</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your number is only used for verification and will never be shared with third parties.
              </p>
            </div>

            <div className="border-t border-slate-100 mt-5 pt-4 text-center text-xs text-slate-400">
              Already verified?{" "}
              <a href="/login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </a>
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <div className="h-2 w-8 rounded-full bg-blue-600" />
          <div className="h-2 w-2 rounded-full bg-slate-200" />
        </div>

      </div>
    </div>
  );
}