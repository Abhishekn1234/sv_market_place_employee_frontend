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
      className={`bg-muted/20 dark:bg-slate-800/40 px-4 py-4 space-y-3 max-w-[260px] w-full h-auto ${
        className ?? ""
      }`}
    >
      {/* Header */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {t("availableBooking.customer")}
      </p>

      {/* Name - Changed from flex to block/stacking to prevent '...' truncation */}
      <div className="space-y-0.5">
        <p className="text-[11px] text-muted-foreground">
          {t("availableBookings.name")}
        </p>
        <p
          className="text-[12px] font-semibold break-words leading-tight"
          title={customer?.fullName}
        >
          {customer?.fullName || t("common.na")}
        </p>
      </div>

      {/* Email */}
      <div className="space-y-0.5">
        <p className="text-[11px] text-muted-foreground">
          {t("availableBookings.email")}
        </p>
        <p
          className="text-[11px] leading-4 break-all"
          {...(isRTL ? { dir: "ltr" } : {})}
          title={customer?.email}
        >
          {customer?.email || t("common.na")}
        </p>
      </div>

      {/* Phone */}
      <div className="space-y-0.5">
        <p className="text-[11px] text-muted-foreground">
          {t("availableBookings.phone")}
        </p>
        <p
          className="text-[12px] font-medium whitespace-nowrap"
          {...(isRTL ? { dir: "ltr" } : {})}
        >
          {customer?.phone || t("common.na")}
        </p>
      </div>

      {/* Call Button */}
      {showCallButton && customer?.phone && (
        <a
          href={`tel:${customer.phone}`}
          className="
            flex items-center justify-center gap-2
            w-full h-9 mt-2
            rounded-md
            bg-emerald-600 hover:bg-emerald-700
            text-white text-[12px] font-medium
            transition-colors
          "
        >
          <Phone size={13} />
          {t("availableBookings.callCustomer")}
        </a>
      )}
    </CommonCard>
  );
}