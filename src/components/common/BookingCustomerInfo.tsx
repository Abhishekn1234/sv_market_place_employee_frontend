import type { Customer } from "@/pages/History/BookingHistory/domain/entities/customer.types";
import { Phone } from "lucide-react";
import { CommonCard } from "./CommonCard";

interface Props {
  customer?: Customer;
  t: (key: string) => string;
  showCallButton?: boolean;
  className?: string;
  isRTL?: boolean;
}

export default function BookingCustomerInfo({
  customer,
  t,
  showCallButton = false,
  className,
  isRTL = false,
}: Props) {
  return (
    <CommonCard
      noPadding
      className={`w-[220px] h-[220px] bg-muted/20 dark:bg-slate-800/40 ${className ?? ""}`}
      contentClassName="h-full"
    >
      {/* Single flex column fills the card height */}
      <div className="flex flex-col justify-between h-full p-3 overflow-hidden">
        
        {/* Top section: header + fields */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            {t("availableBooking.customer")}
          </p>

          <div className="space-y-2">
            {/* Name */}
            <div>
              <p className="text-[8px] text-muted-foreground mb-0.5">
                {t("availableBookings.name")}
              </p>
              <p
                className="text-xs font-semibold text-card-foreground leading-tight line-clamp-2 break-words"
                title={customer?.fullName}
              >
                {customer?.fullName || t("common.na")}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-[8px] text-muted-foreground mb-0.5">
                {t("availableBookings.email")}
              </p>
              <p
                className="text-[10px] leading-tight text-card-foreground line-clamp-2 break-all"
                {...(isRTL ? { dir: "ltr" } : {})}
                title={customer?.email}
              >
                {customer?.email || t("common.na")}
              </p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-[8px] text-muted-foreground mb-0.5">
                {t("availableBookings.phone")}
              </p>
              <p
                className="text-xs font-medium text-card-foreground"
                {...(isRTL ? { dir: "ltr" } : {})}
              >
                {customer?.phone || t("common.na")}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: call button, only renders when needed */}
        {showCallButton && customer?.phone && (
          <a
            href={`tel:${customer.phone}`}
            className="mt-2 h-8 w-full flex items-center justify-center gap-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-medium shrink-0 transition-colors"
          >
            <Phone size={12} />
            <span className="truncate">{t("availableBookings.callCustomer")}</span>
          </a>
        )}
      </div>
    </CommonCard>
  );
}