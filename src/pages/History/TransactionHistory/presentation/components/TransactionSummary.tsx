import { DollarSign, Calendar, Filter } from "lucide-react";
import { mockTransactions } from "../data/transactiondata";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { CommonCard } from "@/components/common/CommonCard";

export default function TransactionSummary() {
  const { translations, language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === "AR";

  const stats = translations.transactionHistory.stats;

  const totalPaid = mockTransactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = mockTransactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <div
      className={`
        grid gap-4
        sm:grid-cols-2 lg:grid-cols-3
        ${isRTL ? "direction-rtl" : ""}
      `}
    >
      <SummaryCard
        title={stats.totalPaid}
        value={formatCurrency(totalPaid)}
        subtitle={stats.completedTransactions}
        icon={<DollarSign className="w-4 h-4 text-green-600" />}
        theme={theme}
      />

      <SummaryCard
        title={stats.pendingPayments}
        value={formatCurrency(pendingAmount)}
        subtitle={stats.pendingTransactions}
        icon={<Calendar className="w-4 h-4 text-yellow-600" />}
        theme={theme}
      />

      <SummaryCard
        title={stats.allTime}
        value={mockTransactions.length}
        subtitle={stats.totalTransactions}
        icon={<Filter className="w-4 h-4 text-blue-600" />}
        theme={theme}
      />
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  theme,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  theme: "light" | "dark";
}) {
  const { language } = useLanguage();
  const isRTL = language === "AR";
  console.log(theme);
  return (
    <CommonCard>
      <div
        className={`flex items-center justify-between mb-2 ${
          isRTL ? "flex-row-reverse text-right" : ""
        }`}
      >
        <h3 className="text-sm font-medium">{title}</h3>
        {icon}
      </div>

      <div className="text-2xl font-semibold">{value}</div>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </CommonCard>
  );
}
