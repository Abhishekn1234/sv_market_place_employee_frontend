import { useState } from "react";
import type { Register } from "../domain/entities/register";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRegister } from "./hooks/useRegister";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, User, Mail, KeyRound, PhoneCallIcon } from "lucide-react";
import { toast } from "react-toastify";
import { COUNTRIES } from "./components/phonenumberformat";

export default function RegisterPage() {
  const [formData, setFormData] = useState<Register>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone:""
  });
  const [country, setCountry] = useState(COUNTRIES[0]); // default India

  const navigate = useNavigate();
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value.replace(/\D/g, "");

  if (value.length <= country.max) {
    setFormData(prev => ({
      ...prev,
      phone: value,
    }));
  }
};
const handleCountryChange = (iso: string) => {
  const selected = COUNTRIES.find(c => c.iso === iso)!;
  setCountry(selected);

  // Reset phone when country changes
  setFormData(prev => ({
    ...prev,
    phone: "",
  }));
};

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
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
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
      onSuccess: () => {toast.success("Registration successful!"),navigate("/login");},
      onError: (err: any) => toast.error("Registration failed: " + err.message),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Mobile View (0px - 767px) */}
      <div className="md:hidden">
        <div className="container mx-auto px-4 py-6 max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Register to access the employee portal
            </p>
          </div>

          {/* Mobile Image */}
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <div className="relative h-48">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
                alt="Employee Signup"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-900/40 to-transparent flex items-end p-5">
                <div className="text-white">
                  <h3 className="text-lg font-bold mb-1">Welcome to the Team</h3>
                  <p className="text-sm text-blue-100">Join our professional workforce</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative mt-1">
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("fullName")}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 text-base"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 text-base"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium mt-4 block">
                  Phone
                </Label>
                <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} onBlur={() => handleBlur("phone")} onKeyPress={handleKeyPress} placeholder="e.g., +1234567890" className="mt-1 pl-10 h-12 text-base w-full" />
               <PhoneCallIcon/>
              </div>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  onKeyPress={handleKeyPress}
                  className="pl-10 pr-12 h-12 text-base"
                />
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  onKeyPress={handleKeyPress}
                  className="pl-10 pr-12 h-12 text-base"
                />
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 p-1"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-medium text-base transition-all disabled:opacity-50 active:scale-[0.98] mt-2"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600 pt-4 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Desktop View (768px and above) */}
      <div className="hidden md:grid md:grid-cols-2 min-h-screen">
        {/* Left Side - Form (768px and above) */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md xl:max-w-lg">
            {/* Header */}
            <div className="mb-10">
              <h2 className="text-3xl xl:text-4xl font-bold text-gray-800 mb-3">
                Create Employee Account
              </h2>
              <p className="text-gray-600 xl:text-lg">
                Register to access the employee portal
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <Label htmlFor="fullName-desktop" className="text-base font-medium">
                  Full Name
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="fullName-desktop"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={() => handleBlur("fullName")}
                    onKeyPress={handleKeyPress}
                    className="pl-11 h-12 xl:h-14 text-base"
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email-desktop" className="text-base font-medium">
                  Email Address
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="email-desktop"
                    name="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    onKeyPress={handleKeyPress}
                    className="pl-11 h-12 xl:h-14 text-base"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
             <div className="mt-4">
  <Label className="text-sm font-medium block mb-1">
    Phone
  </Label>

  <div className="flex">
    {/* Country Dropdown */}
    <select
      value={country.iso}
      onChange={(e) => handleCountryChange(e.target.value)}
      className="h-12 rounded-l-lg border  px-3  text-sm"
    >
      {COUNTRIES.map(c => (
        <option key={c.iso} value={c.iso}>
          {c.flag} {c.code}
        </option>
      ))}
    </select>

    {/* Phone Input */}
    <div className="relative flex-1">
      <PhoneCallIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      <Input
        type="tel"
        value={formData.phone}
        onChange={handlePhoneChange}
        placeholder={`${country.max} digit number`}
        className="h-12 w-full pl-10 rounded-l-none"
        inputMode="numeric"
      />
    </div>
  </div>
</div>


              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password-desktop" className="text-base font-medium">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="password-desktop"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    onKeyPress={handleKeyPress}
                    className="pl-11 pr-12 h-12 xl:h-14 text-base"
                  />
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword-desktop" className="text-base font-medium">
                  Confirm Password
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="confirmPassword-desktop"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur("confirmPassword")}
                    onKeyPress={handleKeyPress}
                    className="pl-11 pr-12 h-12 xl:h-14 text-base"
                  />
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                  </button>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 xl:py-4 rounded-lg font-medium text-base transition-all disabled:opacity-50 hover:shadow-md active:scale-[0.98] mt-2"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>

              {/* Login Link */}
              <p className="text-center text-gray-600 pt-5 text-base">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image (768px and above) */}
        <div className="relative bg-gray-900">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            alt="Employee Signup"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-900/40 to-transparent flex items-end p-8 xl:p-12">
            <div className="text-white max-w-lg xl:max-w-xl">
              <h3 className="text-2xl xl:text-3xl 2xl:text-4xl font-bold mb-3 xl:mb-4">
                Welcome to the Team
              </h3>
              <p className="text-base xl:text-lg 2xl:text-xl text-blue-100">
                Join our professional workforce and manage your tasks efficiently with our comprehensive employee portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}