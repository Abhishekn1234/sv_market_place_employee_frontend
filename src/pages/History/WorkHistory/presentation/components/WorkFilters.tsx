"use client";

import { Search } from "lucide-react";
import { CommonCard } from "@/components/common/CommonCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/context/ThemeContext";
import { allowedStatuses } from "../utils/allstatuses";

interface Props {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  timeFilter: string;
  statusFilter: string;
  itemsPerPage: number;
  onTimeChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onItemsChange: (v: number) => void;
  isRTL: boolean;
  translations: any;
}

export function WorkFilters({
  searchTerm,
  setSearchTerm,
  timeFilter,
  statusFilter,
  itemsPerPage,
  onTimeChange,
  onStatusChange,
  onItemsChange,
  isRTL,
  translations,
}: Props) {
  const { workHistory } = translations;
  const { theme } = useTheme();

  return (
    <CommonCard
      title={workHistory.filters.timePeriod}
      headerAlign={isRTL ? "right" : "left"}
      contentClassName={`
        flex flex-col gap-4
        md:flex-row md:items-center
        ${isRTL ? "md:flex-row-reverse" : ""}
      `}
    >
      {/* SEARCH */}
      <div className="relative flex-1">
        <Search
          className={`
            absolute top-1/2 -translate-y-1/2 w-4 h-4
            ${isRTL ? "right-3" : "left-3"}
            ${theme === "dark" ? "text-gray-400" : "text-gray-500"}
          `}
        />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={workHistory.filters.searchPlaceholder}
          className={isRTL ? "pr-10" : "pl-10"}
        />
      </div>

      {/* TIME */}
      <Select value={timeFilter} onValueChange={onTimeChange}>
        <SelectTrigger className="w-full md:w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align={isRTL ? "center" : "start"}>
          <SelectItem value="week">
            {workHistory.timeOptions.week}
          </SelectItem>
          <SelectItem value="month">
            {workHistory.timeOptions.month}
          </SelectItem>
        </SelectContent>
      </Select>

      {/* STATUS */}
              <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full md:w-[160px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent align={isRTL ? "center" : "start"}>
            {/* Optional: Keep ALL */}
            <SelectItem value="all">
              {workHistory.statusOptions.all}
            </SelectItem>

            {allowedStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {workHistory.statusOptions[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      {/* PER PAGE */}
      <Select
        value={String(itemsPerPage)}
        onValueChange={(v) => onItemsChange(Number(v))}
      >
        <SelectTrigger className="w-full md:w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align={isRTL ? "center" : "start"}>
          {[5, 10, 20].map((n) => (
            <SelectItem key={n} value={String(n)}>
              <span dir="ltr">{n}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </CommonCard>
  );
}
