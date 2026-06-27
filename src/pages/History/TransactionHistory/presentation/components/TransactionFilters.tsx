import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { cn } from "@/lib/utils";

interface Props {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  limit: number;
  onLimitChange: (v: number) => void;
  isMobile: boolean;
  sort: string;
  onSortChange: (v: string) => void;
  isFilterActive: boolean;
  onClear: () => void;
}

export default function TransactionFilters({
  searchTerm,
  onSearchChange,
  limit,
  onLimitChange,
  isMobile,
  sort,
  onSortChange,
  isFilterActive,
  onClear,
}: Props) {
  const { translations, language, t } = useLanguage();
  const isRTL = language === "AR";

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
          placeholder={
            translations.transactionHistory.filters.searchPlaceholder
          }
          className={cn(
            "bg-white border-slate-200 text-xs sm:text-sm py-2 sm:py-2.5 h-auto",
            isRTL ? "pr-10" : "pl-10"
          )}
        />
      </div>

      {/* SORT */}
      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-full md:w-[180px] bg-white border-slate-200 text-xs sm:text-sm py-2 sm:py-2.5 h-auto">
          <SelectValue placeholder={t("common.sort") ?? "Sort by"} />
        </SelectTrigger>
        <SelectContent align={isRTL ? "end" : "start"}>
          <SelectItem value="createdAt:desc">
            {t("common.newest") ?? "Newest"}
          </SelectItem>
          <SelectItem value="createdAt:asc">
            {t("common.oldest") ?? "Oldest"}
          </SelectItem>
        </SelectContent>
      </Select>

      {/* LIMIT - Desktop only */}
      {!isMobile && (
        <Select
          value={limit.toString()}
          onValueChange={(v) => onLimitChange(Number(v))}
        >
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

      {/* CLEAR BUTTON */}
      <Button
        variant="outline"
        disabled={!isFilterActive}
        onClick={onClear}
        className="w-full md:w-auto bg-white border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors gap-2 text-xs sm:text-sm py-2 sm:py-2.5 h-auto"
      >
        <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        {translations.common?.clear ?? t("common.clear") ?? "Clear"}
      </Button>
    </div>
  );
}