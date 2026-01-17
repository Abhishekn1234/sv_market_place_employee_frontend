
import { DollarSign, Calendar, Filter } from "lucide-react";
import { mockTransactions } from "../data/transactiondata";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { CommonCard } from "@/components/common/CommonCard";

export default function TransactionSummary() {
  const { t } = useLanguage();
  const { theme } = useTheme();

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
    <div className="flex gap-6 flex-wrap">
      <SummaryCard
        title={t("totalTransactions")}
        value={formatCurrency(totalPaid)}
        subtitle={`${mockTransactions.filter(t => t.status === "completed").length} ${t("completedTransactions")}`}
        icon={<DollarSign className="w-4 h-4 text-green-600" />}
        theme={theme}
      />

      <SummaryCard
        title={t("pendingPayments")}
        value={formatCurrency(pendingAmount)}
        subtitle={`${mockTransactions.filter(t => t.status === "pending").length} ${t("pendingTransactions")}`}
        icon={<Calendar className="w-4 h-4 text-yellow-600" />}
        theme={theme}
      />

      <SummaryCard
        title={t("allTime")}
        value={mockTransactions.length}
        subtitle={t("allTime")}
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
  return (
    <CommonCard
      className="flex-1 min-w-[250px]"
      contentClassName="pt-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h3
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
        {icon}
      </div>

      <div
        className={`text-2xl font-semibold ${
          theme === "dark" ? "text-gray-100" : "text-gray-900"
        }`}
      >
        {value}
      </div>

      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </CommonCard>
  );
}

