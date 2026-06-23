import { useLanguage } from "@/context/presentation/components/LanguageContext";
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
    <div className="lg:sticky lg:top-4 space-y-4 sm:space-y-6">
      {/* Monthly Summary */}
      <CommonCard>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg sm:text-xl font-semibold">
              {walletT.monthlySummary}
            </h3>
            <span className="inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {now.toLocaleString(locale, { month: 'long' })}
            </span>
          </div>

          <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300 min-w-0">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
              <span className="shrink-0">{walletT.totalTransactions}</span>
              <span className="font-medium tabular-nums break-words sm:text-right">
                {transactions.length}
              </span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
              <span className="shrink-0">{walletT.avgTransaction}</span>
              <span className="font-medium tabular-nums break-all sm:text-right">
                {new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: currencyLabel,
                }).format(transactions.length
                  ? Math.round((totalCredit + totalDebit) / transactions.length)
                  : 0)}
              </span>
            </div>

            {/* <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
              <span className="shrink-0">{walletT.largestIncome}</span>
              <span className="text-emerald-600 font-semibold tabular-nums break-all sm:text-right">
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

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
              <span className="shrink-0">{walletT.largestExpense}</span>
              <span className="text-rose-600 font-semibold tabular-nums break-all sm:text-right">
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
            </div> */}
          </div>
        </div>
      </CommonCard>

      {/* Wallet Insights */}
      <CommonCard className="text-slate-900 dark:text-slate-100">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            {walletT.walletInsights}
          </h3>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 text-sm min-w-0">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between min-w-0">
                <span className="shrink-0">{walletT.availableBalance}</span>
                <span className="font-semibold tabular-nums break-words sm:text-right min-w-0 w-full text-right">
                  {new Intl.NumberFormat(locale, {
                    style: "currency",
                    currency: currencyLabel,
                  }).format(totalBalance)}
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between min-w-0">
                <span className="shrink-0">{walletT.transactionsToday}</span>
                <span className="font-semibold tabular-nums break-words sm:text-right min-w-0 w-full text-right">
                  {todayTransactions.length}
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between min-w-0">
                <span className="shrink-0">{walletT.monthlyGrowth}</span>
                <span className="font-semibold tabular-nums break-words sm:text-right min-w-0 w-full text-right">
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
