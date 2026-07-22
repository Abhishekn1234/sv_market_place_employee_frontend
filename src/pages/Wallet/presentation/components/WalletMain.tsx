"use client";

import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Receipt,
  Wallet,
} from "lucide-react";

import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import type { Transaction } from "../../domain/entities/transaction";
import type { WalletSummary } from "../../domain/entities/wallet";

import { useEffect, useRef, useState } from "react";
import CommonSpinner from "@/components/common/CommonSpinner";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/pages/Booking/AvaliableWorks/presentation/utils/formatdatetime";
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
  const { translations, t, language } = useLanguage();
  const walletT = translations.wallet;
   
  const currencyLabel = wallet?.currency ?? "USD";
  const locale = language === 'AR' ? 'ar-EG' : language === 'HI' ? 'hi-IN' : 'en-US';

  const formattedBalance = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyLabel,
    maximumFractionDigits: 2,
  }).format(totalBalance);
  const formattedCredit = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyLabel,
    maximumFractionDigits: 2,
  }).format(totalCredit);
  const formattedDebit = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyLabel,
    maximumFractionDigits: 2,
  }).format(totalDebit);
  const formattedNet = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyLabel,
    maximumFractionDigits: 2,
  }).format(totalCredit - totalDebit);

  const updatedAt = wallet?.updatedAt
    ? new Date(wallet.updatedAt).toLocaleString()
    : null;

  const [visibleCount, setVisibleCount] = useState(10);
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
     <CommonCard className="overflow-hidden border bg-card text-card-foreground">
  <div
    className="
      rounded-[28px]
      p-5 sm:p-7
      bg-gradient-to-br
      from-background
      via-muted/40
      to-muted/70
      dark:from-slate-900
      dark:via-slate-800
      dark:to-slate-900
    "
  >
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
          {walletT.totalBalance}
        </p>

        <p className="mt-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl break-all">
          {formattedBalance}
        </p>

        <p className="mt-3 text-sm text-muted-foreground">
          {walletT.monthlyGrowth}
        </p>
      </div>

      <div
        className="
          inline-flex h-16 w-16 items-center justify-center
          rounded-3xl
          bg-primary/10
          text-primary
          border border-primary/20
        "
      >
        <Wallet className="h-7 w-7" />
      </div>
    </div>

    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      {/* Income */}
      <div
        className="
          rounded-3xl
          border
          bg-background/80
          backdrop-blur-sm
          px-4 py-4
        "
      >
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {walletT.income}
        </p>

        <p className="mt-2 text-lg font-semibold text-green-600 break-all">
          {formattedCredit}
        </p>
      </div>

      {/* Expenses */}
      <div
        className="
          rounded-3xl
          border
          bg-background/80
          backdrop-blur-sm
          px-4 py-4
        "
      >
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {walletT.expenses}
        </p>

        <p className="mt-2 text-lg font-semibold text-red-600 break-all">
          {formattedDebit}
        </p>
      </div>

      {/* Net */}
      <div
        className="
          rounded-3xl
          border
          bg-background/80
          backdrop-blur-sm
          px-4 py-4
        "
      >
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t("wallet.net")}
        </p>

        <p className="mt-2 text-lg font-semibold text-foreground break-all">
          {formattedNet}
        </p>
      </div>
    </div>

    {updatedAt && (
      <p className="mt-5 text-sm text-muted-foreground">
        {t("wallet.updated")} {formatDateTime(updatedAt)}
      </p>
    )}
  </div>
</CommonCard>
      {/* QUICK ACTIONS */}
      <CommonCard>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">
                {walletT.quickActions}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('wallet.manageFunds')}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                <ArrowUpRight /> {walletT.addFunds}
              </Button>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <ArrowDownRight /> {walletT.withdraw}
              </Button>
            </div>
          </div>
        </div>
      </CommonCard>

      {/* TRANSACTIONS */}
      <CommonCard>
        <div className="p-4 sm:p-6 overflow-hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Receipt className="h-5 w-5" />
              {walletT.recentTransactions}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {(t as any)('wallet.showingOf', { current: visibleTransactions.length, total: transactions.length })}
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {visibleTransactions.length ? (
              visibleTransactions.map((txn: any) => (
                <div
                  key={txn.id}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 transition hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex items-start gap-3">
                    <div
                      className={`mt-1 flex h-11 w-11 items-center justify-center rounded-2xl ${
                        txn.type === "credit"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {txn.type === "credit" ? (
                        <ArrowUpRight className="h-5 w-5" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {txn.description}
                      </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(txn.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:text-right">
                    <p
                      className={`text-sm font-semibold ${
                        txn.type === "credit"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {txn.type === "credit" ? "+" : "-"}
                      {new Intl.NumberFormat(locale, {
                        style: "currency",
                        currency: currencyLabel,
                        maximumFractionDigits: 2,
                      }).format(txn.amount)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {txn.type === "credit" ? walletT.credit : walletT.debit}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
                {t('wallet.noTransactions')}
              </div>
            )}
          </div>

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
