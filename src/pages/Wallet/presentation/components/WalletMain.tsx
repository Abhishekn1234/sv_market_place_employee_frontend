"use client";

import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Receipt,
  Wallet,
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
      <CommonCard className="overflow-hidden text-white">
        <div className="rounded-[28px] bg-linear-to-r from-slate-900 via-violet-900 to-blue-700 p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-300">
                {walletT.totalBalance}
              </p>
              <p className="mt-3 text-3xl sm:text-4xl font-bold leading-tight">
                {formattedBalance}
              </p>
              <p className="mt-3 text-sm text-slate-200">
                {walletT.monthlyGrowth}
              </p>
            </div>

            <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-slate-100 shadow-lg shadow-slate-900/20">
              <Wallet className="h-7 w-7" />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/10 px-4 py-4 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                {walletT.income}
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {formattedCredit}
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 px-4 py-4 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                {walletT.expenses}
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {formattedDebit}
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 px-4 py-4 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                {t('wallet.net')}
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {formattedNet}
              </p>
            </div>
          </div>

          {updatedAt && (
            <p className="mt-5 text-sm text-slate-300">
              {t('wallet.updated')} {updatedAt}
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
              <p className="text-sm text-slate-500">
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
            <p className="text-sm text-slate-500">
              {(t as any)('wallet.showingOf', { current: visibleTransactions.length, total: transactions.length })}
            </p>
          </div>

          <div className="space-y-3 mt-4">
            {visibleTransactions.length ? (
              visibleTransactions.map((txn: any) => (
                <div
                  key={txn.id}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-slate-100 sm:flex-row sm:items-center sm:justify-between"
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
                      <p className="font-semibold text-slate-900 truncate">
                        {txn.description}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span>{txn.date}</span>
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
                    <p className="mt-1 text-xs text-slate-500">
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
