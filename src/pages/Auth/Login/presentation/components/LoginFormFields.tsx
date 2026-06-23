import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import CommonSpinner from "@/components/common/CommonSpinner";
import type { Login } from "../../domain/entities/login";

interface LoginFormFieldsProps {
  formData: Login;
  showPassword: boolean;
  isLoading: boolean;
  isMobile?: boolean;
  onFieldChange: (field: keyof Login, value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginFormFields({
  formData,
  showPassword,
  isLoading,
  isMobile = false,
  onFieldChange,
  onTogglePassword,
  onSubmit,
}: LoginFormFieldsProps) {
  if (isMobile) {
    return (
      <form
        onSubmit={onSubmit}
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
              onChange={(e) => onFieldChange("email", e.target.value)}
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
              onChange={(e) => onFieldChange("password", e.target.value)}
              className="h-11 pl-10 pr-10 border-slate-200"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onTogglePassword}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-slate-400" />
              ) : (
                <Eye className="h-4 w-4 text-slate-400" />
              )}
            </Button>
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
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <Label className="text-sm">Work Email</Label>
        <div className="relative mt-2">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            className="h-14 pl-12"
          />
        </div>
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
            onChange={(e) => onFieldChange("password", e.target.value)}
            className="h-14 pl-12 pr-14"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onTogglePassword}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-slate-400" />
            ) : (
              <Eye className="h-5 w-5 text-slate-400" />
            )}
          </Button>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="h-14 w-full bg-gradient-to-r from-blue-500 to-indigo-600"
      >
        {isLoading ? (
          <CommonSpinner color="white" />
        ) : (
          <>
            Sign In
            <ChevronRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>

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
  );
}