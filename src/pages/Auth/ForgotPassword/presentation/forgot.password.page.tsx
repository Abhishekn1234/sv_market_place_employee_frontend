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
          state: {
            hash: data.hash, // ✅ IMPORTANT
          },
        });
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || "Failed to send reset link"
        );
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          Forgot Password
        </h1>

        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email to receive a verification code
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isPending}
          >
            {isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Send OTP
          </Button>
        </form>

        <p className="text-center text-sm mt-4">
          Remember your password?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
