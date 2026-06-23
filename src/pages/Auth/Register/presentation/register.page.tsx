import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import type { Register } from "../domain/entities/register";
import { useRegister } from "./hooks/useRegister";
import { useAuthStore } from "@/core/store/auth";
import { Button } from "@/components/ui/button";
import CommonSpinner from "@/components/common/CommonSpinner";
import RegisterHeroPanel from "./components/RegisterHeroPanel";
import RegisterFormFields from "./components/RegisterFormFields";


export default function RegisterPage() {
  const { setAuth, setTokens } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Register>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { mutate: registerMutate, isPending: isLoading } = useRegister();

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleRegister = () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.phone
    ) {
      toast.error("Please fill in all fields!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    const { confirmPassword, ...registerPayload } = formData;

    registerMutate(registerPayload, {
      onSuccess: (res: any) => {
        setTokens(res.accessToken, res.refreshToken);
        setAuth(res.user);
        toast.success("Registration successful! You are now logged in.");
        navigate("/send-otp-mobile");
      },
      onError: (err: any) => {
        const message =
          err?.response?.data?.message || err?.message || "Registration failed";
        toast.error("Registration failed: " + message);
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRegister();
  };

  // ── Shared field props ────────────────────────────────────────────────────

  const sharedFieldProps = {
    formData,
    showPassword,
    showConfirmPassword,
    onFieldChange: handleChange,
    onFieldBlur: handleBlur,
    onKeyPress: handleKeyPress,
    onTogglePassword: () => setShowPassword((v) => !v),
    onToggleConfirmPassword: () => setShowConfirmPassword((v) => !v),
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* ── Mobile (< md) ── */}
      <div className="md:hidden">
        <div className="container mx-auto px-4 py-6 max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Register to access the employee portal
            </p>
          </div>

          <RegisterHeroPanel variant="mobile" />

          <RegisterFormFields {...sharedFieldProps} isMobile />

          <Button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-medium text-base transition-all disabled:opacity-50 active:scale-[0.98] mt-6"
          >
            {isLoading ? <CommonSpinner /> : "Create Account"}
          </Button>

          <p className="text-center text-gray-600 pt-4 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ── Desktop (≥ md) ── */}
      <div className="hidden md:grid md:grid-cols-2 min-h-screen">
        {/* Left — form */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md xl:max-w-lg">
            <div className="mb-10">
              <h2 className="text-3xl xl:text-4xl font-bold text-gray-800 mb-3">
                Create Employee Account
              </h2>
              <p className="text-gray-600 xl:text-lg">
                Register to access the employee portal
              </p>
            </div>

            <RegisterFormFields {...sharedFieldProps} />

            <Button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 xl:py-4 rounded-lg font-medium text-base transition-all disabled:opacity-50 hover:shadow-md active:scale-[0.98] mt-6"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-gray-600 pt-5 text-base">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right — hero image */}
        <RegisterHeroPanel variant="desktop" />
      </div>
    </div>
  );
}