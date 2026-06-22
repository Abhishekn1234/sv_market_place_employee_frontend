import type { Bookingschedule } from "@/pages/Booking/AvailableBooking/domain/entities/bookingschedule";

interface Props {
  schedule?: Bookingschedule;
  currency?: string;
  amount?: number | string;
  t: (key: string) => string;
  showBorder?: boolean;
  className?: string;
}

export default function BookingEstimateRow({
  schedule,
  currency,
  amount,
  t,
  showBorder = false,
  className,
}: Props) {
  const isDaily = !!schedule?.estimatedDays;

  return (
    <div className={`space-y-0.5 ${showBorder ? "border-b pb-1.5" : ""} ${className ?? ""}`}>

      {/* Estimated time + earnings on one row */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
          {isDaily ? t("availableBookings.EstimatedDays") : t("availableBookings.EstimatedHours")}
        </span>
        <span className="text-[12px] font-medium">
          {isDaily
            ? `${schedule?.estimatedDays} days`
            : `${schedule?.estimatedHours} hrs`}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
          {t("availableBookings.You Earn")}
        </span>
        <span className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">
          {currency} {amount ?? 0}
        </span>
      </div>

      {/* Note — pill style, minimal */}
      <p className="text-[10px] text-muted-foreground bg-muted/50 dark:bg-slate-800 
        rounded px-2 py-0.5 leading-snug">
        {isDaily ? t("availableBookings.dailyNote") : t("availableBookings.hourlyNote")}
      </p>
    </div>
  );
}