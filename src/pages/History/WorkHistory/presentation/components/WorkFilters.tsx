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

  return (
    <CommonCard
      title={workHistory.filters.timePeriod}
      headerAlign={isRTL ? "right" : "left"}
      contentClassName={`flex flex-col md:flex-row gap-4 ${
        isRTL ? "md:flex-row-reverse" : ""
      }`}
    >
     
      <div className="flex-1 relative">
        <Search
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${
            isRTL ? "right-3" : "left-3"
          }`}
        />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={workHistory.filters.searchPlaceholder}
          className={isRTL ? "pr-10" : "pl-10"}
        />
      </div>

      {/* ⏱ Time Filter */}
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

      {/* 📌 Status Filter */}
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full md:w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align={isRTL ? "center" : "start"}>
          <SelectItem value="all">
            {workHistory.statusOptions.all}
          </SelectItem>
          <SelectItem value="completed">
            {workHistory.statusOptions.completed}
          </SelectItem>
          <SelectItem value="In Progress">
            {workHistory.statusOptions["In Progress"]}
          </SelectItem>
          <SelectItem value="pending">
            {workHistory.statusOptions.pending}
          </SelectItem>
          <SelectItem value="upcoming">
            {workHistory.statusOptions.upcoming}
          </SelectItem>
        </SelectContent>
      </Select>

      {/* 📄 Items Per Page */}
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
