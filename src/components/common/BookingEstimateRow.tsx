import type { Bookingschedule } from "@/pages/Booking/AvailableBooking/domain/entities/bookingschedule";
import { Clock3, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

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
  const ltr = isRTL ? { dir: "ltr" as const } : {};

  const estimated = useMemo(() => {
    return {
      estimatedHours: Number(schedule?.estimatedHours ?? 0),
      estimatedDays: Number(schedule?.estimatedDays ?? 0),
    };
  }, [schedule]);

  const isDaily = estimated.estimatedDays > 0;

  return (
    <section
      className={cn(
        "space-y-2.5 rounded-lg border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/20",
        showBorder && "border-b pb-3",
        className
      )}
    >
      <div className="grid grid-cols-2 gap-2">
        {/* Time */}
        <div className="flex min-w-0 items-center gap-2 rounded-md bg-blue-50/70 px-2 py-2 dark:bg-blue-950/20">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/40">
            <Clock3
              size={14}
              className="text-blue-600 dark:text-blue-400"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-medium uppercase leading-tight tracking-wide text-muted-foreground">
              {isDaily
                ? t("availableBookings.EstimatedDays")
                : t("availableBookings.EstimatedHours")}
            </p>

            <p
              className="text-xs font-semibold leading-tight text-slate-900 dark:text-slate-100"
              {...ltr}
            >
              {isDaily
                ? `${estimated.estimatedDays} ${t("common.days")}`
                : `${estimated.estimatedHours} ${t("common.hours")}`}
            </p>
          </div>
        </div>

        {/* Earnings */}
        <div className="flex min-w-0 items-center gap-2 rounded-md bg-emerald-50 px-2 py-2 dark:bg-emerald-950/25">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900/40">
            <Wallet
              size={14}
              className="text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-medium uppercase leading-tight tracking-wide text-muted-foreground">
              {t("availableBookings.You Earn")}
            </p>

            <p
              className="break-words text-xs font-bold leading-tight text-emerald-700 dark:text-emerald-300"
              {...ltr}
            >
              {currency ?? ""} {amount ?? 0}
            </p>
          </div>
        </div>
      </div>

      <p className="rounded-md bg-muted/60 px-2.5 py-1.5 text-[10px] leading-snug text-muted-foreground dark:bg-slate-800/70">
        {isDaily
          ? t("availableBookings.dailyNote")
          : t("availableBookings.hourlyNote")}
      </p>
    </section>
  );
}