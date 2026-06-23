"use client";

import { useMemo } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
} from "lucide-react";

import { useGetBookingHistory } from "@/pages/History/BookingHistory/presentation/hooks/useGetBookingHistory";
import { useGetMyWalletStatistics } from "../hooks/useStats";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import WalletDashboard from "./RevenueCards";




export default function HomeStats() {
  const { translations, language } = useLanguage();
  const isRTL = language === "AR";

  // ✅ Wallet stats FIXED
  const { data: walletStats } = useGetMyWalletStatistics();

  const { data: bookingHistory } = useGetBookingHistory({
    page: 1,
    limit: 1000000,
  });

  const bookings = bookingHistory?.data ?? [];

  // ================= BOOKINGS =================
  const totalBookings =
    bookingHistory?.pagination?.totalItems ?? bookings.length;

  const completedStatuses = ["COMPLETED", "WORK_COMPLETED"];
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

  // ================= MONTHLY BOOKINGS =================
const MONTHS = useMemo(() => {
  const months = translations?.HomePage?.months;

  if (!months) return [];

  // If months is an array
  if (Array.isArray(months)) {
    return months;
  }

  // If months is an object with keys 1-12
  return Array.from(
    { length: 12 },
    (_, index:any) =>
      months[String(index + 1)] ??
      months[index + 1] ??
      ""
  );
}, [translations, language]);

const monthlyBookings = useMemo(() => {
  const counts = Array(12).fill(0);

  bookings.forEach((b) => {
    const date = new Date(b.assignedAt || b.completedAt);

    if (!isNaN(date.getTime())) {
      counts[date.getMonth()]++;
    }
  });

  return MONTHS.map((month, index) => ({
    month,
    bookings: counts[index],
  }));
}, [bookings, MONTHS]);

// console.log("Language:", language);
// console.log("Months:", MONTHS);
// console.log("Chart Data:", monthlyBookings);

  // ================= STATS =================
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
      value: `${walletStats?.currency ?? "SAR"} ${walletStats?.totalEarned ?? 0}`,
      icon: TrendingUp,
      bg: "bg-emerald-100",
      text: "text-emerald-600",
    },
  ];

  return (
   <div className="w-full max-w-7xl mx-auto mt-4 sm:mt-6 space-y-6 px-3 sm:px-4 overflow-x-hidden">
  <div className="w-full overflow-x-hidden">
      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 gap-4 min-w-0">
        {statCards.map((card) => (
          <CommonCard key={card.title}>
            <div
              className={`flex items-center justify-between p-4 min-w-0 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
                          <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                  {card.title}
                </p>

                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {card.value}
                </p>
              </div>

              <div className={`h-10 w-10 flex items-center justify-center rounded-xl ${card.bg}`}>
                <card.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${card.text}`} />
              </div>
            </div>
          </CommonCard>
        ))}
      </div>

      <WalletDashboard />

      {/* ================= CHARTS ================= */}
      <div className="flex flex-col gap-6 w-full min-w-0">
       <CommonCard title={translations.HomePage.monthlyBookings}>
  <div className="h-[260px] sm:h-[320px] md:h-[380px] w-full min-w-0 overflow-hidden">
    <ResponsiveContainer
      key={`container-${language}`}
      width="100%"
      height="100%"
    >
      <BarChart
        key={`chart-${language}`}
        data={monthlyBookings}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="month"
          tick={{ fontSize: 10 }}
          interval={0}
          angle={-15}
          textAnchor="end"
          height={50}
          tickMargin={10}
        />

        <YAxis tick={{ fontSize: 10 }} />

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
      </div>
      </div>
    </div>
  );
}