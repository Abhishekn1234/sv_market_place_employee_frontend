import { useLanguage } from "@/context/LanguageContext";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Calendar,
  Receipt,
} from "lucide-react";

type Transaction = {
  id: number;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
};

const transactions: Transaction[] = [
  { id: 1, type: "credit", amount: 1500, description: "Payment received", date: "2025-12-20" },
  { id: 2, type: "debit", amount: 200, description: "Lunch reimbursement", date: "2025-12-19" },
  { id: 3, type: "credit", amount: 500, description: "Project bonus", date: "2025-12-18" },
  { id: 4, type: "debit", amount: 89, description: "Software subscription", date: "2025-12-17" },
  { id: 5, type: "credit", amount: 1200, description: "Freelance work", date: "2025-12-16" },
];

// Employee info
const employeeName = "John Doe";
const employeeTier: "Gold" | "Silver" | "Platinum" = "Gold";

const tierColor = (tier: "Gold" | "Silver" | "Platinum") => {
  switch (tier) {
    case "Gold":
      return "bg-yellow-100 text-yellow-800";
    case "Silver":
      return "bg-gray-100 text-gray-800";
    case "Platinum":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function Wallet() {
  const { translations, language } = useLanguage();
  const walletT = translations.Wallet;
  const isRTL = language === "AR";

  const totalBalance = transactions.reduce(
    (acc, txn) => (txn.type === "credit" ? acc + txn.amount : acc - txn.amount),
    0
  );

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen p-2 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {employeeName}
          </h1>

          <p
            className={`mt-1 px-3 py-1 inline-block rounded-full text-sm font-semibold ${tierColor(
              employeeTier
            )}`}
          >
            {walletT.tier}: {employeeTier}
          </p>

          <p className="text-gray-600 mt-2">{walletT.manage}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
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

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow border">
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

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl p-6 shadow border">
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
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Monthly Summary */}
            <div className="bg-white rounded-2xl p-6 shadow border">
              <h3 className="text-xl font-semibold mb-4">
                {walletT.monthlySummary}
              </h3>

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
                      ...transactions
                        .filter((t) => t.type === "debit")
                        .map((t) => t.amount)
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Wallet Insights */}
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">
                {walletT.walletInsights}
              </h3>

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
          </div>
        </div>
      </div>
    </div>
  );
}
