import { Calendar, DollarSign, Clock } from "lucide-react";
import type { Activity } from "../../domain/entities/activity";
import { useLanguage } from "@/context/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import { useTheme } from "@/context/ThemeContext";

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div
        className={`p-2 rounded-lg ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
        }`}
      >
        {icon}
      </div>

      <div className="leading-tight">
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-300" : "text-gray-400"
          }`}
        >
          {label}
        </p>
        <p
          className={`font-medium ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}


export function ActivityStats({ activities }: { activities: Activity[] }) {
  const { language, translations } = useLanguage();
  const ra = translations.recentActivities;
  const isRTL = language === "AR";

  const totalEarnings = activities
    .filter((a) => a.amount)
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Bookings */}
      <CommonCard
        className={`p-4 flex justify-center sm:justify-start ${
          isRTL ? "lg:order-3" : ""
        }`}
      >
        <Stat
          icon={<Calendar className="size-5 text-blue-600" />}
          label={ra.types.booking}
          value={activities.filter((a) => a.type === "booking").length}
        />
      </CommonCard>

      {/* Earnings */}
      <CommonCard className="p-4 flex justify-center sm:justify-start">
        <Stat
          icon={<DollarSign className="size-5 text-green-600" />}
          label={ra.charts.earningsTrend}
          value={`SAR${totalEarnings}`}
        />
      </CommonCard>

      {/* Pending */}
      <CommonCard
        className={`p-4 flex justify-center sm:justify-start ${
          isRTL ? "lg:order-1" : ""
        }`}
      >
        <Stat
          icon={<Clock className="size-5 text-amber-600" />}
          label={ra.status.pending}
          value={activities.filter((a) => a.status === "pending").length}
        />
      </CommonCard>
    </div>
  );
}


