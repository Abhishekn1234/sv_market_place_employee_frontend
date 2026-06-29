import { CommonCard } from "@/components/common/CommonCard";
import { Button } from "@/components/ui/button";
import { formatScheduleDate } from "../utils/formatScheduledatetime";
import BookingCustomerInfo from "@/components/common/BookingCustomerInfo";
import BookingEstimateRow from "@/components/common/BookingEstimateRow";
import BookingMapButton from "@/components/common/BookingMapButton";
import { CalendarClock } from "lucide-react";

interface Props {
  booking: any;
  categoryMap: Record<string, string>;
  isPending: boolean;
  isRTL:boolean;
  t: (key: string) => string;
  getLatLng: (location?: { type: "Point"; coordinates: number[] }) => { lat: number; lng: number } | null;
  handleAccept: (booking: any) => void;
  handleIgnore: (id: string) => void;
}

export default function AvailableBookingCard({
  booking,
  categoryMap,
  isPending,
  t,
  isRTL,
  getLatLng,
  handleAccept,
  handleIgnore,
}: Props) {
  const coords = getLatLng(booking.location);
  const isScheduled = String(booking.bookingType).toUpperCase().includes("SCHEDULE");

  return (
    <CommonCard
      noPadding
      hoverable
      className="h-full rounded-xl border bg-white shadow-sm dark:bg-slate-900"
    >
      <div className="flex h-full min-w-0 flex-col">

      
   <div className="flex flex-col gap-2 border-b bg-slate-50/70 px-4 py-3 dark:bg-slate-900/70 sm:flex-row sm:items-start sm:justify-between">
  {/* Left Side: Service Details */}
  <div className="min-w-0 flex-1">
    <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
      {booking.service?.name || "-"}
    </p>
    <p className="mt-1 truncate text-xs text-muted-foreground">
      {booking.service?.category ? categoryMap[booking.service.category] : "-"}
    </p>
  </div>

  {/* Right/Bottom Side: Booking Type Badge */}
  {/* Removed `shrink-0` since it's wrapping, added `self-start` so it doesn't stretch full width when stacked */}
  {/* <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:self-auto self-start">
    {booking.bookingType || "—"}
  </span> */}
  <span className="w-fit rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
    {booking.bookingType || "-"}
  </span>
   </div>

      {/* BODY */}
      <div className="flex flex-1 flex-col gap-3 px-4 py-4">

        {/* Customer info */}
        <BookingCustomerInfo
            customer={booking.customer}
            t={t}
            showCallButton
            isRTL={isRTL}
          />

        {/* Estimate row */}
        <BookingEstimateRow
          schedule={booking.schedule}
          currency={booking.currency}
          amount={booking.workerPoolAmount}
          t={t}
          isRTL={isRTL}
        />

        {/* Scheduled date — only if scheduled */}
        {isScheduled && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-950/30">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CalendarClock size={14} />
              {t("common.date")}
            </span>
            <span className="text-right text-xs font-semibold text-slate-900 dark:text-slate-100">
              {formatScheduleDate(booking.schedule?.startDateTime)}
            </span>
          </div>
        )}

        {/* Map link */}
        <BookingMapButton
          coordinates={coords}
          label={t("availableBooking.getDirections")}
        />
      </div>

      {/* FOOTER — Accept / Ignore */}
      <div className="mt-auto grid grid-cols-1 gap-2 border-t bg-slate-50/60 px-4 py-3 dark:bg-slate-950/20 sm:grid-cols-2">
        <Button
          disabled={isPending}
          onClick={() => handleAccept(booking)}
          size="sm"
          className="h-9 text-xs font-semibold"
        >
          {t("common.accept")}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleIgnore(booking._id)}
          size="sm"
          className="h-9 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
        >
          {t("common.ignore")}
        </Button>
      </div>
      </div>
    </CommonCard>
  );
}
