import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart, // ✅ correct
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { Card } from "@/components/ui/card";
import { ActivityIcon, BarChart3, DollarSign, TrendingUp } from "lucide-react";
import type { Activity } from "../../domain/entities/activity";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  earningsTrendData: {
    week: string;
    earnings: number;
  }[];

  activityTypeData: {
    name: string;
    value: number;
    color: string;
  }[];

  activityTrendData: {
    week: string;
    bookings: number;
    payments: number;
    transactions: number;
  }[];

  statusData: {
    name: string;
    value: number;
    color: string;
  }[];

  // 🔥 Key Insights data
  totalActivities: number;
  completedCount: number;
  totalEarnings: number;
   groupedActivities: Record<string, Activity[]>;
};


export default function ActivityAnalytics({
  earningsTrendData,
  activityTypeData,
  activityTrendData,
  statusData,
  totalActivities,
  completedCount,
  totalEarnings,
  groupedActivities,
}: Props) {
  const { language, t, translations } = useLanguage();
  const isRTL = language === "AR";

  const completionRate =
    totalActivities > 0
      ? ((completedCount / totalActivities) * 100).toFixed(1)
      : "0";

  const mostActiveDay =
    Object.entries(groupedActivities).reduce(
      (max, [date, acts]) =>
        acts.length > (groupedActivities[max]?.length || 0) ? date : max,
      Object.keys(groupedActivities)[0] || "N/A"
    );

  return (
    <div className={`space-y-6 ${isRTL ? "rtl" : "ltr"}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3 className="size-6 text-blue-600" />
        <h2 className="text-gray-900">{t("analytics")}</h2>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Trend */}
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">
            {translations.recentActivities.chart.earningsTrend}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={earningsTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="earnings" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Activity Type */}
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">
            {translations.recentActivities.chart.activityType}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={activityTypeData} dataKey="value" outerRadius={80}>
                {activityTypeData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Activity Trend */}
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">
            {translations.recentActivities.chart.activityTrend}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#3b82f6" />
              <Bar dataKey="payments" fill="#10b981" />
              <Bar dataKey="transactions" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">
            {translations.recentActivities.chart.statusDistribution}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} dataKey="value" outerRadius={80}>
                {statusData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">{t("analytics")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Insight
            title={t("completed")}
            value={`${completionRate}%`}
            icon={TrendingUp}
          />
          <Insight
            title={t("totalEarned")}
            value={`$${completedCount ? (totalEarnings / completedCount).toFixed(2) : 0}`}
            icon={DollarSign}
          />
          <Insight
            title={t("activity")}
            value={mostActiveDay.split(",")[0]}
            icon={ActivityIcon}
          />
        </div>
      </Card>
    </div>
  );
}


const Insight = ({ title, value, icon: Icon }: any) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="size-5 text-gray-600" />
      <p className="text-sm">{title}</p>
    </div>
    <p className="text-2xl">{value}</p>
  </div>
);

