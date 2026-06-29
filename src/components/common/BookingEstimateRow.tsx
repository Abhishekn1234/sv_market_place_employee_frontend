import type { Bookingschedule } from "@/pages/Booking/AvailableBooking/domain/entities/bookingschedule";
import { Clock3, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  schedule?: Bookingschedule;
  currency?: string;
  isRTL?: boolean;
  amount?: number | string;
  t: (key: string) => string;
  showBorder?: boolean;
  className?: string;
}

export default function BookingEstimateRow({
  schedule,
  isRTL,
  currency,
  amount,
  t,
  showBorder = false,
  className,
}: Props) {
  const isDaily = !!schedule?.estimatedDays;

  const ltr = isRTL ? { dir: "ltr" as const } : {};

  return (
    <section
      className={cn(
        "space-y-3 rounded-lg border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/20",
        showBorder && "border-b pb-3",
        className,
      )}
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2.5 py-2 dark:bg-slate-900">
          <Clock3 size={15} className="shrink-0 text-blue-500" />
          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {isDaily
                ? t("availableBookings.EstimatedDays")
                : t("availableBookings.EstimatedHours")}
            </p>
            <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-slate-100" {...ltr}>
              {isDaily
                ? `${schedule?.estimatedDays ?? 0} days`
                : `${schedule?.estimatedHours ?? 0} hrs`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-2 dark:bg-emerald-950/25">
          <Wallet size={15} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {t("availableBookings.You Earn")}
            </p>
            <p
              className="text-sm font-bold leading-tight text-emerald-700 dark:text-emerald-300"
              {...ltr}
            >
              {currency} {amount ?? 0}
            </p>
          </div>
        </div>
      </div>

      <p className="rounded-md bg-muted/60 px-2.5 py-1.5 text-[11px] leading-snug text-muted-foreground dark:bg-slate-800/70">
        {isDaily
          ? t("availableBookings.dailyNote")
          : t("availableBookings.hourlyNote")}
      </p>
    </section>
  );
}
