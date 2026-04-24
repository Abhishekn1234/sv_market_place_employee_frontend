import { useLanguage } from "@/context/LanguageContext";
import { WalletHeader } from "./components/WalletHeader";
import { WalletMain } from "./components/WalletMain";
import { WalletSidebar } from "./components/WalletSidebar";

import { useWallet } from "./hooks/useWallet";
import { useWalletTransactions } from "./hooks/useWalletTransactions";
import type { Transaction } from "../domain/entities/transaction";
import { useAuthStore } from "@/core/store/auth";
export default function Wallet() {
  const { language } = useLanguage();
  const isRTL = language === "AR";

  const { data: wallet } = useWallet();
  const { data: transactionsResponse } = useWalletTransactions({
   
    sort: "createdAt:desc",
  });

  const apiTransactions = transactionsResponse?.data || [];

  const transactions: Transaction[] = apiTransactions.map((txn, index) => ({
    id: parseInt(txn.id) || index + 1,
    type: txn.type === "CREDIT" ? "credit" : "debit",
    amount: txn.amount,
    description: txn.note || txn.source || "Transaction",
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

    const userId = user?._id;
    const username = user?.fullName ?? "User";

     const isOwner = wallet?.workerId === userId;
     console.log(isOwner);
  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen px-3 py-4 sm:px-4 md:px-6"
    >
      {/* Header */}
      <WalletHeader
        employeeName={username}
      
      />

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