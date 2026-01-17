
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
  const { t, language } = useLanguage();
  const isRTL = language === "AR";

  return (
    <CommonCard
  title={t("transactionHistory")}
  headerAlign={isRTL ? "right" : "left"}
>
  <div className={`flex gap-4 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="pl-10"
      />
    </div>

    <Select value={statusFilter} onValueChange={onStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("allStatus")} />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">{t("allStatus")}</SelectItem>
        <SelectItem value="completed">{t("completed")}</SelectItem>
        <SelectItem value="pending">{t("pending")}</SelectItem>
        <SelectItem value="failed">{t("failed")}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</CommonCard>

  );
}
