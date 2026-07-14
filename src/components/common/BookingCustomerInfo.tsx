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

      <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-950/30">
        {/* Header: avatar + name */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200/80 dark:bg-slate-800">
            <UserRound size={15} className="text-slate-500 dark:text-slate-400" />
          </div>
          <p
            className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900 dark:text-slate-100"
            title={customer?.fullName}
          >
            {customer?.fullName || t("common.na")}
          </p>
        </div>

        <div className="my-2.5 h-px bg-slate-200/70 dark:bg-slate-800" />

        {/* Contact details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail size={13} className="shrink-0 text-slate-400" />
            <p
              className="min-w-0 flex-1 truncate text-xs text-slate-600 dark:text-slate-300"
              {...ltr}
              title={customer?.email}
            >
              {customer?.email || t("common.na")}
            </p>
          </div>

          {/* Phone + call button: wraps based on real space, not viewport */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <div className="flex min-w-0 items-center gap-2">
              <Phone size={13} className="shrink-0 text-slate-400" />
              <p
                className="whitespace-nowrap text-xs font-medium text-slate-800 dark:text-slate-200"
                {...ltr}
              >
                {customer?.phone || t("common.na")}
              </p>
            </div>

            {showCallButton && customer?.phone && (
              <a
                href={`tel:${customer.phone}`}
                className="ml-auto inline-flex h-6 shrink-0 items-center gap-1 rounded-md bg-emerald-600 px-2 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <Phone size={11} />
                {t("availableBookings.callCustomer")}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}