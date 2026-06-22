import { useLanguage } from "@/context/presentation/components/LanguageContext";
import type { Activity } from "../../domain/entities/activity";
import type { TimePeriod } from "../../domain/entities/timeperiod";
import { useTheme } from "@/context/presentation/components/ThemeContext";

type Props = {
  getPeriodLabel: (period: TimePeriod) => string;
  selectedPeriod: TimePeriod;
  filteredActivities: Activity[];
};

export default function ActivityCurrent({
  getPeriodLabel,
  selectedPeriod,
  filteredActivities,
}: Props) {
  const { language, translations } = useLanguage();
  const isRTL = language === "AR";
  const { theme } = useTheme();
  const pa = translations.pastActivities;
  const count = filteredActivities.length;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="
        flex flex-col sm:flex-row
        items-start sm:items-center
        justify-between
        gap-1 sm:gap-2
      "
    >
      <div className={isRTL ? "text-right" : "text-left"}>
        {/* Period title */}
        <h2
          className={`
            text-base sm:text-lg font-semibold
            ${theme === "dark" ? "text-gray-100" : "text-gray-900"}
          `}
        >
          {getPeriodLabel(selectedPeriod)}
        </h2>

        {/* Count */}
        <p
          className={`
            text-xs sm:text-sm
            ${theme === "dark" ? "text-gray-400" : "text-gray-600"}
          `}
        >
          {pa.current.showing} {count}{" "}
          {count === 1
            ? pa.current.activity
            : pa.current.activities}
        </p>
      </div>
    </div>
  );
}

