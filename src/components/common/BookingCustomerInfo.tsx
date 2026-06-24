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
      <p className="text-xs font-semibold text-muted-foreground mb-3">
        {t("availableBooking.customer")}
      </p>

      <div className="space-y-3">
        {/* Name */}
        <div>
          <p className="text-xs text-muted-foreground">
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
          <p className="text-xs text-muted-foreground">
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
          <p className="text-xs text-muted-foreground">
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
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            <Phone size={16} />
            {t("availableBookings.callCustomer")}
          </a>
        )}
      </div>
    </div>
  );
}