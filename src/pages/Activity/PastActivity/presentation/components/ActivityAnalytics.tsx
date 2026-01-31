"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import {
  ActivityIcon,
  BarChart3,
  DollarSign,
  TrendingUp,
} from "lucide-react";

import type { Activity } from "../../domain/entities/activity";
import { useLanguage } from "@/context/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";

type Props = {
  earningsTrendData: { week: string; earnings: number }[];
  activityTypeData: { name: string; value: number; color: string }[];
  activityTrendData: {
    week: string;
    bookings: number;
    payments: number;
    transactions: number;
  }[];
  statusData: { name: string; value: number; color: string }[];
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
  const { language, translations } = useLanguage();
  const isRTL = language === "AR";
  const pa = translations.pastActivities;

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
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3 className="size-5 sm:size-6 text-blue-600" />
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          {pa.pageTitle}
        </h2>
      </div>

      <p className="text-sm text-gray-500">{pa.timeline}</p>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      
        <CommonCard className="p-4 sm:p-6">
          <h3 className="mb-3 text-sm sm:text-base">
            {pa.chart.earningsTrend}
          </h3>

          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={earningsTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12 }}
                reversed={isRTL}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CommonCard>

        {/* Activity Type */}
        <CommonCard className="p-4 sm:p-6">
          <h3 className="mb-3 text-sm sm:text-base">
            {pa.chart.activityType}
          </h3>

          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={activityTypeData}
                dataKey="value"
                outerRadius={70}
              >
                {activityTypeData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CommonCard>

        {/* Activity Trend */}
        <CommonCard className="p-4 sm:p-6">
          <h3 className="mb-3 text-sm sm:text-base">
            {pa.chart.activityTrend}
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={activityTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12 }}
                reversed={isRTL}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#3b82f6" />
              <Bar dataKey="payments" fill="#10b981" />
              <Bar dataKey="transactions" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CommonCard>

        {/* Status */}
        <CommonCard className="p-4 sm:p-6">
          <h3 className="mb-3 text-sm sm:text-base">
            {pa.chart.statusDistribution}
          </h3>

          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                outerRadius={70}
              >
                {statusData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CommonCard>
      </div>

      {/* Insights */}
      <CommonCard className="p-4 sm:p-6">
        <h3 className="mb-4 text-sm sm:text-base">{pa.analytics}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Insight
            title={pa.insights.completionRate}
            value={`${completionRate}%`}
            icon={TrendingUp}
          />

          <Insight
            title={pa.insights.averageEarnings}
            value={`$${completedCount
              ? (totalEarnings / completedCount).toFixed(2)
              : 0}`}
            icon={DollarSign}
          />

          <Insight
            title={pa.insights.mostActiveDay}
            value={mostActiveDay.split(",")[0]}
            icon={ActivityIcon}
          />
        </div>
      </CommonCard>
    </div>
  );
}

/* ---------------- Insights ---------------- */

type InsightProps = {
  title: string;
  value: string;
  icon: React.ElementType;
};

const Insight = ({ title, value, icon: Icon }: InsightProps) => (
  <div className="p-4 rounded-lg h-full">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="size-4 sm:size-5" />
      <p className="text-sm ">{title}</p>
    </div>
    <p className="text-xl sm:text-2xl font-semibold">{value}</p>
  </div>
);
