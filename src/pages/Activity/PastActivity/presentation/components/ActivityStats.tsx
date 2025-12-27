import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
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
   const {language,t,translations}=useLanguage();
     const isRTL=language=="AR"
  return (
   <div
  className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${
    isRTL ? "md:[direction:rtl]" : "md:[direction:ltr]"
  }`}
>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="size-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{translations.recentActivities.chart.activityType}</p>
            <p className="text-2xl text-gray-900">{totalActivities}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle2 className="size-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{translations.recentActivities.status.completed}</p>
            <p className="text-2xl text-gray-900">{completedCount}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <DollarSign className="size-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{translations.recentActivities.chart.earningsTrend}</p>
            <p className="text-2xl text-gray-900">
              ${totalEarnings.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Clock className="size-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('Pending')}</p>
            <p className="text-2xl text-gray-900">{pendingCount}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
