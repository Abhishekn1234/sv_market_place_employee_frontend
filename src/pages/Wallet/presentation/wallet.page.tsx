import { useLanguage } from "@/context/LanguageContext";
import { WalletHeader } from "./components/WalletHeader";
import { WalletMain } from "./components/WalletMain";
import { WalletSidebar } from "./components/WalletSidebar";

const transactions = [
  { id: 1, type: "credit", amount: 1500, description: "Payment received", date: "2025-12-20" },
  { id: 2, type: "debit", amount: 200, description: "Lunch reimbursement", date: "2025-12-19" },
  { id: 3, type: "credit", amount: 500, description: "Project bonus", date: "2025-12-18" },
  { id: 4, type: "debit", amount: 89, description: "Software subscription", date: "2025-12-17" },
  { id: 5, type: "credit", amount: 1200, description: "Freelance work", date: "2025-12-16" },
];

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
