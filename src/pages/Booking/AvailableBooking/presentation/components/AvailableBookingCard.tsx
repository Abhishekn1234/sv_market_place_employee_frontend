import { CommonCard } from "@/components/common/CommonCard";
import { Button } from "@/components/ui/button";
import { formatScheduleDate } from "../utils/formatScheduledatetime";
import BookingCustomerInfo from "@/components/common/BookingCustomerInfo";
import BookingEstimateRow from "@/components/common/BookingEstimateRow";
import BookingMapButton from "@/components/common/BookingMapButton";

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
    <CommonCard className="flex flex-col rounded-lg border bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow w-full max-w-sm">

      
   <div className="flex flex-col gap-2 border-b px-3 py-1.5 sm:flex-row sm:items-center sm:justify-between">
  {/* Left Side: Service Details */}
  <div className="min-w-0">
    <p className="truncate text-xs font-semibold leading-tight">
      {booking.service?.name || "—"}
    </p>
    <p className="truncate text-[11px] leading-tight text-muted-foreground">
      {booking.service?.category ? categoryMap[booking.service.category] : "—"}
    </p>
  </div>

  {/* Right/Bottom Side: Booking Type Badge */}
  {/* Removed `shrink-0` since it's wrapping, added `self-start` so it doesn't stretch full width when stacked */}
  {/* <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:self-auto self-start">
    {booking.bookingType || "—"}
  </span> */}
   </div>

      {/* BODY */}
      <div className="px-3 py-1.5 space-y-1.5 text-[12px]">

        {/* Customer info */}
        <BookingCustomerInfo
          customer={booking.customer}
          t={t}
          showCallButton
         className="[&_*]:text-[12px] overflow-hidden text-ellipsis whitespace-nowrap"
         isRTL={isRTL}
        />

        {/* Estimate row */}
        <BookingEstimateRow
          schedule={booking.schedule}
          currency={booking.currency}
          amount={booking.workerPoolAmount}
          t={t}
          className="[&_*]:text-[12px]"
          isRTL={isRTL}
        />

        {/* Scheduled date — only if scheduled */}
        {isScheduled && (
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-muted-foreground">{t("common.date")}</span>
            <span className="font-medium text-[12px]">
              {formatScheduleDate(booking.schedule?.startDateTime)}
            </span>
          </div>
        )}

        {/* Map link */}
        <BookingMapButton
          coordinates={coords}
          label={t("availableBooking.getDirections")}
          className="text-[12px]"
        />
      </div>

      {/* FOOTER — Accept / Ignore */}
      <div className="px-3 py-1.5 border-t grid grid-cols-2 gap-1.5">
        <Button
          disabled={isPending}
          onClick={() => handleAccept(booking)}
          size="sm"
          className="h-6 text-[11px] px-2 font-medium"
        >
          {t("common.accept")}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleIgnore(booking._id)}
          size="sm"
          className="h-6 text-[11px] px-2 font-medium dark:bg-slate-800 dark:border-slate-700"
        >
          {t("common.ignore")}
        </Button>
      </div>

    </CommonCard>
  );
}