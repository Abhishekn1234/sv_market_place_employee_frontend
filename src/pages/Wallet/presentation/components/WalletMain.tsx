"use client";

import {
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Calendar,
  Receipt,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import type { Transaction } from "../../domain/entities/transaction";
import type { WalletSummary } from "../../domain/entities/wallet";

import { useEffect, useRef, useState } from "react";
import CommonSpinner from "@/components/common/CommonSpinner";
import { Button } from "@/components/ui/button";

type Props = {
  transactions: Transaction[];
  totalBalance: number;
  totalCredit: number;
  totalDebit: number;
  wallet?: WalletSummary;
};

export function WalletMain({
  transactions,
  totalBalance,
  totalCredit,
  totalDebit,
  wallet,
}: Props) {
  const { translations,  } = useLanguage();
  const walletT = translations.wallet;
  // const isRTL = language === "AR";

  const currencyLabel = wallet?.currency ?? "USD";
  const formattedBalance = `${totalBalance.toLocaleString()} ${currencyLabel}`;

  const updatedAt = wallet?.updatedAt
    ? new Date(wallet.updatedAt).toLocaleString()
    : null;

  const [visibleCount, setVisibleCount] = useState(5);
  const [loadingMore, setLoadingMore] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const visibleTransactions = transactions.slice(0, visibleCount);

  // ✅ AUTO LOAD MORE (NO BUTTON)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && visibleCount < transactions.length) {
          setLoadingMore(true);

          setTimeout(() => {
            setVisibleCount((prev) => prev + 5);
            setLoadingMore(false);
          }, 600); // simulate API delay
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, transactions.length]);

  return (
    <div className="lg:col-span-2 space-y-4 sm:space-y-6">

      {/* BALANCE CARD */}
      <CommonCard className="text-black">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <p className="text-sm">{walletT.totalBalance}</p>
              <p className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">
                {formattedBalance}
              </p>

              <div className="flex flex-col gap-2 mt-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-black text-sm">
                    {walletT.monthlyGrowth}
                  </span>
                </div>

                {updatedAt && (
                  <span className="text-black text-xs sm:text-sm">
                    Updated: {updatedAt}
                  </span>
                )}
              </div>
            </div>

            <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 opacity-80" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <div className="bg-white/10 rounded-xl p-3 sm:p-4">
              <p className="text-black text-xs sm:text-sm">{walletT.income}</p>
              <p className="text-lg font-semibold text-black">
                {totalCredit.toLocaleString()}
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-3 sm:p-4">
              <p className="text-black text-xs sm:text-sm">{walletT.expenses}</p>
              <p className="text-lg font-semibold text-black">
                {totalDebit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CommonCard>

      {/* QUICK ACTIONS (UNCHANGED) */}
      <CommonCard>
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            {walletT.quickActions}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Button className="flex gap-3 p-4 border rounded-xl text-left">
              <ArrowUpRight className="text-green-600" />
              <div>
                <p className="font-semibold">{walletT.addFunds}</p>
              </div>
            </Button>

            <Button className="flex gap-3 p-4 border rounded-xl text-left">
              <ArrowDownRight className="text-rose-600" />
              <div>
                <p className="font-semibold">{walletT.withdraw}</p>
              </div>
            </Button>
          </div>
        </div>
      </CommonCard>

      {/* TRANSACTIONS */}
      <CommonCard>
        <div className="p-4 sm:p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Receipt className="w-5 h-5" />
            {walletT.recentTransactions}
          </h3>

          <div className="space-y-4">
            {visibleTransactions.map((txn: any) => (
              <div
                key={txn.id}
                className="flex justify-between items-center p-4 border rounded-xl"
              >
                <div className="flex gap-3">
                  {txn.type === "credit" ? (
                    <ArrowUpRight className="text-green-600" />
                  ) : (
                    <ArrowDownRight className="text-rose-600" />
                  )}

                  <div>
                    <p className="font-medium">{txn.description}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {txn.date}
                    </div>
                  </div>
                </div>

                <p
                  className={`font-bold ${
                    txn.type === "credit"
                      ? "text-green-600"
                      : "text-rose-600"
                  }`}
                >
                  {txn.type === "credit" ? "+" : "-"} SAR {txn.amount}
                </p>
              </div>
            ))}
          </div>

          {/* 👇 AUTO TRIGGER LOADER */}
          {visibleCount < transactions.length && (
            <div ref={loaderRef} className="flex justify-center py-4">
              {loadingMore && <CommonSpinner />}
            </div>
          )}
        </div>
      </CommonCard>
    </div>
  );
}
