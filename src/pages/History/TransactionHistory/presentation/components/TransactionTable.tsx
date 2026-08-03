import { CommonTable, type TableColumn } from "@/components/common/CommonTable";
import type { Transaction } from "../../domain/entities/transaction";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/pages/Booking/AvailableWorks/presentation/utils/formatdatetime";
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
            new Intl.NumberFormat("en-SA", {
        style: "currency",
        currency: "SAR",
      }).format(row.amount),
    },
  ];

 const desktopColumns: TableColumn<Transaction>[] = [
  {
    key: "id",
    header: table.transactionId,
    render: (row) => (
      <div className="max-w-[140px] whitespace-normal break-all">
        {row.id}
      </div>
    ),
  },
  {
    key: "date",
    header: table.date,
    render: (row) => {
      const formatted = formatDateTime(row.date);
      const [date, time] = formatted.split(", ");

      return (
        <div className="leading-5 whitespace-normal">
          <div>{date}</div>
          {time && <div>{time}</div>}
        </div>
      );
    },
  },
  { key: "type", header: table.type },
  {
    key: "description",
    header: table.description,
    render: (row) => (
      <div className="max-w-[250px] whitespace-normal break-words">
        {row.description}
      </div>
    ),
  },
  { key: "paymentMethod", header: table.paymentMethod },
  { key: "status", header: table.status },
  {
    key: "amount",
    header: table.amount,
    render: (row) =>
      new Intl.NumberFormat("en-SA", {
        style: "currency",
        currency: "SAR",
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
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-slate-500">{table.transactionId}</p>
                <p className="text-xs font-mono break-all">{row.id}</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-500">{table.description}</p>
                <p className="text-sm font-semibold break-words">
                  {row.description}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-500">{table.type}</p>
                <p className="text-xs uppercase break-words">
                  {row.type}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-500">{table.date}</p>
                <p className="text-xs break-words">
                  {formatDateTime(row.date)}
                </p>
              </div>

              {row.paymentMethod && (
                <div>
                  <p className="text-[10px] text-slate-500">
                    {table.paymentMethod}
                  </p>
                  <p className="text-xs break-words">
                    {row.paymentMethod}
                  </p>
                </div>
              )}

              <div>
                <p className="text-[10px] text-slate-500">{table.status}</p>
                <span
                  className={cn(
                    "inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize",
                    row.status === "completed"
                      ? "bg-emerald-50 text-emerald-700"
                      : row.status === "pending"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-rose-50 text-rose-700"
                  )}
                >
                  {row.status}
                </span>
              </div>

              <div>
                <p className="text-[10px] text-slate-500">{table.amount}</p>
                <p
                  className={cn(
                    "text-base font-bold break-all",
                    row.type.toLowerCase().includes("credit")
                      ? "text-emerald-600"
                      : "text-rose-600"
                  )}
                >
                  {new Intl.NumberFormat("en-SA", {
                    style: "currency",
                    currency: "SAR",
                  }).format(row.amount)}
                </p>
              </div>
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
