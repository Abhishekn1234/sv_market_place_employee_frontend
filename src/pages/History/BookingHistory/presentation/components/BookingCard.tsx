import { ChevronDown, ChevronUp, User, Calendar, Clock, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommonCard } from "@/components/common/CommonCard";
import { useLanguage } from "@/context/LanguageContext";
import { useStatusConfig } from "../hooks/statusconfig";
import { useStringUtils } from "../hooks/useStringutils";
import { formatBookingDurationText } from "../utils/formatduration";
import { BookingExpandedRow } from "./BookingExpandedColumns";
import { toast } from "react-toastify";

import type { BookingHistory } from "../../domain/entities/bookinghistory";
import type { BookingStatus } from "../../../../Booking/AvailableBooking/domain/entities/bookingstatus";
import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import { cn } from "@/lib/utils";

type Props = {
  booking: BookingHistory;
  expandedBookingId: string | null;
  toggleExpanded: (id: string) => void;
  onIgnore: (bookingId: string) => void;
  onOpenDisputes: (bookingId: string) => void;
  bookingCategories: ServiceCategory[];
};

export function BookingCard({
  booking,
  expandedBookingId,
  toggleExpanded,
  onIgnore,
  onOpenDisputes,
  bookingCategories,
}: Props) {
  const { translations, t } = useLanguage();
  const bookingActions = translations.bookingHistory.actions;
  const { formatSmartDate } = useStringUtils();
  const statusConfig = useStatusConfig();

  const isExpanded = expandedBookingId === booking._id;
  const status = booking.status as BookingStatus;
  const config = statusConfig[status];
  const labels = translations.bookingHistory.tableHeaders;

  const serviceName =
    typeof booking.service === "object" ? booking.service?.name ?? "—" : booking.service ?? "—";

  return (
    <CommonCard hoverable className="mb-4 sm:mb-6 overflow-hidden rounded-2xl">
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
              {(booking.booking as any)?.bookingCode ?? "—"}
            </h3>
            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{serviceName}</p>
          </div>
          <Badge className={cn("px-3 py-1.5 rounded-xl text-[11px] font-bold border-none shadow-sm", config?.color ?? "")}>{config?.label ?? status}</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
          <div className="flex flex-col min-w-0">
  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
    {labels.client}
  </span>
  <span className="text-slate-700 dark:text-slate-200 font-medium break-words whitespace-normal">
    {booking.customer?.fullName ?? "—"}
  </span>
</div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{labels.date}</span>
              <span className="text-slate-700 dark:text-slate-200 font-medium">{formatSmartDate(booking.booking?.schedule?.startDateTime?.toLocaleString() ?? "")}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{labels.time}</span>
              <span className="text-slate-700 dark:text-slate-200 font-medium">{formatBookingDurationText(booking.booking || {})}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
              <Banknote className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{labels.payment}</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {booking.booking.currency} {booking.booking.amount}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleExpanded(booking._id)}
            className="flex-1 sm:flex-none items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm h-11 px-6 rounded-xl border-slate-200 font-semibold"
          >
            {bookingActions["View Details"]}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onOpenDisputes(booking._id)}
            className="flex-1 sm:flex-none cursor-pointer text-xs sm:text-sm h-11 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-none shadow-none rounded-xl font-semibold"
          >
            {t('sidebar.disputes')}
          </Button>

          {booking.status === "requested" && (
            <div className="flex gap-3 flex-1 sm:flex-none">
              <Button
                size="default"
                variant="default"
                onClick={() => { toast.success("Booking accepted"); }}
                className="flex-1 sm:flex-none bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-lg shadow-emerald-200 h-11 px-8 rounded-xl font-bold"
              >
                {bookingActions.Accept}
              </Button>

              <Button size="default" variant="default" onClick={() => onIgnore(booking._id)} className="flex-1 sm:flex-none bg-rose-500 text-white hover:bg-rose-600 cursor-pointer shadow-lg shadow-rose-200 h-11 px-8 rounded-xl font-bold">
                {bookingActions.Ignore}
              </Button>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <BookingExpandedRow booking={booking} bookingCategories={bookingCategories} />
          </div>
        )}
      </div>
    </CommonCard>
  );
}