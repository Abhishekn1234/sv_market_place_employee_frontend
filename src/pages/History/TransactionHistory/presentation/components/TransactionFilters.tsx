import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

type TransactionStatus = "all" | "completed" | "pending" | "failed";

interface Props {
  searchTerm: string;
  statusFilter: TransactionStatus;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: TransactionStatus) => void;
  limit: number;
  onLimitChange: (v: number) => void;
  isMobile: boolean;
}

export default function TransactionFilters({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
  limit,
  onLimitChange,
  isMobile,
}: Props) {
  const { translations, language } = useLanguage();
  const isRTL = language === "AR";

  const filters = translations.transactionHistory.filters;

  return (
    <div
      className={`
        flex flex-col gap-2 sm:gap-3
        md:flex-row md:items-center md:gap-4
        ${isRTL ? "md:flex-row-reverse" : ""}
      `}
    >
      {/* SEARCH */}
      <div className="relative flex-1">
        <Search
          className={`
            absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400
            ${isRTL ? "right-3" : "left-3"}
          `}
        />
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={filters.searchPlaceholder}
          className={cn("bg-white border-slate-200 text-xs sm:text-sm py-2 sm:py-2.5 h-auto", isRTL ? "pr-10" : "pl-10")}
        />
      </div>

      {/* STATUS */}
      <Select value={statusFilter} onValueChange={(value) => onStatusChange(value as TransactionStatus)}>
        <SelectTrigger className="w-full md:w-[200px] bg-white border-slate-200 text-xs sm:text-sm py-2 sm:py-2.5 h-auto">
          <SelectValue placeholder={filters.filterStatus} />
        </SelectTrigger>

        <SelectContent align={isRTL ? "end" : "start"}>
          {Object.entries(filters.statusOptions).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {String(label)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* LIMIT - Desktop only */}
      {!isMobile && (
        <Select value={limit.toString()} onValueChange={(v) => onLimitChange(Number(v))}>
          <SelectTrigger className="w-full md:w-[150px] bg-white border-slate-200 text-xs sm:text-sm py-2 sm:py-2.5 h-auto">
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>
          <SelectContent align={isRTL ? "end" : "start"}>
            {[5, 10, 20, 50].map((l) => (
              <SelectItem key={l} value={l.toString()}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
