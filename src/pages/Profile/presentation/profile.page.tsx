import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, MapPin } from "lucide-react";
import ProfileList from "./components/ProfileList";
import PasswordChanging from "./components/PasswordChanging";
import LocationSettings from "./components/LocationSettings"; // new component
import { useLanguage } from "@/context/LanguageContext";

type TabType = "profile" | "password" | "location";

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const { language, t } = useLanguage();
  const isRTL = language === "AR";

  const tabTriggerClass = `
    relative h-12 px-0 bg-transparent rounded-none
    text-gray-600 shadow-none
    focus:outline-none focus-visible:ring-0
    after:absolute after:left-0 after:bottom-0
    after:h-[2px] after:w-full after:bg-blue-600
    after:scale-x-0 after:origin-left
    after:transition-transform after:duration-200
    data-[state=active]:text-blue-600
    data-[state=active]:after:scale-x-100
    hover:text-blue-600
  `;

  return (
    <div className={`w-full h-full overflow-hidden ${isRTL ? "rtl" : "ltr"}`}>
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1
            className={`text-2xl md:text-3xl font-bold ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("profileSettings")}
          </h1>

          <p
            className={`text-sm text-gray-600 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("profileSettingsSubtitle") ||
              "Manage your account settings and preferences"}
          </p>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}
          className="w-full"
        >
          <div className="sticky top-0 z-10">
            <TabsList
              className={`h-12 w-full gap-6 bg-transparent p-0 border-none shadow-none ${
                isRTL ? "justify-end flex-row-reverse" : "justify-start"
              }`}
            >
              <TabsTrigger value="profile" className={tabTriggerClass}>
                <User className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {t("profile")}
              </TabsTrigger>

              <TabsTrigger value="password" className={tabTriggerClass}>
                <Lock className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {t("password")}
              </TabsTrigger>

              <TabsTrigger value="location" className={tabTriggerClass}>
                <MapPin className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {t("location")}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-3 md:p-4">
            {/* PROFILE */}
            <TabsContent value="profile" className="m-0">
              <ProfileList />
            </TabsContent>

            {/* PASSWORD */}
            <TabsContent value="password" className="m-0">
              <PasswordChanging onSuccess={() => setActiveTab("profile")} />
            </TabsContent>

            {/* LOCATION */}
            <TabsContent value="location" className="m-0">
              <LocationSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}



