import { ChevronDown, ChevronUp } from "lucide-react";
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

  const serviceName =
    typeof booking.service === "object" ? booking.service?.name ?? "—" : booking.service ?? "—";

  return (
    <CommonCard className="mb-3 sm:mb-5  shadow-sm overflow-hidden border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
      <div className="p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
            {(booking.booking as any)?.bookingCode ?? "—"}
          </h3>
          <Badge className={cn("px-2.5 py-0.5 rounded-full", config?.color ?? "")}>{config?.label ?? status}</Badge>
        </div>

        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-slate-100 dark:border-slate-800 space-y-1.5 sm:space-y-2">
          <p className="leading-relaxed">
            <strong>{translations.bookingHistory.tableHeaders.client}:</strong>{" "}
            <span className="break-words">{booking.customer?.fullName ?? "—"}</span>
          </p>
          <p className="leading-relaxed">
            <strong>{translations.bookingHistory.tableHeaders.service}:</strong>{" "}
            <span className="break-words">{serviceName}</span>
          </p>
          <p className="leading-relaxed">
            <strong>{translations.bookingHistory.tableHeaders.date}:</strong>{" "}
            {formatSmartDate(booking.booking?.schedule?.startDateTime?.toLocaleString() ?? "")}
          </p>
          <p className="leading-relaxed">
            <strong>{translations.bookingHistory.tableHeaders.time}:</strong>{" "}
            {formatBookingDurationText(booking.booking || {})}
          </p>
          <p className="leading-relaxed">
            <strong>{translations.bookingHistory.tableHeaders.payment}:</strong>{" "}
            {booking.booking.currency} {booking.booking.amount}
          </p>
        </div>

        <div className="flex flex-col sm:flex-wrap gap-2 mt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleExpanded(booking._id)}
            className="flex items-center justify-center gap-1 cursor-pointer w-full sm:w-auto text-xs sm:text-sm"
          >
            {bookingActions["View Details"]}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onOpenDisputes(booking._id)}
            className="cursor-pointer w-full sm:w-auto text-xs sm:text-sm"
          >
            {t('sidebar.disputes')}
          </Button>

          {booking.status === "requested" && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={() => { toast.success("Booking accepted"); }}
                className="bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-sm w-full sm:w-auto text-xs sm:text-sm"
              >
                {bookingActions.Accept}
              </Button>

              <Button size="sm" variant="default" onClick={() => onIgnore(booking._id)} className="bg-rose-500 text-white hover:bg-rose-600 cursor-pointer shadow-sm w-full sm:w-auto text-xs sm:text-sm">
                {bookingActions.Ignore}
              </Button>
            </>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 border-t pt-4">
            <BookingExpandedRow booking={booking} bookingCategories={bookingCategories} />
          </div>
        )}
      </div>
    </CommonCard>
  );
}