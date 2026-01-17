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
  const { translations } = useLanguage();
  const walletT = translations.Wallet;

  return (
    <div className="space-y-6">
      {/* Monthly Summary */}
      <CommonCard>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">{walletT.monthlySummary}</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{walletT.totalTransactions}</span>
              <span>{transactions.length}</span>
            </div>

            <div className="flex justify-between">
              <span>{walletT.avgTransaction}</span>
              <span>
                $
                {Math.round(
                  (totalCredit + totalDebit) / transactions.length
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>{walletT.largestIncome}</span>
              <span className="text-green-600">
                $
                {Math.max(
                  0,
                  ...transactions
                    .filter((t) => t.type === "credit")
                    .map((t) => t.amount)
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>{walletT.largestExpense}</span>
              <span className="text-rose-600">
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
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">{walletT.walletInsights}</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{walletT.availableBalance}</span>
              <span>${totalBalance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>{walletT.monthlyGrowth}</span>
              <span>+12.5%</span>
            </div>
            <div className="flex justify-between">
              <span>{walletT.transactionsToday}</span>
              <span>2</span>
            </div>
          </div>
        </div>
      </CommonCard>
    </div>
  );
}
