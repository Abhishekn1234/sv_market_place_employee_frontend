import { useLanguage } from "@/context/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import type { Transaction } from "../../domain/entities/transaction";

type Props = {
  transactions: Transaction[];
  totalBalance: number;
  totalCredit: number;
  totalDebit: number;
};

export function WalletSidebar({
  transactions,
  totalBalance,
  totalCredit,
  totalDebit,
}: Props) {
  const { translations, language } = useLanguage();
  const walletT = translations.wallet;
  const isRTL = language === "AR";
  console.log(isRTL);
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Monthly Summary */}
      <CommonCard>
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            {walletT.monthlySummary}
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <span>{walletT.totalTransactions}</span>
              <span className="font-medium whitespace-nowrap tabular-nums">
                {transactions.length}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span>{walletT.avgTransaction}</span>
              <span className="font-medium whitespace-nowrap tabular-nums">
                $
                {transactions.length
                  ? Math.round(
                      (totalCredit + totalDebit) / transactions.length
                    )
                  : 0}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span>{walletT.largestIncome}</span>
              <span className="text-green-600 font-medium whitespace-nowrap tabular-nums">
                $
                {Math.max(
                  0,
                  ...transactions
                    .filter((t) => t.type === "credit")
                    .map((t) => t.amount)
                )}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span>{walletT.largestExpense}</span>
              <span className="text-rose-600 font-medium whitespace-nowrap tabular-nums">
                $
                {Math.max(
                  0,
                  ...transactions
                    .filter((t) => t.type === "debit")
                    .map((t) => t.amount)
                )}
              </span>
            </div>
          </div>
        </div>
      </CommonCard>

      {/* Wallet Insights */}
      <CommonCard className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            {walletT.walletInsights}
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <span>{walletT.availableBalance}</span>
              <span className="font-medium whitespace-nowrap tabular-nums">
                ${totalBalance.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span>{walletT.monthlyGrowth}</span>
              <span className="font-medium whitespace-nowrap">+12.5%</span>
            </div>

            <div className="flex justify-between gap-3">
              <span>{walletT.transactionsToday}</span>
              <span className="font-medium whitespace-nowrap">2</span>
            </div>
          </div>
        </div>
      </CommonCard>
    </div>
  );
}

