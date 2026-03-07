"use client";

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
  service: string;
  tier: string;
  status: string;
  search: string;
  limit: number;
  onChange: (
    key: "service" | "tier" | "status" | "search",
    value: string
  ) => void;
  onLimitChange: (value: number) => void;
  t: any;
}

export function BookingFilters({
  service,
  tier,
  status,
  search,
  limit,
  onChange,
  onLimitChange,
  t,
}: Props) {
    const {language}=useLanguage();
    const isRTL=language==="AR";
  return (
    <div className={`grid grid-cols-1 md:grid-cols-5 gap-4 items-center ${isRTL?"flex-row-reverse":"flex-row"}`}>
      {/* Service dropdown */}
      <Select value={service} onValueChange={(v) => onChange("service", v)}>
        <SelectTrigger>
          <SelectValue placeholder={t.service} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.all}</SelectItem>
          <SelectItem value="Photography">Photography</SelectItem>
          <SelectItem value="Makeup">Makeup</SelectItem>
          <SelectItem value="Event Management">Event Management</SelectItem>
          <SelectItem value="Yoga Training">Yoga Training</SelectItem>
          <SelectItem value="Home Cleaning">Home Cleaning</SelectItem>
        </SelectContent>
      </Select>

      
      <Input
        placeholder={t.searchService}
        value={search}
        onChange={(e) => onChange("search", e.target.value)}
      />

     
      <Select value={tier} onValueChange={(v) => onChange("tier", v)}>
        <SelectTrigger>
          <SelectValue placeholder={t.serviceTier} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.all}</SelectItem>
          <SelectItem value="basic">{t.basic}</SelectItem>
          <SelectItem value="standard">{t.standard}</SelectItem>
          <SelectItem value="premium">{t.premium}</SelectItem>
          <SelectItem value="enterprise">{t.enterprise}</SelectItem>
        </SelectContent>
      </Select>

    
      <Select value={status} onValueChange={(v) => onChange("status", v)}>
        <SelectTrigger>
          <SelectValue placeholder={t.status} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.all}</SelectItem>
          <SelectItem value="pending">{t.pending}</SelectItem>
          <SelectItem value="confirmed">{t.confirmed}</SelectItem>
          <SelectItem value="completed">{t.completed}</SelectItem>
          <SelectItem value="cancelled">{t.cancelled}</SelectItem>
        </SelectContent>
      </Select>

      {/* Rows per page */}
      <Select
        value={String(limit)}
        onValueChange={(v) => onLimitChange(Number(v))}
      >
        <SelectTrigger>
          <SelectValue placeholder={t.rowsPerPage} />
        </SelectTrigger>
        <SelectContent>
          {[5, 10, 20, 50].map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
