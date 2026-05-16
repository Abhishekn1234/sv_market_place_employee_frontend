"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Wallet, ReceiptText, Coins } from "lucide-react";
import { useGetMyWalletStatistics } from "../hooks/useStats";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { CommonCard } from "@/components/common/CommonCard";
import CommonSpinner from "@/components/common/CommonSpinner";

type RevenueFilter =
  | "today"
  | "7_days"
  | "30_days"
  | "3_months"
  | "all";



function Card({
  title,
  value,
  icon: Icon,
  sub,
}: {
  title: string;
  value: string | number | React.ReactNode;
  icon: any;
  sub?: string;
}) {
 return (
  <CommonCard
    title={
      <div className="flex items-center justify-between w-full">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
    }
    value={
      <h2 className="text-xl font-semibold text-gray-900">
        {value ?? "-"}
      </h2>
    }
    description={
      sub ? <p className="text-xs text-gray-400">{sub}</p> : undefined
    }
    className="rounded-2xl shadow-sm border bg-white"
    contentClassName="pt-0"
  />
);
}

export default function WalletDashboard() {
  const [revenueFilter, setRevenueFilter] =
    useState<RevenueFilter>("all");
  const {translations} = useLanguage();
  const { data: walletStats, isLoading } =
    useGetMyWalletStatistics(revenueFilter);
    
const filters: { label: string; value: RevenueFilter }[] = [
  { label: translations.HomePage.stats.filters.today, value: "today" },
  { label: translations.HomePage.stats.filters["7_days"], value: "7_days" },
  { label: translations.HomePage.stats.filters["30_days"], value: "30_days" },
  { label: translations.HomePage.stats.filters["3_months"], value: "3_months" },
  { label: translations.HomePage.stats.filters.all, value: "all" },
];
  const avgPerTxn = useMemo(() => {
    if (!walletStats?.transactionCount) return 0;
    return (
      walletStats.totalEarned / walletStats.transactionCount
    );
  }, [walletStats]);

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* HEADER */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold">
        {translations.HomePage.stats.title}
        </h1>
        <p className="text-sm text-gray-500">
          {translations.HomePage.stats.subtitle}
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2  md:justify-center">
        {filters.map((f) => (
          <Button
            key={f.value}
            variant="ghost"
            onClick={() => setRevenueFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition ${
              revenueFilter === f.value
                ? "bg-black text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title={translations.HomePage.stats.cards.totalEarned.title}
          value={
            isLoading
              ? <CommonSpinner />
              : `${walletStats?.totalEarned ?? 0} ${walletStats?.currency ?? ""}`
          }
          icon={TrendingUp}
          sub={translations.HomePage.stats.cards.totalEarned.sub}
        />

        <Card
          title={translations.HomePage.stats.cards.currentBalance.title}
          value={
            isLoading
              ? <CommonSpinner />
              : `${walletStats?.currentBalance ?? 0} ${walletStats?.currency ?? ""}`
          }
          icon={Wallet}
          sub={translations.HomePage.stats.cards.currentBalance.sub}
        />

        <Card
          title={translations.HomePage.stats.cards.transactions.title}
          value={isLoading ? <CommonSpinner /> : walletStats?.transactionCount ?? 0}
          icon={ReceiptText}
          sub={translations.HomePage.stats.cards.transactions.sub}
        />

        <Card
          title={translations.HomePage.stats.cards.avgTransaction.title}
          value={
            isLoading
              ? <CommonSpinner/>
              : `${avgPerTxn.toFixed(2)} ${walletStats?.currency ?? ""}`
          }
          icon={Coins}
          sub={translations.HomePage.stats.cards.avgTransaction.sub}
        />
      </div>

      {/* FOOTER */}
      <div className="text-xs text-gray-400 text-center">
        {walletStats?.period
          ? `${translations.HomePage.stats.footer}: ${walletStats.period}`
          : "—"}
      </div>
    </div>
  );
}