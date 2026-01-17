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

type Props = {
  transactions: Transaction[];
  totalBalance: number;
  totalCredit: number;
  totalDebit: number;
};

export function WalletMain({
  transactions,
  totalBalance,
  totalCredit,
  totalDebit,
}: Props) {
  const { translations } = useLanguage();
  const walletT = translations.Wallet;

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Balance Card */}
      <CommonCard className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100">{walletT.totalBalance}</p>
              <p className="text-4xl font-bold mt-2">
                ${totalBalance.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-5 h-5 mr-2" />
                <span className="text-blue-100">
                  {walletT.monthlyGrowth}
                </span>
              </div>
            </div>
            <CreditCard className="w-12 h-12 opacity-80" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-blue-100 text-sm">{walletT.income}</p>
              <p className="text-xl font-semibold text-green-300">
                ${totalCredit.toLocaleString()}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-blue-100 text-sm">{walletT.expenses}</p>
              <p className="text-xl font-semibold text-rose-300">
                ${totalDebit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CommonCard>

      {/* Quick Actions */}
      <CommonCard>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            {walletT.quickActions}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <button className="flex items-center gap-3 p-4 border rounded-xl">
              <ArrowUpRight className="text-green-600" />
              <div>
                <p className="font-semibold">{walletT.addFunds}</p>
                <p className="text-sm text-gray-600">
                  {walletT.depositMoney}
                </p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 border rounded-xl">
              <ArrowDownRight className="text-rose-600" />
              <div>
                <p className="font-semibold">{walletT.withdraw}</p>
                <p className="text-sm text-gray-600">
                  {walletT.transferFunds}
                </p>
              </div>
            </button>
          </div>
        </div>
      </CommonCard>

      {/* Recent Transactions */}
      <CommonCard>
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <h3 className="flex items-center gap-2 text-xl font-semibold">
              <Receipt className="w-5 h-5" />
              {walletT.recentTransactions}
            </h3>
            <button className="text-blue-600 text-sm">
              {walletT.viewAll} →
            </button>
          </div>

          <div className="space-y-4">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex justify-between items-center p-4 border rounded-xl"
              >
                <div className="flex gap-3 items-center">
                  {txn.type === "credit" ? (
                    <ArrowUpRight className="text-green-600" />
                  ) : (
                    <ArrowDownRight className="text-rose-600" />
                  )}
                  <div>
                    <p className="font-medium">{txn.description}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {txn.date}
                    </div>
                  </div>
                </div>

                <div className="text-right">
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
