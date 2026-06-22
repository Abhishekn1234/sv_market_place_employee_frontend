import { CommonCard } from "@/components/common/CommonCard";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useTheme } from "@/context/presentation/components/ThemeContext";
import { Calendar } from "lucide-react";

export function ActivityEmptyState() {
  const { language, translations } = useLanguage();
  const isRTL = language === "AR";
  const { theme } = useTheme();
  const pa = translations.pastActivities;

  return (
    <CommonCard className="p-6 sm:p-8 md:p-12">
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="flex flex-col items-center text-center"
      >
        
        <div
          className={`
            inline-flex items-center justify-center
            size-12 sm:size-14 md:size-16
            rounded-full mb-4
            ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}
          `}
        >
          <Calendar className="size-6 sm:size-7 md:size-8 text-gray-400" />
        </div>

        {/* Title */}
        <h3
          className={`
            text-base sm:text-lg font-semibold mb-2
            ${theme === "dark" ? "text-gray-100" : "text-gray-900"}
          `}
        >
          {pa.emptyState.title}
        </h3>

        {/* Description */}
        <p
          className={`
            text-sm sm:text-base max-w-xs sm:max-w-md
            ${theme === "dark" ? "text-gray-400" : "text-gray-600"}
          `}
        >
          {pa.emptyState.description}
        </p>
      </div>
    </CommonCard>
  );
}
