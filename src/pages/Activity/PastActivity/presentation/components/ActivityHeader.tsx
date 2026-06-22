import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BarChart3, Download } from "lucide-react";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useTheme } from "@/context/presentation/components/ThemeContext";

interface ActivityHeaderProps {
  employeeName: string;
  employeeId: string;
  showAnalytics: boolean;
  setShowAnalytics: (v: boolean) => void;
}

export default function ActivityHeader({
  employeeName,
  employeeId,
  showAnalytics,
  setShowAnalytics,
}: ActivityHeaderProps) {
  const { language, translations } = useLanguage();
  const pa = translations.pastActivities;
  const isRTL = language === "AR";
  const { theme } = useTheme();

  return (
    <div
      className={`
        flex flex-col gap-4
        md:flex-row md:items-start md:justify-between
        ${isRTL ? "md:flex-row-reverse" : ""}
      `}
    >
      {/* Left section */}
      <div className="flex flex-col gap-3 text-center md:text-left">
        <h1 className={`${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
          {pa.pageTitle}
        </h1>

        <div
          className={`
            flex items-center gap-3
            justify-center md:justify-start
            ${isRTL ? "md:flex-row-reverse" : ""}
          `}
        >
          <Avatar className="size-10">
            <AvatarFallback className="bg-blue-600 text-white">
              {employeeName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className={isRTL ? "text-right" : "text-left"}>
            <p className={`${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
              {employeeName}
            </p>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {employeeId}
            </p>
          </div>
        </div>
      </div>

      {/* Right section (Buttons) */}
      <div
        className={`
          flex flex-col gap-2 w-full
          sm:flex-row sm:w-auto
          ${isRTL ? "sm:flex-row-reverse" : ""}
        `}
      >
        <Button
          variant="outline"
          className="gap-2 w-full sm:w-auto"
        >
          <Download className="size-4" />
          {pa.export}
        </Button>

        <Button
          variant="outline"
          className="gap-2 w-full sm:w-auto"
          onClick={() => setShowAnalytics(!showAnalytics)}
        >
          <BarChart3 className="size-4" />
          {pa.analytics}
        </Button>
      </div>
    </div>
  );
}
