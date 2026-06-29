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
  return (
    <section className={cn("space-y-3", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {t("availableBooking.customer")}
      </p>

      <div className="space-y-2.5 rounded-lg border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-950/30">
        <div className="flex items-start gap-2.5">
          <UserRound size={15} className="mt-0.5 shrink-0 text-slate-400" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] leading-none text-muted-foreground">
              {t("availableBookings.name")}
            </p>
            <p
              className="mt-1 text-sm font-semibold leading-snug text-slate-900 break-words dark:text-slate-100"
              title={customer?.fullName}
            >
              {customer?.fullName || t("common.na")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Mail size={15} className="mt-0.5 shrink-0 text-slate-400" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] leading-none text-muted-foreground">
              {t("availableBookings.email")}
            </p>
            <p
              className="mt-1 text-sm leading-snug text-slate-700 break-all dark:text-slate-300"
              {...(isRTL ? { dir: "ltr" } : {})}
              title={customer?.email}
            >
              {customer?.email || t("common.na")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Phone size={15} className="mt-0.5 shrink-0 text-slate-400" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] leading-none text-muted-foreground">
              {t("availableBookings.phone")}
            </p>
            <p
              className="mt-1 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100"
              {...(isRTL ? { dir: "ltr" } : {})}
            >
              {customer?.phone || t("common.na")}
            </p>
          </div>
        </div>

        {showCallButton && customer?.phone && (
          <a
            href={`tel:${customer.phone}`}
            className="inline-flex h-8 w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <Phone size={14} />
            <span className="truncate">{t("availableBookings.callCustomer")}</span>
          </a>
        )}
      </div>
    </section>
  );
}
