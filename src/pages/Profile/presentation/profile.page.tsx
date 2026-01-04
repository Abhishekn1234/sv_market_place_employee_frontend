import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, MapPin } from "lucide-react";
import ProfileList from "./components/ProfileList";
import PasswordChanging from "./components/PasswordChanging";
import LocationSettings from "./components/LocationSettings";
import { useLanguage } from "@/context/LanguageContext";

type TabType = "profile" | "password" | "location";

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function ProfileSettings({ activeTab, setActiveTab }: Props) {
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

  // Listen to SW messages for tab changes (in case you want redundancy)
  useEffect(() => {
    const handleSWMessage = (event: MessageEvent) => {
      const { type, payload } = event.data || {};
      if (type === "NAVIGATE" && payload?.tab) {
        setActiveTab(payload.tab);
      }
    };
    navigator.serviceWorker?.addEventListener("message", handleSWMessage);
    return () =>
      navigator.serviceWorker?.removeEventListener("message", handleSWMessage);
  }, [setActiveTab]);

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

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="w-full">
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
            <TabsContent value="profile" className="m-0">
              <ProfileList />
            </TabsContent>
            <TabsContent value="password" className="m-0">
              <PasswordChanging onSuccess={() => setActiveTab("profile")} />
            </TabsContent>
            <TabsContent value="location" className="m-0">
              <LocationSettings setActiveTab={setActiveTab} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
