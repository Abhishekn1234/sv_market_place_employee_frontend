import { Calendar, DollarSign, Clock } from "lucide-react";
import type { Activity } from "../../domain/entities/activity";
import { useLanguage } from "@/context/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";

export function ActivityStats({ activities }: { activities: Activity[] }) {
  const { t, language } = useLanguage();
  const isRTL = language === "AR";

  const totalEarnings = activities
    .filter(a => a.status === "completed" && a.amount)
    .reduce((sum, a) => sum + (a.amount || 0), 0);
function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-gray-100">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl text-gray-900">{value}</p>
      </div>
    </div>
  );
}

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CommonCard className={`p-4 ${isRTL ? "md:order-3" : ""}`}>
        <Stat
          icon={<Calendar className="size-5 text-blue-600" />}
          label={t("totalBookings")}
          value={activities.filter(a => a.type === "booking").length}
        />
      </CommonCard>

      <CommonCard className="p-4">
        <Stat
          icon={<DollarSign className="size-5 text-green-600" />}
          label={t("totalEarned")}
          value={`$${totalEarnings}`}
        />
      </CommonCard>

      <CommonCard className={`p-4 ${isRTL ? "md:order-1" : ""}`}>
        <Stat
          icon={<Clock className="size-5 text-amber-600" />}
          label={t("Pending")}
          value={activities.filter(a => a.status === "pending").length}
        />
      </CommonCard>
    </div>
  );
}
