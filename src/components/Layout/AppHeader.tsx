"use client";

import { useState, useEffect } from "react";
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
import { useProfile } from "@/pages/Profile/presentation/hooks/useProfile";
import CommonSpinner from "../common/CommonSpinner";

import OnboardingDialog from "@/components/common/OnboardingDialog";
import HeaderGuide from "../common/HomeGuide";

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
  const { language, setLanguage, translations } =
    useLanguage();

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const [langDropdownOpen, setLangDropdownOpen] =
    useState(false);

  const [onboardingOpen, setOnboardingOpen] =
    useState(false);

  const [showHeaderGuide, setShowHeaderGuide] =
    useState(false);

  const { data: profile } = useProfile();
  const { user, logout } = useAuthStore();

  const fullName =
    profile?.fullName ||
    user?.fullName ||
    "User";

  const profileImage =
    profile?.profilePictureUrl ||
    user?.profilePictureUrl;

  const workerStatus = useAuthStore(
    (s) => s.user?.worker?.status
  );

  const { updateStatus, loading } =
    useWorkerStatus();

  const homeTranslations =
    translations.HomePage;

  const isRTL = language === "AR";

  const isOnline =
    workerStatus === "ONLINE";

  // FIRST LOGIN
  useEffect(() => {
    const done = localStorage.getItem(
      "onboarding_done"
    );

    if (!done) {
      setOnboardingOpen(true);
    }
  }, []);

  // STEPS
  const steps = [
    {
      id: "status",
      title: "Set your status",
      description:
        "Go online to receive jobs",
      actionLabel: "Go Online",
      done: isOnline,
      onAction: () => updateStatus(true),
    },

    {
      id: "language",
      title: "Choose language",
      description:
        "Select your preferred language",
      actionLabel: "Open",
      done: !!language,
      onAction: () =>
        setLangDropdownOpen(true),
    },

    {
      id: "profile",
      title: "Complete profile",
      description:
        "Open profile settings and update your details",
      actionLabel: "Open Profile",
      done: !!profile,
      onAction: () =>
        navigate("/settings/profile"),
    },
  ];

  const allDone = steps.every(
    (s) => s.done
  );

  // AUTO CLOSE
  useEffect(() => {
    if (allDone && onboardingOpen) {
      const t = setTimeout(() => {
        setOnboardingOpen(false);

        localStorage.setItem(
          "onboarding_done",
          "true"
        );

        setShowHeaderGuide(true);
      }, 800);

      return () => clearTimeout(t);
    }
  }, [allDone, onboardingOpen]);

  const handleToggle = (
    checked: boolean
  ) => {
    updateStatus(checked);
  };

  const handleLogout = () => {
    toast.success(
      "Logged out successfully"
    );

    logout();

    setDropdownOpen(false);
    setMobileOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <>
      {/* GUIDE */}
      <HeaderGuide
        open={showHeaderGuide}
        onClose={() =>
          setShowHeaderGuide(false)
        }
        // title="Header Controls"
        // description="Use the top controls to go online, change language, and manage your profile settings."
      />

      {/* HEADER */}
      <header
        className={`flex items-center px-4 py-3 border-b transition-all ${
          theme === "dark"
            ? "border-gray-800 bg-gray-900 text-gray-100"
            : "border-gray-200 bg-gray-50 text-gray-900"
        }`}
      >
        {/* MENU */}
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

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* STATUS */}
          <div
            className={`flex items-center gap-3 ${
              isRTL
                ? "flex-row-reverse"
                : ""
            }`}
          >
            <Switch
              checked={isOnline}
              onCheckedChange={
                handleToggle
              }
              disabled={
                loading ||
                !workerStatus
              }
            />

            <span
              className={`text-sm font-medium ${
                isOnline
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              {workerStatus ? (
                isOnline ? (
                  homeTranslations.online
                ) : (
                  homeTranslations.offline
                )
              ) : (
                <CommonSpinner />
              )}
            </span>
          </div>

          {/* THEME */}
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="p-2"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-gray-700" />
            ) : (
              <Sun className="h-5 w-5 text-yellow-400" />
            )}
          </Button>

          {/* LANGUAGE */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() =>
                setLangDropdownOpen(
                  !langDropdownOpen
                )
              }
            >
              <Globe className="h-5 w-5" />

              <span>{language}</span>
            </Button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg z-50">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant="ghost"
                    onClick={() => {
                      setLanguage(
                        lang.code as
                          | "EN"
                          | "AR"
                          | "HI"
                      );

                      setLangDropdownOpen(
                        false
                      );
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                  >
                    <span>
                      {lang.icon}
                    </span>

                    {lang.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() =>
                setDropdownOpen(
                  (p) => !p
                )
              }
              className="flex items-center gap-2"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  {fullName?.slice(
                    0,
                    2
                  )}
                </div>
              )}

              <span className="text-sm">
                {fullName}
              </span>
            </Button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2"
                  onClick={() =>
                    navigate(
                      "/settings/profile"
                    )
                  }
                >
                  <Settings className="h-4 w-4" />

                  {
                    translations.sidebar
                      .profileSettings
                  }
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />

                  {
                    translations.sidebar
                      .logout
                  }
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ONBOARDING */}
      <OnboardingDialog
        open={onboardingOpen}
        onOpenChange={
          setOnboardingOpen
        }
        steps={steps}
      />
    </>
  );
}