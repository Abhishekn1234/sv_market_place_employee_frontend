"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  Sun,
  Moon,
  // Settings,
  // LogOut,
  // Globe,
  // LanguagesIcon,
} from "lucide-react";

import { useTheme } from "@/context/presentation/components/ThemeContext";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
// import { Switch } from "../ui/switch";

import { useWorkerStatus } from "@/pages/Home/presentation/hooks/useWorkerStatus";
import { useAuthStore } from "@/core/store/auth";
import { useProfile } from "@/pages/Profile/presentation/hooks/useProfile";
// import CommonSpinner from "../common/CommonSpinner";

import OnboardingDialog from "@/components/common/OnboardingDialog";
import HeaderGuide from "../../../common/HomeGuide";
import HeaderStatus from "../components/Header/HeaderStatus";
import HeaderLanguage from "../components/Header/HeaderLanguage";
import HeaderProfile from "../components/Header/HeaderProfile";
import { languages } from "../../data/languagesdropdown";

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
  console.log(isOnline);
  // FIRST LOGIN
  useEffect(() => {
    const done = localStorage.getItem(
      "onboarding_done"
    );

    if (!done) {
      setOnboardingOpen(true);
    }
  }, []);
  


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


    const statusProps = {
      isRTL,
      isOnline,
      workerStatus: !!workerStatus,
      loading,
      homeTranslations,
      handleToggle,
    };

    const languageProps = {
      isRTL,
      language,
      languages,
      langDropdownOpen,
      setLangDropdownOpen,
      setLanguage,
    };

    const profileProps = {
      isRTL,
      fullName,
      profileImage,
      dropdownOpen,
      translations,
      setDropdownOpen,
      handleLogout,
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
      dir={isRTL ? "rtl" : "ltr"}
      className={`flex items-center px-4 py-3 border-b transition-all ${
        theme === "dark"
          ? "border-gray-800 bg-gray-900 text-gray-100"
          : "border-gray-200 bg-gray-50 text-gray-900"
      }`}
    >
      <Button
        variant="ghost"
        onClick={() =>
          window.innerWidth >= 1024 ? setMini(!mini) : setMobileOpen(!mobileOpen)
        }
        className="p-2"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <HeaderStatus {...statusProps} />

        <Button variant="ghost" onClick={toggleTheme} className="p-2">
          {theme === "light" ? (
            <Moon className="h-5 w-5 text-gray-700" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-400" />
          )}
        </Button>

        <HeaderLanguage {...languageProps} />
        <HeaderProfile {...profileProps} />
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