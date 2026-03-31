import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

import type { TableColumn } from "@/components/common/CommonTable";
import { useLanguage } from "@/context/LanguageContext";
import { useStatusConfig } from "./statusconfig";
import { useStringUtils } from "./useStringutils";

import type { BookingHistory } from "../../domain/entities/bookinghistory";
import type { BookingStatus } from "../../../../Booking/AvailableBooking/domain/entities/bookingstatus";

type Params = {
  expandedBooking: string | null;
  toggleExpanded: (id: string) => void;
  onIgnore: (bookingId: string) => void;
};

export function useBookingColumns({
  expandedBooking,
  toggleExpanded,
  onIgnore,
}: Params): TableColumn<BookingHistory>[] {
  const { translations } = useLanguage();
  const tableHeaders = translations.bookingHistory.tableHeaders;
  const bookingActions = translations.bookingHistory.actions;

  const {  formatSmartDate } = useStringUtils();
  const statusConfig = useStatusConfig();

  const baseClass = "px-4 break-words whitespace-normal";
  const cellClass = baseClass; 

  return [
    {
      key: "_id",
      header: tableHeaders.id,
      className: cellClass,
    },
    {
      key: "customer",
      header: tableHeaders.client,
      className: cellClass,
      render: (b) => <span dir="ltr">{b.customer?.fullName ?? "—"}</span>,
    },
    {
      key: "serviceType",
      header: tableHeaders.service,
      className: cellClass,
      render: (b) =>
        typeof b.service === "object" ? b.service?.name ?? "—" : b.service ?? "—",
    },
    {
      key: "date",
      header: tableHeaders.date,
      className: cellClass,
      render: (b) => (
        <span dir="ltr">
          {formatSmartDate(b.booking?.schedule?.startDateTime?.toLocaleString() ?? "")}
        </span>
      ),
    },
   {
  key: "time",
  header: tableHeaders.time,
  className: cellClass,
  render: (b) => {
    const mode = b.booking?.pricingMode;
    const schedule = b.booking?.schedule;

    let timeDisplay = "—";

    if (mode === "HOURLY" && schedule?.estimatedHours != null) {
      if(schedule.estimatedHours < 1) {
        const minutes = Math.round(schedule.estimatedHours * 60);
        timeDisplay = `${minutes} mins`;
      }if(schedule.estimatedHours > 1 && schedule.estimatedHours < 24) {
        timeDisplay = `${schedule.estimatedHours} hrs` ;
      }if(schedule.estimatedHours == 1){
        timeDisplay = `${schedule.estimatedHours} hr` ;
      }
      
    } else if (mode === "PER_DAY" && schedule?.estimatedDays != null) {
      timeDisplay = `${schedule.estimatedDays} days`;
    }

    return <span dir="ltr">{timeDisplay}</span>;
  },
},{
  key: "payment",
  header: tableHeaders.payment,
  className: cellClass,
  render: (b) => {
   return<span>{b.booking.currency} {b.booking.amount}</span>;
  },
},
    {
      key: "status",
      header: tableHeaders.status,
      className: cellClass,
      render: (b) => {
        const status = b.status as BookingStatus;
        console.log(status);
        const config = statusConfig[status];
        return (
          <Badge className={config?.color ?? ""}>{config?.label ?? status}</Badge>
        );
      },
    },
    {
      key: "actions",
      header: tableHeaders.actions,
      className: cellClass,
      render: (b) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleExpanded(b._id)}
            className="flex items-center gap-1 cursor-pointer"
          >
            {bookingActions["View Details"]}
            {expandedBooking === b._id ? <ChevronUp /> : <ChevronDown />}
          </Button>

          {b.status === "requested" && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  // Implement accept logic here
                  toast.success("Booking accepted");
                }}
                className="bg-green-500 text-white hover:bg-green-600 cursor-pointer"
              >
                {bookingActions.Accept}
              </Button>

              <Button
                size="sm"
                variant="default"
                onClick={() => onIgnore(b._id)}
                className="bg-red-500 text-white hover:bg-red-600 cursor-pointer"
              >
                {bookingActions.Ignore}
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];
}