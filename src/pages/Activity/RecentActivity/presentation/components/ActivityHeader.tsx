import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  employeeName: string;
  employeeId: string;
  totalEarnings: number;
  completedBookings: number;
}

export function ActivityHeader({
  employeeName,
  employeeId,
  totalEarnings,
  completedBookings,
}: Props) {
  const { language, translations } = useLanguage();
  const ra = translations.recentActivities;
  const isRTL = language === "AR";
  const { theme } = useTheme();

  return (
    <div
      className={`
        flex flex-col gap-4
        sm:gap-6
        lg:flex-row lg:items-start lg:justify-between
        ${isRTL ? "lg:flex-row-reverse text-right" : "text-left"}
      `}
    >
      {/* Left: Title + Employee */}
      <div className="space-y-3">
        <h1
          className={`
            text-lg sm:text-xl font-semibold
            ${theme === "dark" ? "text-gray-100" : "text-gray-900"}
          `}
        >
          {ra.pageTitle}
        </h1>

        <div
          className={`flex items-center gap-3 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <Avatar className="size-10 shrink-0">
            <AvatarFallback className="bg-blue-600 text-white">
              {employeeName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p
              className={`font-medium truncate ${
                theme === "dark" ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {employeeName}
            </p>
            <p
              className={`text-sm truncate ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {employeeId}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Stats */}
      <div
        className={`
          flex flex-row gap-6
          sm:gap-8
          lg:flex-col lg:gap-1
          ${isRTL ? "text-right" : "text-left lg:text-right"}
        `}
      >
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {ra.charts.earningsTrend}
        </p>

        <p
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          }`}
        >
          SAR {totalEarnings.toFixed(2)}
        </p>

        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-400"
          }`}
        >
          {completedBookings} {ra.types.booking}
        </p>
      </div>
    </div>
  );
}
