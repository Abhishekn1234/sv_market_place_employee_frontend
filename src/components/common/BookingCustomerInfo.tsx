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
      className={`bg-muted/20 dark:bg-slate-800/40 px-3 py-3 space-y-2.5 max-w-[220px] aspect-square w-full h-auto flex flex-col justify-between ${
        className ?? ""
      }`}
    >
      <div className="space-y-2">
        {/* Header */}
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          {t("availableBooking.customer")}
        </p>

        {/* Content Grid: Keeps everything tight and square-friendly */}
        <div className="grid grid-cols-1 gap-1.5">
          {/* Name */}
          <div className="leading-tight">
            <span className="text-[9px] block text-muted-foreground">
              {t("availableBookings.name")}
            </span>
            <span
              className="text-[11px] font-semibold break-words text-card-foreground block"
              title={customer?.fullName}
            >
              {customer?.fullName || t("common.na")}
            </span>
          </div>

          {/* Email */}
          <div className="leading-tight">
            <span className="text-[9px] block text-muted-foreground">
              {t("availableBookings.email")}
            </span>
            <span
              className="text-[10px] break-all text-card-foreground block"
              {...(isRTL ? { dir: "ltr" } : {})}
              title={customer?.email}
            >
              {customer?.email || t("common.na")}
            </span>
          </div>

          {/* Phone */}
          <div className="leading-tight">
            <span className="text-[9px] block text-muted-foreground">
              {t("availableBookings.phone")}
            </span>
            <span
              className="text-[11px] font-medium text-card-foreground block"
              {...(isRTL ? { dir: "ltr" } : {})}
            >
              {customer?.phone || t("common.na")}
            </span>
          </div>
        </div>
      </div>

      {/* Call Button */}
      {showCallButton && customer?.phone && (
        <a
          href={`tel:${customer.phone}`}
          className="
            flex items-center justify-center gap-1.5
            w-full h-7 mt-1
            rounded-md
            bg-emerald-600 hover:bg-emerald-700
            text-white text-[11px] font-medium
            transition-colors shrink-0
          "
        >
          <Phone size={11} />
          {t("availableBookings.callCustomer")}
        </a>
      )}
    </CommonCard>
  );
}