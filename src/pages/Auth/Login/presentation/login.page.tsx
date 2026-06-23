import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Briefcase } from "lucide-react";

import type { Login } from "../domain/entities/login";
import { useLogin } from "./hooks/useLogin";
import { useAuthStore } from "@/core/store/auth";
import { getOnboardingStatus } from "@/pages/Servicesettings/presentation/helpers/documentstatus";
import LoginHeroPanel from "./components/LoginHeroPanel";
import LoginFormFields from "./components/LoginFormFields";



export default function LoginPage() {
  const [formData, setFormData] = useState<Login>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: loginMutate, isPending: isLoading } = useLogin();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setTokens = useAuthStore((s) => s.setTokens);
  const navigate = useNavigate();

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleFieldChange = (field: keyof Login, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    loginMutate(formData, {
      onSuccess: (data) => {
        setTokens(data.accessToken, data.refreshToken);

        if (data.user) {
          setAuth({
            ...data.user,
            worker: { ...data.user.worker, status: "OFFLINE" },
          });
        }

        const status = getOnboardingStatus(data.user);

        if (status === "COMPLETED" || status === "PENDING" || status === "IN_PROGRESS") {
          navigate("/");
        } else if (status === "REJECTED") {
          navigate("/services/documents");
        } else {
          navigate("/services/employee");
        }

        toast.success("Login successfully");
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";
        toast.error(message);
      },
    });
  };

  // ── Shared form props ─────────────────────────────────────────────────────

  const sharedFormProps = {
    formData,
    showPassword,
    isLoading,
    onFieldChange: handleFieldChange,
    onTogglePassword: () => setShowPassword((v) => !v),
    onSubmit: handleSubmit,
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100">
      {/* ── Mobile (< lg) ── */}
      <div className="lg:hidden min-h-screen flex flex-col px-6 py-8">
        {/* Brand header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">WorkSpace Pro</h1>
              <p className="text-xs text-slate-500">Employee Portal</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-sm text-slate-600">Sign in to your employee account</p>
        </div>

        <LoginHeroPanel variant="mobile" />

        <LoginFormFields {...sharedFormProps} isMobile />
      </div>

      {/* ── Desktop (≥ lg) ── */}
      <div className="hidden lg:flex min-h-screen w-full">
        {/* Left — form */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-full max-w-lg">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Welcome Back</h2>
            <p className="text-slate-600 mb-10">Sign in to your employee account</p>

            <LoginFormFields {...sharedFormProps} />
          </div>
        </div>

        {/* Right — hero image */}
        <LoginHeroPanel variant="desktop" />
      </div>
    </div>
  );
}