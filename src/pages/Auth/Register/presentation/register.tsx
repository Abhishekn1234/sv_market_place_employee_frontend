import { useState } from "react";
import type { Register } from "../domain/entities/register";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRegister } from "./hooks/useRegister";
import { Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon, LockIcon, User, Mail, KeyRound, Building2 } from "lucide-react";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [formData, setFormData] = useState<Register>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { mutate: registerMutate, isPending: isLoading } = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setTouched({
      ...touched,
      [e.target.name]: true,
    });
  };

  const handleBlur = (field: string) => {
    setTouched({
      ...touched,
      [field]: true,
    });
  };

  const handleRegister = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
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
     const {confirmPassword,...registerPayload}=formData
    
    registerMutate(registerPayload, {
      onSuccess: () => toast.success("Registration successful!"),
      onError: (err: any) => toast.error("Registration failed: " + err.message),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 md:p-6">
      <div className="bg-white shadow-lg sm:shadow-xl md:shadow-2xl rounded-xl sm:rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 md:p-8 border border-gray-200/80">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl shadow-sm sm:shadow-md mb-3 sm:mb-4">
            <LockIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
            Create Employee Account
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base">
            Register to access the employee portal
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-3 sm:space-y-4">
          {/* Full Name */}
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="fullName" className="text-gray-700 font-medium text-xs sm:text-sm">
              Full Name
            </Label>
            <div className="relative">
              <Input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                onChange={handleChange}
                onBlur={() => handleBlur("fullName")}
                onKeyPress={handleKeyPress}
                value={formData.fullName}
                className={`pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base ${touched.fullName && !formData.fullName ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
              />
              <User className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            {touched.fullName && !formData.fullName && (
              <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">Full name is required</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium text-xs sm:text-sm">
              Email Address
            </Label>
            <div className="relative">
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="john.doe@company.com"
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                onKeyPress={handleKeyPress}
                value={formData.email}
                className={`pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base ${touched.email && !formData.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
              />
              <Mail className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            {touched.email && !formData.email && (
              <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">Email is required</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium text-xs sm:text-sm">
              Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="At least 6 characters"
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                onKeyPress={handleKeyPress}
                value={formData.password}
                className={`pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base ${touched.password && formData.password.length < 6 ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
              />
              <KeyRound className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <EyeOffIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>
            </div>
            {touched.password && formData.password.length < 6 && (
              <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">Password must be at least 6 characters</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium text-xs sm:text-sm">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter your password"
                onChange={handleChange}
                onBlur={() => handleBlur("confirmPassword")}
                onKeyPress={handleKeyPress}
                value={formData.confirmPassword}
                className={`pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base ${touched.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
              />
              <KeyRound className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? (
                  <EyeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <EyeOffIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>
            </div>
            {touched.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">Passwords do not match</p>
            )}
          </div>
        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={isLoading}
          className="mt-5 sm:mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-xs sm:text-sm">Creating Account...</span>
            </span>
          ) : (
            "Create Employee Account"
          )}
        </button>

        {/* Login Link */}
        <p className="mt-4 sm:mt-5 text-center text-gray-600 text-xs sm:text-sm">
          Already have an employee account?{" "}
          <Link 
            to="/login" 
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
          >
            Sign in here
          </Link>
        </p>

        {/* Company Note */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs">For company employees only</span>
          </div>
        </div>
      </div>
    </div>
  );
}