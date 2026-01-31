"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
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
        navigate("/verify-otp", {
          state: { hash: data.hash },
        });
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to send reset link");
      },
    });
  };

  return (
    <div className="
      min-h-[100dvh] 
      flex flex-col 
      items-center justify-start 
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
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center mb-2">
          Forgot Password
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center mb-6">
          Enter your email to receive a verification code
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm sm:text-base md:text-lg font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
              <Input
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg border-gray-300 focus:ring-blue-200 focus:border-blue-500 rounded-lg w-full"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-2 sm:mt-3 md:mt-4 h-11 sm:h-12 md:h-14 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg sm:rounded-xl flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending && <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />}
            Send OTP
          </Button>
        </form>

        <p className="text-center text-sm sm:text-base md:text-lg mt-4">
          Remember your password?{" "}
          <a 
            href="/login" 
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}


