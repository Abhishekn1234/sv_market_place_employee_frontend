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
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen p-2 md:p-6">
      <div className="max-w-7xl mx-auto">
        <WalletHeader employeeName="John Doe" employeeTier="Gold" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WalletMain
            transactions={transactions}
            totalBalance={totalBalance}
            totalCredit={totalCredit}
            totalDebit={totalDebit}
          />

          <WalletSidebar
            transactions={transactions}
            totalBalance={totalBalance}
            totalCredit={totalCredit}
            totalDebit={totalDebit}
          />
        </div>
      </div>
    </div>
  );
}
