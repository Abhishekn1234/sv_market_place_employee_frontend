import { useLanguage } from "@/context/LanguageContext";
import { WalletHeader } from "./components/WalletHeader";
import { WalletMain } from "./components/WalletMain";
import { WalletSidebar } from "./components/WalletSidebar";
import { transactions } from "./data/transactions";

export default function Wallet() {
  const { language } = useLanguage();
  const isRTL = language === "AR";

  const totalBalance = transactions.reduce(
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
        
        {/* Header */}
        <WalletHeader
          employeeName="John Doe"
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
