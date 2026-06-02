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
    <CommonCard className="mb-5 border-slate-200 shadow-sm overflow-hidden hover:border-blue-200 transition-colors">
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-lg">
            {(booking.booking as any)?.bookingCode ?? "—"}
          </h3>
          <Badge className={cn("px-2.5 py-0.5 rounded-full", config?.color ?? "")}>{config?.label ?? status}</Badge>
        </div>

        <div className="text-sm text-slate-600 bg-slate-50/50 rounded-xl p-3 border border-slate-100 space-y-2">
          <p>
            <strong>{translations.bookingHistory.tableHeaders.client}:</strong>{" "}
            {booking.customer?.fullName ?? "—"}
          </p>
          <p>
            <strong>{translations.bookingHistory.tableHeaders.service}:</strong>{" "}
            {serviceName}
          </p>
          <p>
            <strong>{translations.bookingHistory.tableHeaders.date}:</strong>{" "}
            {formatSmartDate(booking.booking?.schedule?.startDateTime?.toLocaleString() ?? "")}
          </p>
          <p>
            <strong>{translations.bookingHistory.tableHeaders.time}:</strong>{" "}
            {formatBookingDurationText(booking.booking || {})}
          </p>
          <p>
            <strong>{translations.bookingHistory.tableHeaders.payment}:</strong>{" "}
            {booking.booking.currency} {booking.booking.amount}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Button
            size="default"
            variant="outline"
            onClick={() => toggleExpanded(booking._id)}
            className="flex items-center gap-1 cursor-pointer"
          >
            {bookingActions["View Details"]}
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
          <Button
            size="default"
            variant="secondary"
            onClick={() => onOpenDisputes(booking._id)}
            className="cursor-pointer"
          >
            {t('sidebar.disputes')}
          </Button>

          {booking.status === "requested" && (
            <>
              <Button
                size="default"
                variant="default"
                onClick={() => { toast.success("Booking accepted"); }}
                className="bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-sm"
              >
                {bookingActions.Accept}
              </Button>

              <Button size="default" variant="default" onClick={() => onIgnore(booking._id)} className="bg-rose-500 text-white hover:bg-rose-600 cursor-pointer shadow-sm">
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