import { CommonTable, type TableColumn } from "@/components/common/CommonTable";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "../../domain/entities/transaction";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  transactions: Transaction[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function TransactionTable({
  transactions,
  currentPage,
  onPageChange,
}: Props) {
  const { t, language,translations } = useLanguage();
  const isRTL = language === "AR";
  interface TransactionTableTranslations { transactionId: string; date: string; type: string; description: string; paymentMethod: string; status: string; amount: string; }
const ts: TransactionTableTranslations = (translations.transactionTable as unknown as TransactionTableTranslations) ?? { transactionId: "Transaction ID", date: "Date", type: "Type", description: "Description", paymentMethod: "Payment Method", status: "Status", amount: "Amount", };
  const itemsPerPage = 5;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;

  const columns: TableColumn<Transaction>[] = [
    { key: "id", header: ts.transactionId },
    { key: "date", header: ts.date},
    { key: "type", header: ts.type },
    { key: "description", header: ts.description},
    { key: "paymentMethod", header: ts.paymentMethod },
    {
      key: "status",
      header: ts.status,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "amount",
      header: ts.amount,
      render: (row) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(row.amount),
    },
  ];

  return (
    <CommonTable
      columns={columns}
      data={transactions.slice(start, start + itemsPerPage)}
      keyExtractor={(row) => row.id}
      dir={isRTL ? "rtl" : "ltr"}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      emptyMessage={t("noTransactionsFound")}
    />
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };

  return <Badge className={styles[status]}>{status}</Badge>;
}
