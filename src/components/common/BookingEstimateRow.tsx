import type { Bookingschedule } from "@/pages/Booking/AvailableBooking/domain/entities/bookingschedule";

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
    <div
      className={`space-y-0.5 ${
        showBorder ? "border-b pb-1.5" : ""
      } ${className ?? ""}`}
    >
      {/* Estimated time */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
          {isDaily
            ? t("availableBookings.EstimatedDays")
            : t("availableBookings.EstimatedHours")}
        </span>

        <span className="text-[12px] font-medium" {...ltr}>
          {isDaily
            ? `${schedule?.estimatedDays ?? 0} days`
            : `${schedule?.estimatedHours ?? 0} hrs`}
        </span>
      </div>

      {/* Earnings */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
          {t("availableBookings.You Earn")}
        </span>

        <span
          className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400"
          {...ltr}
        >
          {currency} {amount ?? 0}
        </span>
      </div>

      {/* Note */}
      <p className="text-[10px] text-muted-foreground bg-muted/50 dark:bg-slate-800 
        rounded px-2 py-0.5 leading-snug">
        {isDaily
          ? t("availableBookings.dailyNote")
          : t("availableBookings.hourlyNote")}
      </p>
    </div>
  );
}