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
  const { translations, language } = useLanguage();
  const walletT = translations.wallet;
  const isRTL = language === "AR";
  const currencyLabel = wallet?.currency ?? "USD";
  const formattedBalance = `${totalBalance.toLocaleString()} ${currencyLabel}`;
  const updatedAt = wallet?.updatedAt
    ? new Date(wallet.updatedAt).toLocaleString()
    : null;

  return (
    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
      {/* Balance Card */}
      <CommonCard className="bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <p className="text-blue-100 text-sm">
                {walletT.totalBalance}
              </p>
              <p className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2 break-all">
                ${formattedBalance}
              </p>

              <div className="flex flex-col gap-2 mt-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-blue-100 text-sm">
                    {walletT.monthlyGrowth}
                  </span>
                </div>
                {updatedAt && (
                  <span className="text-blue-100 text-xs sm:text-sm">
                    Updated: {updatedAt}
                  </span>
                )}
              </div>
            </div>

            <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 opacity-80 self-end sm:self-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <div className="bg-white/10 rounded-xl p-3 sm:p-4">
              <p className="text-blue-100 text-xs sm:text-sm">
                {walletT.income}
              </p>
              <p className="text-lg sm:text-xl font-semibold text-green-300 break-all">
                ${totalCredit.toLocaleString()}
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-3 sm:p-4">
              <p className="text-blue-100 text-xs sm:text-sm">
                {walletT.expenses}
              </p>
              <p className="text-lg sm:text-xl font-semibold text-rose-300 break-all">
                ${totalDebit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CommonCard>

      {/* Quick Actions */}
      <CommonCard>
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            {walletT.quickActions}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button className="flex items-start sm:items-center gap-3 p-4 border rounded-xl w-full text-left">
              <ArrowUpRight className="text-green-600 mt-1 sm:mt-0" />
              <div>
                <p className="font-semibold">{walletT.addFunds}</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {walletT.depositMoney}
                </p>
              </div>
            </button>

            <button className="flex items-start sm:items-center gap-3 p-4 border rounded-xl w-full text-left">
              <ArrowDownRight className="text-rose-600 mt-1 sm:mt-0" />
              <div>
                <p className="font-semibold">{walletT.withdraw}</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {walletT.transferFunds}
                </p>
              </div>
            </button>
          </div>
        </div>
      </CommonCard>

      {/* Recent Transactions */}
      <CommonCard>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
            <h3 className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
              <Receipt className="w-5 h-5" />
              {walletT.recentTransactions}
            </h3>

            <button className="text-blue-600 text-sm self-start sm:self-auto">
              {walletT.viewAll} →
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 border rounded-xl ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <div className="flex gap-3 items-start">
                  {txn.type === "credit" ? (
                    <ArrowUpRight className="text-green-600 mt-1" />
                  ) : (
                    <ArrowDownRight className="text-rose-600 mt-1" />
                  )}

                  <div>
                    <p className="font-medium wrap-break-word">
                      {txn.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {txn.date}
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    isRTL ? "text-left" : "text-right"
                  }`}
                >
                  <p
                    className={`font-bold ${
                      txn.type === "credit"
                        ? "text-green-600"
                        : "text-rose-600"
                    }`}
                  >
                    {txn.type === "credit" ? "+" : "-"}$
                    {txn.amount.toLocaleString()}
                  </p>
                  <span className="text-xs">
                    {txn.type === "credit"
                      ? walletT.credit
                      : walletT.debit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CommonCard>
    </div>
  );
}
