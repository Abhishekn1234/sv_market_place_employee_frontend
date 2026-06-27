import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { WalletHeader } from "./components/WalletHeader";
import { WalletMain } from "./components/WalletMain";
import { WalletSidebar } from "./components/WalletSidebar";

import { useWallet } from "./hooks/useWallet";

import type { Transaction } from "../domain/entities/transaction";
import { useAuthStore } from "@/core/store/auth";
import { useTransactionHistory } from "@/pages/History/TransactionHistory/presentation/hooks/useTransaction";
export default function Wallet() {
  const { language, t } = useLanguage();
  const isRTL = language === "AR";

  const { data: wallet } = useWallet();
  const { data: transactionsResponse } = useTransactionHistory({
    sort: "createdAt:desc",
  });

  const apiTransactions = transactionsResponse?.data || [];

  const transactions: Transaction[] = apiTransactions.map((txn, index) => ({
    id: Number(txn._id) || index + 1,
    type: txn.type === "CREDIT" ? "credit" : "debit",
    amount: txn.amount,
    description: txn.note || txn.source || t("wallet.transaction"),
    date: new Date(txn.createdAt).toISOString().split("T")[0],
  }));

  const totalBalance =
    wallet?.balance ??
    transactions.reduce(
      (acc, txn) => (txn.type === "credit" ? acc + txn.amount : acc - txn.amount),
      0
    );

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((a, t) => a + t.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((a, t) => a + t.amount, 0);

    const user = useAuthStore.getState().user;
  const username = user?.fullName ?? t("common.user");

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen px-3 py-4 sm:px-4 md:px-6"
    >
      {/* Header */}
      <WalletHeader employeeName={username} wallet={wallet} />

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        
        {/* Main */}
        <div className="lg:col-span-2">
          <WalletMain
            transactions={transactions}
            totalBalance={totalBalance}
            totalCredit={totalCredit}
            totalDebit={totalDebit}
            wallet={wallet}
          />
        </div>

        {/* Sidebar */}
        <div>
          <WalletSidebar
            transactions={transactions}
            totalBalance={totalBalance}
            totalCredit={totalCredit}
            totalDebit={totalDebit}
            wallet={wallet}
          />
        </div>

      </div>
    </div>
  );
}