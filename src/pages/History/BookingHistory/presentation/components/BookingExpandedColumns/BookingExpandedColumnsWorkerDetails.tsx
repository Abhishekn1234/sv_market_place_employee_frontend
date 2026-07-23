
import { 
  Activity, 
  Fingerprint, 
  Calendar, 
  Hourglass, 
  Clock 
} from "lucide-react";
import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import { formatBookingDurationText } from "../../utils/formatduration";


type WorkDetailsProps = {
  bookingData: Booking;
  booking: {
    assignedAt?: string;
    startedAt?: string;
    completedAt?: string;
  };
  formatSmartDate: (date: Date, options?: { showTime?: boolean }) => string;
  title: string;
  labels: {
    bookingCode: string;
    bookingType: string;
    workStartDate: string;
    startDate: string;
    workAssignedOn: string;
    workStartedOn: string;
    workCompletedOn: string;
  };
  durationLabel: string;
};

export function BookingExpandedColumnsWorkDetails({ 
  bookingData, 
  booking, 
  formatSmartDate, 
  title, 
  labels,
  durationLabel 
}: WorkDetailsProps) {
  return (
    <div className="space-y-4 min-w-0 bg-white/50 p-4 rounded-lg border border-slate-100 lg:col-span-1">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
        <Activity className="h-4 w-4" />
        {title}
      </h4>
      <div className="space-y-3 text-sm text-slate-600">
        <div className="flex items-start gap-3">
          <Fingerprint className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-slate-400 block text-xs">
              {labels.bookingCode}
            </span>
            <span className="font-mono font-medium text-slate-800 break-all">
              {bookingData?.bookingCode ?? "—"}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Activity className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-slate-400 block text-xs">
              {labels.bookingType}
            </span>
            <span className="font-medium text-slate-800 break-words">
              {bookingData?.bookingType ?? "—"}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-slate-400 block text-xs">
              {labels.workStartDate}
            </span>
                                <span className="font-medium text-slate-800 break-words">
                    {formatSmartDate(
                        bookingData?.startDate 
                        ? new Date(bookingData.startDate) 
                        : new Date()
                    )}
                    </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-slate-400 block text-xs">
              {labels.startDate}
            </span>
            <span className="font-medium text-slate-800 break-words">
              {bookingData?.schedule?.startDateTime
                ? formatSmartDate(new Date(bookingData.schedule.startDateTime))
                : "—"}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Hourglass className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-slate-400 block text-xs">
              {durationLabel}
            </span>
            <span className="font-medium text-slate-800 break-words">
              {formatBookingDurationText(bookingData)}
            </span>
          </div>
        </div>

        {/* Dynamic Milestone Timestamps */}
        <div className="pt-3 mt-3 border-t border-slate-200 space-y-2 text-xs">
          {booking.assignedAt && (
            <div className="flex items-start gap-2">
              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block">
                  {labels.workAssignedOn}
                </span>
                <span className="text-slate-700 font-medium">
                  {formatSmartDate(new Date(booking.assignedAt), {
                    showTime: true,
                  })}
                </span>
              </div>
            </div>
          )}

          {booking.startedAt && (
            <div className="flex items-start gap-2">
              <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block">
                  {labels.workStartedOn}
                </span>
                <span className="text-slate-700 font-medium">
                  {formatSmartDate(new Date(booking.startedAt), {
                    showTime: true,
                  })}
                </span>
              </div>
            </div>
          )}

          {booking.completedAt && (
            <div className="flex items-start gap-2">
              <Clock className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block">
                  {labels.workCompletedOn}
                </span>
                <span className="text-slate-700 font-medium">
                  {formatSmartDate(new Date(booking.completedAt), {
                    showTime: true,
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}