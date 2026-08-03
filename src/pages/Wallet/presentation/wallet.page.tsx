import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { WalletHeader } from "./components/WalletHeader";
import { WalletMain } from "./components/WalletMain";
import { WalletSidebar } from "./components/WalletSidebar";

import { useWallet } from "./hooks/useWallet";
import type { Transaction } from "../domain/entities/transaction";
import { useAuthStore } from "@/core/store/auth";
import { useTransactionHistory } from "@/pages/History/TransactionHistory/presentation/hooks/useTransaction";
import { formatDateTime } from "@/pages/Booking/AvailableWorks/presentation/utils/formatdatetime";
import type { WalletSummary } from "../domain/entities/wallet";

export default function Wallet() {
  const { language, t } = useLanguage();
  const isRTL = language === "AR";

  const { data: wallet } = useWallet();

  const { data: transactionsResponse } = useTransactionHistory({
    sort: "createdAt:desc",
  });

  const apiTransactions = transactionsResponse?.data ?? [];

  // Map API response to UI Transaction model
  const transactions: Transaction[] = apiTransactions.map((txn, index) => ({
    id: txn.id ?? index + 1,
    type: txn.type === "CREDIT" ? "CREDIT" : "DEBIT",
    amount: Number(txn.amount),
    description: txn.note || txn.source || t("wallet.transaction"),
    date: formatDateTime(txn?.createdAt),
  }));

  // Total Credit
 const latestTransaction = apiTransactions[0];

const totalBalance =
  latestTransaction?.balanceAfter ??
  wallet?.balance ??
  0;

const dueToAppBalance =
  latestTransaction?.dueToAppBalanceAfter ?? 0;

const totalCredit = apiTransactions.reduce(
  (total, txn) =>
    txn.type === "CREDIT" ? total + txn.amount : total,
  0
);

const totalDebit = apiTransactions.reduce(
  (total, txn) =>
    txn.type === "DEBIT" ? total + txn.amount : total,
  0
);
  const user = useAuthStore.getState().user;
  const username = user?.fullName ?? t("common.user");

  // Merge fallback values into wallet object
 const walletData: WalletSummary = {
  workerId: wallet?.workerId ?? user?._id ?? "",
  balance: totalBalance,
  currency: wallet?.currency ?? "SAR",
  updatedAt:
    latestTransaction?.createdAt ??
    wallet?.updatedAt ??
    new Date().toISOString(),
  dueToAppBalance,
};

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen px-3 py-4 sm:px-4 md:px-6"
    >
      {/* Header */}
      <WalletHeader employeeName={username} wallet={walletData} />

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <WalletMain
            transactions={transactions}
            totalBalance={totalBalance}
            totalCredit={totalCredit}
            totalDebit={totalDebit}
            wallet={walletData}
          />
        </div>

        {/* Sidebar */}
        <div>
          <WalletSidebar
            transactions={transactions}
            totalBalance={totalBalance}
            totalCredit={totalCredit}
            totalDebit={totalDebit}
            wallet={walletData}
          />
        </div>
      </div>
    </div>
  );
}