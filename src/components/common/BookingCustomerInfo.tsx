import type { Customer } from "@/pages/History/BookingHistory/domain/entities/customer.types";
import { Mail, Phone, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const ltr = isRTL ? { dir: "ltr" as const } : {};

  return (
    <section className={cn("space-y-1.5", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {t("availableBooking.customer")}
      </p>

      <div className="space-y-2 rounded-md border border-slate-100 bg-slate-50/60 p-2.5 dark:border-slate-800 dark:bg-slate-950/30">
        <div className="flex items-center gap-2">
          <UserRound size={14} className="shrink-0 text-slate-400" />
          <p
            className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900 dark:text-slate-100"
            title={customer?.fullName}
          >
            {customer?.fullName || t("common.na")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Mail size={14} className="shrink-0 text-slate-400" />
          <p
            className="min-w-0 flex-1 truncate text-xs text-slate-600 dark:text-slate-300"
            {...ltr}
            title={customer?.email}
          >
            {customer?.email || t("common.na")}
          </p>
        </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        
        {/* LEFT SIDE */}
        <div className="flex min-w-0 items-center gap-2">
          <Phone size={14} className="shrink-0 text-slate-400" />

          <p
            className="text-xs font-medium text-slate-800 dark:text-slate-200 break-words"
            {...ltr}
          >
            {customer?.phone || t("common.na")}
          </p>
        </div>

        {/* BUTTON */}

      </div>
      {showCallButton && customer?.phone && (
          <a
            href={`tel:${customer.phone}`}
            className="inline-flex w-fit sm:w-auto h-6 shrink-0 items-center gap-1 rounded-md bg-emerald-600 px-2 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <Phone size={11} />
            {t("availableBookings.callCustomer")}
          </a>
        )}
      </div>
    </section>
  );
}