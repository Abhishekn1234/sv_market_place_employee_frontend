import type { Customer } from "@/pages/History/BookingHistory/domain/entities/customer.types";
import { Phone } from "lucide-react";

interface Props {
  customer?: Customer;
  t: (key: string) => string;
  showCallButton?: boolean;
  className?: string;
}

export default function BookingCustomerInfo({
  customer,
  t,
  showCallButton = false,
  className,
}: Props) {
  return (
    <div className={`rounded-md border bg-muted/20 dark:bg-slate-800/40 px-2.5 py-1.5 space-y-0.5 ${className ?? ""}`}>

      {/* Section label */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
        {t("availableBooking.customer")}
      </p>

      {/* Name */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground shrink-0">
          {t("availableBookings.name")}
        </span>
        <span className="text-[12px] font-medium text-right truncate max-w-[160px]">
          {customer?.fullName || t("common.na")}
        </span>
      </div>

      {/* Email */}
            <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-[10px] text-muted-foreground shrink-0">
                {t("availableBookings.email")}
            </span>
            <span className="text-[10px] text-right truncate min-w-0 flex-1">
                {customer?.email || t("common.na")}
            </span>
            </div>
      {/* Phone */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground shrink-0">
          {t("availableBookings.phone")}
        </span>
        <span className="text-[11px] text-right">
          {customer?.phone || t("common.na")}
        </span>
      </div>

      {/* Call button */}
      {showCallButton && customer?.phone && (
        <a
          href={`tel:${customer.phone}`}
          className="mt-1.5 flex items-center justify-center gap-1.5 w-full 
            bg-emerald-600 hover:bg-emerald-700 text-white rounded-md 
            py-0.5 text-[11px] font-medium transition-colors"
        >
          <Phone size={11} />
          {t("availableBookings.callCustomer")}
        </a>
      )}
    </div>
  );
}