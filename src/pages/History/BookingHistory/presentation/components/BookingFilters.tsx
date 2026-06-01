"use client";

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

type Props = {
  searchTerm: string;
  onSearchChange: (value: string) => void;

  statusFilter: BookingStatus | "all";
  onStatusChange: (value: BookingStatus | "all") => void;
  limit: number;
onLimitChange: (value: number) => void;
  serviceFilter: string;
  onServiceChange: (value: string) => void;

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
  limit,
  onLimitChange,
  statusConfig,
  isMobile,
}: Props) {
  const {translations,language}=useLanguage();
  const isRTL=language==="AR";
  const bookingfilters=translations.bookingHistory;
  const limits = [5, 10, 20, 50];
  const uniqueStatusOptions = Object.entries(statusConfig).reduce<Record<string, string>>((acc, [key, cfg]) => {
  if (!Object.values(acc).includes(cfg.label)) {
    acc[key] = cfg.label;
  }
  return acc;
}, {});

  return (
    <div className={`${isRTL?"grid grid-cols-1 md:grid-cols-4 gap-4":"grid grid-cols-1 md:grid-cols-4 gap-4"}`}>
     <div className={`${isRTL?"order-3":""}`}>
      <Input
        placeholder={bookingfilters.searchPlaceholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
     </div>
      <div className={`${isRTL?"order-2":""}`}>
         <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as BookingStatus | "all")}>
  <SelectTrigger>
    <SelectValue placeholder={bookingfilters.statusPlaceholder} />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">{bookingfilters.statusOptions.all}</SelectItem>
    {Object.entries(uniqueStatusOptions).map(([key, label]) => (
      <SelectItem key={key} value={key}>
        {label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
      </div>
    
        <div className={`${isRTL?"order-1":""}`}>
           <Select value={serviceFilter} onValueChange={onServiceChange}>
        <SelectTrigger>
          <SelectValue placeholder={bookingfilters.serviceOptions.allServices} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{bookingfilters.serviceOptions.allServices}</SelectItem>

          {services.map((service) => (
            <SelectItem key={service._id} value={service._id}>
              {service.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
        </div>
       {!isMobile && (<div>
  <Select value={limit.toString()} onValueChange={(v) => onLimitChange(Number(v))}>
    <SelectTrigger>
      <SelectValue placeholder="Rows per page" />
    </SelectTrigger>
    <SelectContent>
      {limits.map((l) => (
        <SelectItem key={l} value={l.toString()}>
          {l}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>)}
     
    </div>
  );
}
