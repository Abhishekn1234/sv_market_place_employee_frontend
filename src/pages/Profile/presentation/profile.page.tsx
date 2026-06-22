"use client";

import { User, Lock, MapPin } from "lucide-react";
import ProfileList from "./components/ProfileList/ProfileList";
import PasswordChanging from "./components/Password/PasswordChanging";
import LocationSettings from "./components/Location/LocationSettings";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import CommonTabs from "@/components/common/CommonTabs";
import type { CommonTab } from "@/components/common/CommonTabs";
import type { TabType } from "../domain/entities/tabtype";

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function ProfileSettings({ activeTab, setActiveTab }: Props) {
  const { language, translations } = useLanguage();
  const isRTL = language === "AR";

  const tabs: CommonTab[] = [
    {
      value: "profile",
      label: translations.profile.profile,
      icon: <User className="w-4 h-4 md:w-5 md:h-5" />,
      content: <ProfileList />
    },
    {
      value: "password",
      label: translations.profile.password,
      icon: <Lock className="w-4 h-4 md:w-5 md:h-5" />,
      content: <PasswordChanging onSuccess={() => setActiveTab("profile")} />
    },
    {
      value: "location",
      label: translations.profile.location,
      icon: <MapPin className="w-4 h-4 md:w-5 md:h-5" />,
      content: <LocationSettings setActiveTab={setActiveTab} />
    }
  ];

  return (
    <div
      className={`w-full min-h-screen overflow-x-hidden ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1
            className={`text-xl sm:text-2xl md:text-3xl font-bold ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {translations.profile.profileSettings}
          </h1>
        </div>

        {/* Tabs */}
        <div className="w-full overflow-x-auto">
          <CommonTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isRTL={isRTL}
          />
        </div>
      </div>
    </div>
  );
}
