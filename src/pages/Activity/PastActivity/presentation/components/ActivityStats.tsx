import { CommonCard } from "@/components/common/CommonCard";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { BarChart3, CheckCircle2, Clock, DollarSign } from "lucide-react";

interface ActivityStatsProps {
  totalActivities: number;
  completedCount: number;
  pendingCount: number;
  totalEarnings: number;
}

export function ActivityStats({
  totalActivities,
  completedCount,
  pendingCount,
  totalEarnings,
}: ActivityStatsProps) {
  const { language, translations } = useLanguage();
  const isRTL = language === "AR";
  const { theme } = useTheme();
  const pa = translations.pastActivities;

  return (
    <div
      className={`
        grid gap-4
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        md:grid-cols-4
        xl:grid-cols-4
        ${isRTL ? "lg:grid-flow-col-dense" : ""}
      `}
    >
      <StatCard
        icon={<BarChart3 className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        label={pa.stats.totalActivities}
        value={totalActivities}
        theme={theme}
      />

      <StatCard
        icon={<CheckCircle2 className="size-5 text-green-600" />}
        iconBg="bg-green-100"
        label={pa.stats.completed}
        value={completedCount}
        theme={theme}
      />

      <StatCard
        icon={<DollarSign className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        label={pa.stats.totalEarnings}
        value={`SAR ${totalEarnings.toLocaleString()}`}
        theme={theme}
      />

      <StatCard
        icon={<Clock className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        label={pa.stats.pending}
        value={pendingCount}
        theme={theme}
      />
    </div>
  );
}


/* ----------------------- */
/* Reusable Stat Card     */
/* ----------------------- */

function StatCard({
  icon,
  iconBg,
  label,
  value,
  theme,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  theme: "light" | "dark";
}) {
  return (
    <CommonCard className="p-4 sm:p-5">
      <div className="flex items-center gap-3 sm:gap-4">
        <div
          className={`shrink-0 p-2 sm:p-2.5 rounded-lg ${iconBg}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p
            className={`text-xs sm:text-sm truncate ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {label}
          </p>
          <p
            className={`text-xl sm:text-2xl font-semibold ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </CommonCard>
  );
}
