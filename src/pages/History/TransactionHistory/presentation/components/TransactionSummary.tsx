"use client";

import { DollarSign, Calendar, Filter } from "lucide-react";

import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useTheme } from "@/context/presentation/components/ThemeContext";
import { CommonCard } from "@/components/common/CommonCard";
import { useTransactionHistory } from "../hooks/useTransaction";

export default function TransactionSummary() {
  const { translations, language } = useLanguage();
  const { theme } = useTheme();
  const { data, isLoading } = useTransactionHistory();

  const transactions = data?.data ?? [];
  const isRTL = language === "AR";

  const stats = translations.transactionHistory.stats;

  // ✅ Calculations
  const totalPaid = transactions
    .filter((t) => t.type === "CREDIT")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter((t) => t.type === "DEBIT")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter((t) => t.source === "BOOKING_PAYMENT")
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) =>
   new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
  }).format(amount);

  return (
    <div
      className={`
        grid gap-2 sm:gap-3 md:gap-4
        grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
        ${isRTL ? "direction-rtl" : ""}
      `}
    >
      {/* Total Paid */}
      <SummaryCard
        title={stats.totalPaid}
        value={isLoading ? "..." : formatCurrency(totalPaid)}
        subtitle={stats.completedTransactions}
        icon={<DollarSign className="w-4 h-4 text-green-600" />}
        theme={theme}
      />

      {/* Total Spent */}
      <SummaryCard
        title={stats.totalSpent ?? "Total Spent"}
        value={isLoading ? "..." : formatCurrency(totalSpent)}
        subtitle={stats.spentTransactions ?? "Debited transactions"}
        icon={<DollarSign className="w-4 h-4 text-red-600" />}
        theme={theme}
      />

      {/* Pending */}
      <SummaryCard
        title={stats.pendingPayments}
        value={isLoading ? "..." : formatCurrency(pendingAmount)}
        subtitle={stats.pendingTransactions}
        icon={<Calendar className="w-4 h-4 text-yellow-600" />}
        theme={theme}
      />

      {/* Total Count */}
      <SummaryCard
        title={stats.allTime}
        value={isLoading ? "..." : transactions.length}
        subtitle={stats.totalTransactions}
        icon={<Filter className="w-4 h-4 text-blue-600" />}
        theme={theme}
      />
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  theme: "light" | "dark";
}) {
  const { language } = useLanguage();
  const isRTL = language === "AR";

  return (
    <CommonCard className="p-3 sm:p-4">
      <div
        className={`flex items-center justify-between mb-2 gap-2 ${
          isRTL ? "flex-row-reverse text-right" : ""
        }`}
      >
        <h3 className="text-xs sm:text-sm font-medium line-clamp-1">{title}</h3>
        {icon}
      </div>

      <div className="text-lg sm:text-2xl font-semibold line-clamp-1">{value}</div>
      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{subtitle}</p>
    </CommonCard>
  );
}