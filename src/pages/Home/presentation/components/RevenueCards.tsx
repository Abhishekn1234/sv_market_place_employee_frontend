"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Wallet, ReceiptText, Coins } from "lucide-react";
import { useGetMyWalletStatistics } from "../hooks/useStats";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { Button } from "@/components/ui/button";

import CommonSpinner from "@/components/common/CommonSpinner";
import type { RevenueFilter } from "../../domain/entities/revenuetype";
import { Card } from "./HomeCard";
import { getRevenueFilters } from "../helpers/filtershome";

export default function WalletDashboard() {
  const [revenueFilter, setRevenueFilter] =
    useState<RevenueFilter>("all");
  const {translations} = useLanguage();
  const { data: walletStats, isLoading } =
    useGetMyWalletStatistics(revenueFilter);
const filters = getRevenueFilters(translations);
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