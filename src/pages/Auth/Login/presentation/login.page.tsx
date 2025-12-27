import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { Login } from "../domain/entities/login";
import { useLogin } from "./hooks/useLogin";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  ChevronRight,
  Sparkles,
  Users,
  Shield,
  Briefcase,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

export default function LoginPage() {
  const [formData, setFormData] = useState<Login>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
 const navigate = useNavigate();
  const { mutate: LoginMutate, isPending: isLoading } = useLogin();



const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    toast.error("Please fill in all fields");
    return;
  }

  LoginMutate(formData, {
    onSuccess: () => {
      toast.success("Login successful");
      navigate("/services/employee");
    },
    onError: (err: any) => {
      toast.error("Login failed: " + (err?.message || "Something went wrong"));
    },
  });
};


  return (
    /* 🌍 GLOBAL BACKGROUND — SAME FOR ALL */
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100">
      
      {/* ================= MOBILE VIEW ================= */}
      <div className="lg:hidden min-h-screen flex flex-col px-6 py-8">
        {/* Header */}
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

          <h2 className="text-xl font-bold text-slate-900">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-600">
            Sign in to your employee account
          </p>
        </div>

        {/* Image */}
        <div className="relative h-40 rounded-xl overflow-hidden mb-6">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
            className="h-full w-full object-cover"
            alt="Team"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-indigo-600/40" />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-5 space-y-4"
        >
          {/* Email */}
          <div>
            <Label className="text-sm text-slate-700">Work Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-11 pl-10 border-slate-200"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between mb-1">
              <Label className="text-sm text-slate-700">Password</Label>
              <Link to="/forgot-password" className="text-xs text-blue-600">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="h-11 pl-10 pr-10 border-slate-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                ) : (
                  <Eye className="h-4 w-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-center text-sm text-slate-600">
            New employee?{" "}
            <Link to="/register" className="text-blue-600">
              Create account
            </Link>
          </p>
        </form>
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden lg:flex min-h-screen w-full">
        {/* Left - Form */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-full max-w-lg">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Welcome Back
            </h2>
            <p className="text-slate-600 mb-10">
              Sign in to your employee account
            </p>

          <form onSubmit={handleSubmit} className="space-y-6">
  {/* Email */}
  <div>
    <Label className="text-sm">Work Email</Label>
    <div className="relative mt-2">
      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      <Input
        type="email"
        placeholder="name@company.com"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
        className="h-14 pl-12"
      />
    </div>

    {/* ✅ Forgot password after email */}
    <div className="mt-2 text-right">
      <Link
        to="/forgot-password"
        className="text-sm text-blue-600 hover:underline"
      >
        Forgot password?
      </Link>
    </div>
  </div>

  {/* Password */}
  <div>
    <Label className="text-sm">Password</Label>
    <div className="relative mt-2">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
        className="h-14 pl-12 pr-12"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2"
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5 text-slate-400" />
        ) : (
          <Eye className="h-5 w-5 text-slate-400" />
        )}
      </button>
    </div>
  </div>

  {/* Submit */}
  <Button
    type="submit"
    disabled={isLoading}
    className="h-14 w-full bg-gradient-to-r from-blue-500 to-indigo-600"
  >
    {isLoading ? (
      <>
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Signing in...
      </>
    ) : (
      <>
        Sign In
        <ChevronRight className="ml-2 h-5 w-5" />
      </>
    )}
  </Button>

  {/* ✅ Register link */}
  <p className="text-center text-sm text-slate-600">
    New employee?{" "}
    <Link
      to="/register"
      className="text-blue-600 font-medium hover:underline"
    >
      Create account
    </Link>
  </p>
</form>

          </div>
        </div>

        {/* Right - FULL HEIGHT IMAGE */}
        <div className="relative flex-1 min-h-screen">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
            className="absolute inset-0 h-full w-full object-cover"
            alt="Team"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-transparent" />

          <div className="relative z-10 h-full flex items-end p-16 text-white">
            <div>
              <h3 className="text-4xl font-bold mb-4">
                Work Better, Together
              </h3>
              <p className="text-lg text-blue-100 mb-8">
                Secure access • Team collaboration • All-in-one tools
              </p>

              <div className="flex gap-6">
                <Feature icon={<Shield />} text="Secure" />
                <Feature icon={<Users />} text="Team" />
                <Feature icon={<Sparkles />} text="All-in-One" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Small helper */
function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
      {icon}
      <span>{text}</span>
    </div>
  );
}
