import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { Login } from "../domain/entities/login";
import { useLogin } from "./hooks/useLogin";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { LogInIcon, Eye, EyeOff, Loader2, Building2,Mail,Lock } from "lucide-react";
import { Link } from "react-router";

export default function LoginPage() {
  const [formData, setFormData] = useState<Login>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState<Record<string, boolean>>({
    email: false,
    password: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { mutate: LoginMutate, isPending: isLoading } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    LoginMutate(
      { email: formData.email, password: formData.password },
      {
        onSuccess: () => toast.success("Login successful"),
        onError: (err: any) =>
          toast.error("Login failed: " + err.message),
      }
    );
  };

  const handleFocus = (field: string) => {
    setIsFocused({ ...isFocused, [field]: true });
  };

  const handleBlur = (field: string) => {
    setIsFocused({ ...isFocused, [field]: false });
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
  <div className="w-full max-w-sm">
    <div className="rounded-2xl bg-white p-5 shadow-lg sm:p-7">

      {/* Badge */}
      <div className="mb-5 flex justify-center">
        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">
          <Building2 className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-medium text-blue-700">
            Employee Portal
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
          <LogInIcon className="h-5 w-5" />
        </div>

        <h1 className="text-xl font-semibold text-gray-900">
          Welcome Back
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Sign in to continue
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className={`text-sm ${
              isFocused.email ? "text-blue-600" : "text-gray-700"
            }`}
          >
            Email
          </Label>

          <div className="relative">
            {/* Left Icon */}
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="employee@company.com"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              className="h-11 rounded-lg pl-10 bg-gray-50 border-gray-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className={`text-sm ${
              isFocused.password ? "text-blue-600" : "text-gray-700"
            }`}
          >
            Password
          </Label>

          <div className="relative">
            {/* Left Icon */}
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              className="h-11 rounded-lg pl-10 pr-10 bg-gray-50 border-gray-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </div>

          <p className="text-xs text-gray-400">
            Minimum 6 characters
          </p>
        </div>

        {/* Forgot password */}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-xs text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-70"
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
      </form>

      {/* Footer */}
      <div className="mt-5 text-center">
        <p className="text-sm text-gray-600">
          New employee?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  </div>
</div>


  );
}