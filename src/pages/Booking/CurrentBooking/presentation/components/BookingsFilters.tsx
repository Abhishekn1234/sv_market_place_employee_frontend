import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  status: string;
  onStatusChange: (v: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  pageSize: number;
  onPageSizeChange: (v: number) => void;
}

export default function BookingFilters({
  status,
  onStatusChange,
  search,
  onSearchChange,
  pageSize,
  onPageSizeChange,
}: Props) {
  const { translations, language } = useLanguage();
  const isRTL = language === "AR";

  return (
    <div
      className={`flex flex-wrap gap-3 justify-between ${
        isRTL ? "flex-row-reverse" : ""
      }`}
    >
      {/* Search */}
      <Input
        placeholder={translations?.common?.search ?? "Search…"}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />

      <div className="flex gap-3">
        {/* Status filter */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {translations?.currentBookings?.status.all}
            </SelectItem>
            <SelectItem value="pending">
              {translations?.currentBookings?.status.pending}
            </SelectItem>
            <SelectItem value="ongoing">
              {translations?.currentBookings?.status.ongoing}
            </SelectItem>
            <SelectItem value="completed">
              {translations?.currentBookings?.status.completed}
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Rows per page */}
        <Select
          value={String(pageSize)}
          onValueChange={(v) => onPageSizeChange(Number(v))}
        >
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

