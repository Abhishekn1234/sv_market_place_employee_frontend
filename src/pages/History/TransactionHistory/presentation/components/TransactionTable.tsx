import { CommonTable, type TableColumn } from "@/components/common/CommonTable";
import type { Transaction } from "../../domain/entities/transaction";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  transactions: Transaction[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages?: number;
}

export default function TransactionTable({
  transactions,
  currentPage,
  onPageChange,
  totalPages = 1,

}: Props) {
  const { language, translations } = useLanguage();
  const isRTL = language === "AR";

  const table = translations.transactionHistory.table;

  // Use API pagination instead of client-side pagination
  const displayTransactions = transactions;

  const columns: TableColumn<Transaction>[] = [
    { key: "id", header: table.transactionId },
    { key: "date", header: table.date },
    { key: "type", header: table.type },
    { key: "description", header: table.description },
    { key: "paymentMethod", header: table.paymentMethod },
    { key: "status", header: table.status },
    {
      key: "amount",
      header: table.amount,
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
  data={displayTransactions}
  keyExtractor={(row) => row.id}
  isRTL={isRTL}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={onPageChange}
  emptyMessage={table.empty}
/>
  );
}
