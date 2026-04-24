import { useLanguage } from "@/context/LanguageContext";
import { WalletHeader } from "./components/WalletHeader";
import { WalletMain } from "./components/WalletMain";
import { WalletSidebar } from "./components/WalletSidebar";
import { transactions as mockTransactions } from "./data/transactions";
import { useWallet } from "./hooks/useWallet";
import { useWalletTransactions } from "./hooks/useWalletTransactions";
import type { Transaction } from "../domain/entities/transaction";

export default function Wallet() {
  const { language } = useLanguage();
  const isRTL = language === "AR";
  const { data: wallet, isLoading: walletLoading, isError: walletError } = useWallet();
  const { data: transactionsResponse, isLoading: transactionsLoading, isError: transactionsError } = useWalletTransactions({
    page: 1,
    limit: 50,
    sort: "createdAt:desc"
  });
  console.log(wallet);
  console.log(transactionsResponse)

  // Transform API transactions to component format
  const apiTransactions = transactionsResponse?.data || [];
  const transformedTransactions: Transaction[] = apiTransactions.map((txn, index) => ({
    id: parseInt(txn.id) || index + 1,
    type: txn.type === "CREDIT" ? "credit" : "debit",
    amount: txn.amount,
    description: txn.note || txn.source || "Transaction",
    date: new Date(txn.createdAt).toISOString().split('T')[0]
  }));

  // Use real transactions if available, otherwise fall back to mock data
  const transactions = transformedTransactions.length > 0 ? transformedTransactions : mockTransactions;

  const totalBalance = wallet?.balance ?? transactions.reduce(
    (acc, txn) => (txn.type === "credit" ? acc + txn.amount : acc - txn.amount),
    0
  );

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((a, t) => a + t.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((a, t) => a + t.amount, 0);

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen  px-3 py-4 sm:px-4 md:px-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {(walletLoading || transactionsLoading) && (
          <div className="text-sm text-gray-500">Loading wallet data...</div>
        )}
        {(walletError || transactionsError) && (
          <div className="text-sm text-rose-500">
            Failed to load wallet data.
          </div>
        )}

        {/* Header */}
        <WalletHeader
          employeeName={wallet?.workerId ?? "John Doe"}
          employeeTier="Gold"
        />

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          
          {/* Main content */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <WalletMain
              transactions={transactions}
              totalBalance={totalBalance}
              totalCredit={totalCredit}
              totalDebit={totalDebit}
            />
          </div>

          {/* Sidebar */}
          <div className="order-1 lg:order-2">
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
    </div>
  );
}
