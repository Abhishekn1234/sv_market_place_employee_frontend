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
      className={`bg-muted/20 dark:bg-slate-800/40 px-3 py-2 space-y-2 ${
        className ?? ""
      }`}
    >
      {/* Header */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {t("availableBooking.customer")}
      </p>

      {/* Name */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground shrink-0">
          {t("availableBookings.name")}
        </span>

        <span
          className="flex-1 min-w-0 text-[12px] font-semibold truncate"
          title={customer?.fullName}
        >
          {customer?.fullName || t("common.na")}
        </span>
      </div>

      {/* Email */}
      <div className="space-y-0.5">
        <p className="text-[11px] text-muted-foreground">
          {t("availableBookings.email")}
        </p>

        <p
          className="text-[11px] leading-4 break-all line-clamp-2"
          {...(isRTL ? { dir: "ltr" } : {})}
          title={customer?.email}
        >
          {customer?.email || t("common.na")}
        </p>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground shrink-0">
          {t("availableBookings.phone")}
        </span>

        <span
          className="text-[12px] font-medium whitespace-nowrap"
          {...(isRTL ? { dir: "ltr" } : {})}
        >
          {customer?.phone || t("common.na")}
        </span>
      </div>

      {/* Call Button */}
      {showCallButton && customer?.phone && (
        <a
          href={`tel:${customer.phone}`}
          className="
            flex items-center justify-center gap-2
            w-full h-8
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