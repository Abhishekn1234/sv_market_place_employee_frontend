import type { Customer } from "@/pages/History/BookingHistory/domain/entities/customer.types";
import { Phone } from "lucide-react";

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
    <div className={className}>
      <p className="text-xs font-semibold text-muted-foreground mb-2">
  {t("availableBooking.customer")}
</p>

<div className="space-y-1">
  {/* Name */}
  <div>
    <p className="text-xs text-muted-foreground mb-0.5">
      {t("availableBookings.name")}
    </p>
    <p
      className="text-sm font-medium break-words"
      title={customer?.fullName}
    >
      {customer?.fullName || t("common.na")}
    </p>
  </div>

  {/* Email */}
  <div>
    <p className="text-xs text-muted-foreground mb-0.5">
      {t("availableBookings.email")}
    </p>
    <p
      className="text-sm break-all"
      {...(isRTL ? { dir: "ltr" } : {})}
      title={customer?.email}
    >
      {customer?.email || t("common.na")}
    </p>
  </div>

  {/* Phone */}
  <div>
    <p className="text-xs text-muted-foreground mb-0.5">
      {t("availableBookings.phone")}
    </p>
    <p
      className="text-sm font-medium"
      {...(isRTL ? { dir: "ltr" } : {})}
    >
      {customer?.phone || t("common.na")}
    </p>
  </div>

  {showCallButton && customer?.phone && (
    <a
      href={`tel:${customer.phone}`}
      className="
        inline-flex items-center gap-1.5
        px-3 py-1.5
        rounded-md
        bg-emerald-600 hover:bg-emerald-700
        text-white text-xs font-medium
        transition-colors
      "
    >
      <Phone size={14} />
      {t("availableBookings.callCustomer")}
    </a>
  )}

      </div>
    </div>
  );
}