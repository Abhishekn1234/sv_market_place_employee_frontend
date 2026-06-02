import { useLanguage } from "@/context/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import type { Transaction } from "../../domain/entities/transaction";
import type { WalletSummary } from "../../domain/entities/wallet";

type Props = {
  transactions: Transaction[];
  totalBalance: number;
  totalCredit: number;
  totalDebit: number;
  wallet?: WalletSummary;
};

export function WalletSidebar({
  transactions,
  totalBalance,
  totalCredit,
  totalDebit,
  wallet,
}: Props) {
  const { translations, language } = useLanguage();
  const walletT = translations.wallet;
  const currencyLabel = wallet?.currency ?? "USD";
  const locale = language === 'AR' ? 'ar-EG' : language === 'HI' ? 'hi-IN' : 'en-US';
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

// TODAY transactions
const todayTransactions = transactions.filter((tx: any) => {
  const date = new Date(tx.date);
  return date >= startOfToday && date <= now;
});

// MONTH transactions
const monthTransactions = transactions.filter((tx: any) => {
  const date = new Date(tx.date);
  return date >= startOfMonth && date <= now;
});
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Monthly Summary */}
      <CommonCard>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg sm:text-xl font-semibold">
              {walletT.monthlySummary}
            </h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {now.toLocaleString(locale, { month: 'long' })}
            </span>
          </div>

          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="flex justify-between gap-3">
              <span>{walletT.totalTransactions}</span>
              <span className="font-medium whitespace-nowrap tabular-nums">
                {transactions.length}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span>{walletT.avgTransaction}</span>
              <span className="font-medium whitespace-nowrap tabular-nums">
                {new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: currencyLabel,
                }).format(transactions.length
                  ? Math.round((totalCredit + totalDebit) / transactions.length)
                  : 0)}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span>{walletT.largestIncome}</span>
              <span className="text-emerald-600 font-semibold whitespace-nowrap tabular-nums">
                {new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: currencyLabel,
                }).format(Math.max(
                  0,
                  ...transactions
                    .filter((t) => t.type === "CREDIT")
                    .map((t) => t.amount)
                ))}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span>{walletT.largestExpense}</span>
              <span className="text-rose-600 font-semibold whitespace-nowrap tabular-nums">
                {new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: currencyLabel,
                }).format(Math.max(
                  0,
                  ...transactions
                    .filter((t) => t.type === "debit")
                    .map((t) => t.amount)
                ))}
              </span>
            </div>
          </div>
        </div>
      </CommonCard>

      {/* Wallet Insights */}
      <CommonCard className="text-slate-900">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            {walletT.walletInsights}
          </h3>

          <div className="grid gap-3 text-sm sm:grid-cols-1">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span>{walletT.availableBalance}</span>
                <span className="font-semibold tabular-nums">
                  {new Intl.NumberFormat(locale, {
                    style: "currency",
                    currency: currencyLabel,
                  }).format(totalBalance)}
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span>{walletT.transactionsToday}</span>
                <span className="font-semibold tabular-nums">
                  {todayTransactions.length}
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span>{walletT.monthlyGrowth}</span>
                <span className="font-semibold tabular-nums">
                  {monthTransactions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CommonCard>
    </div>
  );
}
