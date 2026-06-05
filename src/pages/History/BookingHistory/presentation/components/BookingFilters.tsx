"use client";

import { useMemo } from "react";
import { RotateCcw, Search, Filter, SlidersHorizontal, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import type { BookingStatus } from "../../../../Booking/AvailableBooking/domain/entities/bookingstatus";
import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import { useLanguage } from "@/context/LanguageContext";
import { Label } from "@/components/ui/label";

type Props = {
  searchTerm: string;
  onSearchChange: (value: string) => void;

  statusFilter: BookingStatus | "all";
  onStatusChange: (value: BookingStatus | "all") => void;
  limit: number;
  onLimitChange: (value: number) => void;
  serviceFilter: string;
  onServiceChange: (value: string) => void;
  onClear: () => void;
  sort: string;
  onSortChange: (value: string) => void;

  isFilterActive: boolean;
  services: ServiceCategory[];
  statusConfig: Record<string, { label: string }>;
  isMobile?: boolean;
};

export function BookingFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  serviceFilter,
  onServiceChange,
  services,
  onClear,
  sort,
  onSortChange,
  isFilterActive,
  limit,
  onLimitChange,
  statusConfig,
  isMobile,
}: Props) {
  const { translations, language, t } = useLanguage();
  const isRTL = language === "AR";
  const bookingfilters = translations.bookingHistory;

  const limits = useMemo(() => [5, 10, 20, 50], []);

  const uniqueStatusOptions = useMemo(() => {
    return Object.entries(statusConfig).reduce<Record<string, string>>((acc, [key, cfg]) => {
      if (!Object.values(acc).includes(cfg.label)) {
        acc[key] = cfg.label;
      }
      return acc;
    }, {});
  }, [statusConfig]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8">
      {/* Search Input */}
      <div className={`space-y-2 ${isRTL ? "lg:order-3" : ""}`}>
        <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-1.5">
          <Search className="w-3 h-3" />
          {t("common.search")}
        </Label>
        <div className="relative">
          <Input
            type="text"
            placeholder={bookingfilters.searchPlaceholder ?? "Search..."}
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            className="w-full pl-9 border-slate-200 bg-white shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Status Filter */}
      <div className={`space-y-2 ${isRTL ? "lg:order-2" : ""}`}>
        <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-1.5">
          <Filter className="w-3 h-3" />
          {bookingfilters.statusPlaceholder ?? "Status"}
        </Label>
        <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as BookingStatus | "all")}>
          <SelectTrigger className="border-slate-200 bg-white shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5">
            <div className="flex items-center gap-2">
              <SelectValue placeholder={bookingfilters.statusPlaceholder ?? "Select status"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">{bookingfilters.statusOptions?.all ?? "All"}</SelectItem>
            {Object.entries(uniqueStatusOptions).map(([key, label]) => (
              <SelectItem key={key} value={key} className="rounded-lg">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Service Filter */}
      <div className={`space-y-2 ${isRTL ? "lg:order-1" : ""}`}>
        <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3 h-3" />
          {bookingfilters.serviceOptions?.allServices ?? "Category"}
        </Label>
        <Select value={serviceFilter} onValueChange={onServiceChange}>
          <SelectTrigger className="border-slate-200 bg-white shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5">
            <SelectValue placeholder={bookingfilters.serviceOptions?.allServices ?? "All Services"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">{bookingfilters.serviceOptions?.allServices ?? "All Services"}</SelectItem>
            {services.map((service) => (
              <SelectItem key={service._id} value={service._id} className="rounded-lg">
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort Filter */}
      <div className={`space-y-2 ${isRTL ? "lg:order-4" : ""}`}>
        <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-1.5">
          <ListOrdered className="w-3 h-3" />
          {t("common.sort") ?? "Sort"}
        </Label>
  <Select value={sort} onValueChange={onSortChange}>
    <SelectTrigger className="border-slate-200 bg-white shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5">
      <SelectValue placeholder={t("common.sort") ?? "Sort by"} />
    </SelectTrigger>

    <SelectContent className="rounded-xl">
      <SelectItem value="createdAt:desc">
        {t("common.newest") ?? "Newest"}
      </SelectItem>

      <SelectItem value="createdAt:asc">
        {t("common.oldest") ?? "Oldest"}
      </SelectItem>
    </SelectContent>
  </Select>
</div>
      {/* Rows Per Page (desktop only) */}
      {!isMobile && (
        <div className={`space-y-2 ${isRTL ? "lg:order-5" : ""}`}>
          <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-1.5">
            {t("common.limit")}
          </Label>
          <Select value={limit.toString()} onValueChange={(v) => onLimitChange(Number(v))}>
            <SelectTrigger className="border-slate-200 bg-white shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {limits.map((l) => (
                <SelectItem key={l} value={l.toString()}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Clear Button */}
      <div className={`flex items-end ${isRTL ? "lg:order-6" : ""}`}>
        <Button
          variant="outline"
          size="default"
          disabled={!isFilterActive}
          onClick={onClear}
          className="w-full bg-white border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors gap-2 h-10"
        >
          <RotateCcw className="w-4 h-4" />
          {translations.common?.clear ?? t('common.clear') ?? "Clear"}
        </Button>
      </div>
    </div>
  );
}
