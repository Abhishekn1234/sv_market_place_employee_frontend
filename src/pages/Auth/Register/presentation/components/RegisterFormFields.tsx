import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, User, Mail, KeyRound, PhoneCallIcon } from "lucide-react";
import type { Register } from "../../domain/entities/register";


interface RegisterFormFieldsProps {
  formData: Register;
  showPassword: boolean;
  showConfirmPassword: boolean;
  isMobile?: boolean;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFieldBlur: (field: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

export default function RegisterFormFields({
  formData,
  showPassword,
  showConfirmPassword,
  isMobile = false,
  onFieldChange,
  onFieldBlur,
  onKeyPress,
  onTogglePassword,
  onToggleConfirmPassword,
}: RegisterFormFieldsProps) {
  const inputHeight = isMobile ? "h-12" : "h-12 xl:h-14";
  const labelSize = isMobile ? "text-sm" : "text-base";
  const iconLeft = isMobile ? "left-3" : "left-3.5";
  const idSuffix = isMobile ? "" : "-desktop";

  return (
    <div className={isMobile ? "space-y-5" : "space-y-6"}>
      {/* Full Name */}
      <div>
        <Label htmlFor={`fullName${idSuffix}`} className={`${labelSize} font-medium`}>
          Full Name
        </Label>
        <div className="relative mt-1 md:mt-2">
          <Input
            id={`fullName${idSuffix}`}
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={onFieldChange}
            onBlur={() => onFieldBlur("fullName")}
            onKeyPress={onKeyPress}
            className={`pl-10 ${inputHeight} text-base`}
          />
          <User className={`absolute ${iconLeft} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
        </div>
      </div>

      {/* Email */}
      <div>
        <Label htmlFor={`email${idSuffix}`} className={`${labelSize} font-medium`}>
          Email Address
        </Label>
        <div className="relative mt-1 md:mt-2">
          <Input
            id={`email${idSuffix}`}
            name="email"
            type="email"
            placeholder="john@company.com"
            value={formData.email}
            onChange={onFieldChange}
            onBlur={() => onFieldBlur("email")}
            onKeyPress={onKeyPress}
            className={`pl-10 ${inputHeight} text-base`}
          />
          <Mail className={`absolute ${iconLeft} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
        </div>
      </div>

      {/* Phone */}
      <div>
        <Label className={`${labelSize} font-medium block mb-1`}>Phone</Label>
        <div className="relative">
          <PhoneCallIcon className={`absolute ${iconLeft} top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none`} />
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onFieldChange}
            onBlur={() => onFieldBlur("phone")}
            onKeyPress={onKeyPress}
            placeholder="e.g., +1234567890"
            inputMode="numeric"
            className={`pl-10 ${inputHeight} w-full text-base`}
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <Label htmlFor={`password${idSuffix}`} className={`${labelSize} font-medium`}>
          Password
        </Label>
        <div className="relative mt-1 md:mt-2">
          <Input
            id={`password${idSuffix}`}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={onFieldChange}
            onBlur={() => onFieldBlur("password")}
            onKeyPress={onKeyPress}
            className={`pl-10 pr-12 ${inputHeight} text-base`}
          />
          <KeyRound className={`absolute ${iconLeft} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <Label htmlFor={`confirmPassword${idSuffix}`} className={`${labelSize} font-medium`}>
          Confirm Password
        </Label>
        <div className="relative mt-1 md:mt-2">
          <Input
            id={`confirmPassword${idSuffix}`}
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={onFieldChange}
            onBlur={() => onFieldBlur("confirmPassword")}
            onKeyPress={onKeyPress}
            className={`pl-10 pr-12 ${inputHeight} text-base`}
          />
          <KeyRound className={`absolute ${iconLeft} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
          <button
            type="button"
            onClick={onToggleConfirmPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}