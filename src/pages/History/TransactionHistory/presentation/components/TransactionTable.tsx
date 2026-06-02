import { CommonTable, type TableColumn } from "@/components/common/CommonTable";
import type { Transaction } from "../../domain/entities/transaction";
import { useLanguage } from "@/context/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import { cn } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages?: number;
  isMobile?: boolean;
}

export default function TransactionTable({
  transactions,
  currentPage,
  onPageChange,
  totalPages = 1,
  isMobile = false,

}: Props) {
  const { language, translations } = useLanguage();
  const isRTL = language === "AR";

  const table = translations.transactionHistory.table;

  // Use API pagination instead of client-side pagination
  const displayTransactions = transactions;

  // Responsive columns based on isMobile prop or screen size
  const isSmallScreen = isMobile || (typeof window !== "undefined" && window.innerWidth < 768);

  const mobileColumns: TableColumn<Transaction>[] = [
    { key: "id", header: table.transactionId },
    { key: "date", header: table.date },
    { key: "type", header: table.type },
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

  const desktopColumns: TableColumn<Transaction>[] = [
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

  const finalColumns = isSmallScreen ? mobileColumns : desktopColumns;

  if (isSmallScreen) {
    return (
      <div className="flex flex-col gap-5 px-1 pb-10">
        {displayTransactions.map((row) => (
          <CommonCard
            key={row.id}
            className="mb-0 overflow-hidden shadow-sm border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
            isRTL={isRTL}
          >
            <div className={cn("p-4 space-y-3", isRTL ? "text-right" : "text-left")}>
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">#{row.id}</span>
                <span className={cn(
                  "text-sm font-bold whitespace-nowrap",
                  row.type.toLowerCase().includes('credit') ? 'text-emerald-600' : 'text-rose-600'
                )}>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(row.amount)}
                </span>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">{row.description}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{row.type}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span>{row.date}</span>
                  {row.paymentMethod && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="truncate max-w-[100px]">{row.paymentMethod}</span>
                    </>
                  )}
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-medium capitalize",
                  row.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : row.status === 'pending' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400' // Added styling for pending/failed
                )}>
                  {row.status}
                </span>
              </div>
            </div>
          </CommonCard>
        ))}
        {displayTransactions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
             <p className="text-sm text-slate-500">{table.empty}</p>
          </div>
        )}
      </div>
    );
  }

  return (
   <CommonTable
  columns={finalColumns}
  data={displayTransactions}
  keyExtractor={(row) => row.id}
  isRTL={isRTL}
  currentPage={isMobile ? 1 : currentPage}
  totalPages={isMobile ? 1 : totalPages}
  onPageChange={isMobile ? () => {} : onPageChange}
  emptyMessage={table.empty}
/>
  );
}
