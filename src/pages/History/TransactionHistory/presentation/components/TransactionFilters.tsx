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
import { CommonCard } from "@/components/common/CommonCard";

interface Props {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: string) => void;
}

export default function TransactionFilters({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: Props) {
  const { translations, language } = useLanguage();
  const isRTL = language === "AR";

  const filters = translations.transactionHistory.filters;

  return (
    <CommonCard
      title={filters.filterStatus}
      headerAlign={isRTL ? "right" : "left"}
    >
      <div
        className={`
          flex flex-col gap-4
          md:flex-row md:items-center
          ${isRTL ? "md:flex-row-reverse" : ""}
        `}
      >
        {/* SEARCH */}
        <div className="relative flex-1">
          <Search
            className={`
              absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400
              ${isRTL ? "right-3" : "left-3"}
            `}
          />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={filters.searchPlaceholder}
            className={isRTL ? "pr-10" : "pl-10"}
          />
        </div>

        {/* STATUS */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent align={isRTL ? "center" : "start"}>
            {Object.entries(filters.statusOptions).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {String(label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </CommonCard>
  );
}
