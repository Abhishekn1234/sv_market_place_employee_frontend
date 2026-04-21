"use client";

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
import { Switch } from "../ui/switch";

import { useWorkerStatus } from "@/pages/Home/presentation/hooks/useWorkerStatus";
import { useAuthStore } from "@/core/store/auth";


const languages = [
  { code: "EN", label: "English", icon: <LanguagesIcon /> },
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
  const { language, setLanguage, translations } = useLanguage();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // ✅ Select only what we need (better re-render control)
  const fullName = useAuthStore((s) => s.user?.fullName);
  const profileImage = useAuthStore((s) => s.user?.profilePictureUrl);
  const workerStatus = useAuthStore((s) => s.user?.worker?.status);
  const logout = useAuthStore((s) => s.logout);


  const { updateStatus, loading } = useWorkerStatus();

  const homeTranslations = translations.HomePage;
  const isRTL = language === "AR";

  const isOnline = workerStatus === "ONLINE";
  // const canToggle =
  //   workerStatus === "ONLINE" || workerStatus === "OFFLINE";

const handleToggle = (checked: boolean) => {
  updateStatus(checked);
};

  const handleLogout = () => {
    toast.success("Logged out successfully");
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header
      className={`flex items-center px-4 py-3 border-b transition-all ${
        theme === "dark"
          ? "border-gray-800 bg-gray-900 text-gray-100"
          : "border-gray-200 bg-gray-50 text-gray-900"
      }`}
    >
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

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        {/* 🔹 Worker Status */}
       <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
  <Switch
    checked={isOnline}
    onCheckedChange={handleToggle}
    disabled={loading || !workerStatus} // disable until loaded
  />

  <span
    className={`text-sm font-medium ${
      isOnline ? "text-green-600" : "text-gray-500"
    }`}
  >
    {workerStatus
      ? isOnline
        ? homeTranslations.online
        : homeTranslations.offline
      : "Loading..."}
  </span>
</div>

        {/* 🔹 Theme Toggle */}
        <Button variant="ghost" onClick={toggleTheme} className="p-2">
          {theme === "light" ? (
            <Moon className="h-5 w-5 text-gray-700" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-400" />
          )}
        </Button>

        {/* 🔹 Language Dropdown */}
        <div className="relative">
          <Button
          variant="ghost"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-2 p-2 rounded border cursor-pointer"
          >
            <Globe className="h-5 w-5" />
            <span>{language}</span>
          </Button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 rounded-md border shadow-lg z-50 bg-white text-black">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as "EN" | "AR" | "HI");
                    setLangDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <span>{lang.icon}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 🔹 Profile Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center gap-2 p-1"
            onClick={() => setDropdownOpen((p) => !p)}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt={fullName}
                className="h-8 w-8 rounded-full object-cover border"
              />
            ) : (
              <div className="h-8 w-8 rounded-full flex items-center justify-center font-semibold bg-gray-300">
                {fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium truncate max-w-[120px]">
              {fullName || "User"}
            </span>
          </Button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white border z-50">
              <ul className="py-1">
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 gap-2"
                    onClick={() => navigate("/settings/profile")}
                  >
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