import { useState } from "react";
import {
  Menu,
  Sun,
  Moon,
  Settings,
  LogOut,
  Globe,
  LanguagesIcon,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
const languages = [
  { code: "EN", label: "English", icon: <LanguagesIcon/> },
  { code: "AR", label: "Arabic", icon: "🇸🇦" },
  { code: "HI", label: "Hindi", icon: "🇮🇳" },
];
interface AppHeaderProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  mini: boolean;
  setMini: (mini: boolean) => void;
}

export default function AppHeader({
  mobileOpen,
  setMobileOpen,
  mini,
  setMini,
}: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
 const { language, setLanguage, translations } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  // const sidebarWidth = mini ? 64 : 288;

  // ✅ Read employee data safely
  const employeeData = localStorage.getItem("employeeData");
  const data = employeeData ? JSON.parse(employeeData) : null;

  const fullName =
    data?.user?.fullName || data?.fullName || "User";

  const profileImage = data?.user?.profilePictureUrl;


  // ✅ Logout logic
  const handleLogout = () => {
    toast.success("Logged out successfully");

    localStorage.removeItem("employeeid");
    localStorage.removeItem("employeetoken");
    localStorage.removeItem("employeeData");
    localStorage.removeItem("employee");
    localStorage.removeItem("employeeemail");

    setDropdownOpen(false);
    setMobileOpen(false);

    navigate("/login", { replace: true });
  };

  return (
 <header
  className={`flex items-center px-4 py-3 border-b transition-all ${
    theme === "dark"
      ? "border-gray-800 bg-gray-900 text-white"
      : "border-gray-200 bg-gray-50 text-gray-900"
  }`}
>

      {/* Sidebar toggle */}
      <Button
        variant="ghost"
        onClick={() =>
          window.innerWidth >= 1024
            ? setMini(!mini)
            : setMobileOpen(!mobileOpen)
        }
        className="p-2"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Right side controls */}
      <div className="flex items-center ml-auto gap-2">
        {/* Theme toggle */}
        <Button variant="ghost" onClick={toggleTheme} className="p-2">
          {theme === "light" ? (
            <Moon className="h-5 w-5 text-gray-700" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-400" />
          )}
        </Button>

        {/* Language dropdown */}
   {/* Language select */}
    <div className="relative inline-block">
  {/* Trigger button */}
  <Button
    onClick={() => setIsOpen(!isOpen)}
    className={`flex items-center gap-2 p-2 rounded border font-medium
      transition-none
      hover:bg-transparent
      active:bg-transparent
      focus:bg-transparent
      focus:ring-0
      ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700 text-white cursor-pointer"
          : "bg-white border-gray-300 text-gray-900 cursor-pointer"
      }
    `}
  >
    <Globe className="h-5 w-5" />
    <span>{language}</span>
  </Button>

  {/* Dropdown */}
  {isOpen && (
    <div className="absolute right-0 mt-2 w-36 rounded-md border shadow-lg overflow-hidden z-50">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => {
            setLanguage(lang.code as "EN" | "AR" | "HI");
            setIsOpen(false);
          }}
          className={`flex items-center gap-2 w-full px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
            theme === "dark" ? "hover:bg-gray-700" : ""
          }`}
        >
          <span>{lang.icon}</span>
     <span>
  {String(
    lang.code === "EN"
      ? translations.english
      : lang.code === "AR"
      ? translations.arabic
      : translations.hindi
  )}
</span>

        </button>
      ))}
    </div>
  )}
</div>





        {/* Profile dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center gap-2 p-1"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt={fullName}
                className={`h-8 w-8 rounded-full object-cover border ${
                  theme === "dark"
                    ? "border-gray-700"
                    : "border-gray-300"
                }`}
              />
            ) : (
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold border ${
                  theme === "dark"
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-gray-200 text-gray-800 border-gray-300"
                }`}
              >
                {fullName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}

            <span className="text-sm font-medium truncate max-w-[120px]">
              {fullName}
            </span>
          </Button>

          {dropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 ${
                theme === "dark"
                  ? "bg-gray-800 border border-gray-700 text-white"
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              <ul className="py-1">
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 gap-2"
                 onClick={()=>navigate('/settings/profile')} >
                    <Settings className="h-4 w-4" /> Profile Settings
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start px-4 py-2 gap-2 text-red-600"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </Button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

