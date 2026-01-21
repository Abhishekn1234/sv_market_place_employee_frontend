"use client";

import { User, Lock, MapPin } from "lucide-react";
import ProfileList from "./components/ProfileList/ProfileList";
import PasswordChanging from "./components/Password/PasswordChanging";
import LocationSettings from "./components/Location/LocationSettings";
import { useLanguage } from "@/context/LanguageContext";
import CommonTabs from "@/components/common/CommonTabs";
import type { CommonTab } from "@/components/common/CommonTabs";
import type { TabType } from "../domain/entities/tabtype";

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function ProfileSettings({ activeTab, setActiveTab }: Props) {
  const { language, t } = useLanguage();
  const isRTL = language === "AR";

  const tabs: CommonTab[] = [
    {
      value: "profile",
      label: t("profile"),
      icon: <User />,
      content: <ProfileList />
    },
    {
      value: "password",
      label: t("password"),
      icon: <Lock />,
      content: <PasswordChanging onSuccess={() => setActiveTab("profile")} />
    },
    {
      value: "location",
      label: t("location"),
      icon: <MapPin />,
      content: <LocationSettings setActiveTab={setActiveTab} />
    }
  ];

  return (
    <div className={`w-full h-full overflow-hidden ${isRTL ? "rtl" : "ltr"}`}>
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-4">
          <h1 className={`text-2xl md:text-3xl font-bold ${isRTL ? "text-right" : "text-left"}`}>
            {t("profileSettings")}
          </h1>
          <p className={`text-sm text-gray-600 ${isRTL ? "text-right" : "text-left"}`}>
            {t("profileSettingsSubtitle") || "Manage your account settings and preferences"}
          </p>
        </div>

        <CommonTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isRTL={isRTL}
        />
      </div>
    </div>
  );
}
