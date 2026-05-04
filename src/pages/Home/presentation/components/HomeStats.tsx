"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
} from "lucide-react";

import { useGetBookingHistory } from "@/pages/History/BookingHistory/presentation/hooks/useGetBookingHistory";
import { useLanguage } from "@/context/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import { calculateMonthlyRevenue } from "../helpers/calculatemonthlyrevenue";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6366f1", "#8b5cf6", "#ec4899"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function HomeStats() {
  const { data: bookingHistory } = useGetBookingHistory({
    page: 1,
    limit: 1000000000,
  });

  const { translations, language } = useLanguage();
  const isRTL = language === "AR";

  const bookings = bookingHistory?.data ?? [];
  const totalBookings =
    bookingHistory?.pagination?.totalItems ?? bookings.length;

  const monthlyRevenue = calculateMonthlyRevenue(bookings);

  // ✅ STATUS COUNTS (clean)
  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {};
    bookings.forEach((b) => {
      const s = b.status || "UNKNOWN";
      map[s] = (map[s] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({
      name: name.replace(/_/g, " "),
      value,
    }));
  }, [bookings]);

  // ✅ MONTHLY BOOKINGS
  const monthlyBookings = useMemo(() => {
    const counts = Array(12).fill(0);

    bookings.forEach((b) => {
      if (!b.assignedAt) return;
      const d = new Date(b.assignedAt);
      if (!isNaN(d.getTime())) {
        counts[d.getMonth()]++;
      }
    });

    return MONTHS.map((m, i) => ({
      month: m,
      bookings: counts[i],
    }));
  }, [bookings]);

  // ✅ REVENUE TREND (demo scaling)
  const revenueTrend = useMemo(() => {
    const base = monthlyRevenue || 0;

    return MONTHS.map((m, i) => ({
      month: m,
      revenue: Math.round(base * (0.6 + i * 0.05)),
    }));
  }, [monthlyRevenue]);

  // ✅ CLEAN COUNTS (no overlap)
  const completedStatuses = [
    "COMPLETED",
    "WORK_COMPLETED",
  ];

  const pendingStatuses = [
    "IN_PROGRESS",
    "REQUESTED",
    "CONFIRMED",
    "WORKER_ACCEPTED",
    "WORK_STARTED",
  ];

  const completedCount = bookings.filter((b) =>
    completedStatuses.includes(b.status)
  ).length;

  const pendingCount = bookings.filter((b) =>
    pendingStatuses.includes(b.status)
  ).length;

  const cancelledCount = bookings.filter((b) =>
    b.status?.includes("CANCELLED")
  ).length;

  const statCards = [
    {
      title: translations.HomePage.totalBookings,
      value: totalBookings,
      icon: ClipboardList,
      bg: "bg-indigo-100",
      text: "text-indigo-600",
    },
    {
      title: translations.HomePage.completed,
      value: completedCount,
      icon: CheckCircle2,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    {
      title: translations.HomePage.pending,
      value: pendingCount,
      icon: Clock,
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    {
      title: translations.HomePage.cancelled,
      value: cancelledCount,
      icon: XCircle,
      bg: "bg-red-100",
      text: "text-red-600",
    },
    {
      title: translations.HomePage.totalRevenue,
      value: `SAR ${monthlyRevenue.toLocaleString()}`,
      icon: TrendingUp,
      bg: "bg-emerald-100",
      text: "text-emerald-600",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto mt-6 space-y-6 px-2 sm:px-4">

      {/* ✅ STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {statCards.map((c) => (
          <CommonCard key={c.title} className="hover:shadow-md transition">
            <div
              className={`flex items-center justify-between p-4 ${
                isRTL ? "flex-row-reverse text-right" : ""
              }`}
            >
              <div>
                <p className="text-xs text-gray-500">{c.title}</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                  {c.value}
                </p>
              </div>

              <div
                className={`h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-xl ${c.bg}`}
              >
                <c.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${c.text}`} />
              </div>
            </div>
          </CommonCard>
        ))}
      </div>

      {/* ✅ CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ✅ PIE */}
        <CommonCard title={translations.HomePage.bookingStatus}>
          <div className="h-[280px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    statusCounts.length
                      ? statusCounts
                      : [{ name: "No Data", value: 1 }]
                  }
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  dataKey="value"
                >
                  {statusCounts.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CommonCard>

        {/* ✅ BAR */}
        <CommonCard title={translations.HomePage.monthlyBookings}>
          <div className="h-[300px] sm:h-[350px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="month"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />

                <YAxis  />
                <Tooltip />

                <Bar
                  dataKey="bookings"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CommonCard>

        {/* ✅ LINE */}
        <CommonCard
          title={translations.HomePage.revenueTrend}
          className="lg:col-span-2"
        >
          <div className="h-[300px] sm:h-[350px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="month"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />

                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CommonCard>

      </div>
    </div>
  );
}