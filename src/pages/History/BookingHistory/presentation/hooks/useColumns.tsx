import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

import type { TableColumn } from "@/components/common/CommonTable";
import type { Booking } from "../../domain/entities/booking";

import { useLanguage } from "@/context/LanguageContext";
import { useStatusConfig } from "./statusconfig";
import { useStringUtils } from "./useStringutils";

import type { TableHeaders } from "../../domain/entities/tableheader.types";
import { useAccept } from "@/core/Websocket/presentation/hooks/useAccept";
import { useAvailableBookings } from "@/core/Websocket/presentation/hooks/useGet";
import { useTheme } from "@/context/ThemeContext";

type Params = {
  expandedBooking: string | null;
  toggleExpanded: (id: string) => void;
  onIgnore: (bookingId: string) => void; 
};

export function useBookingColumns({
  expandedBooking,
  toggleExpanded,
  onIgnore,
}: Params): TableColumn<Booking>[] {
  const { translations } = useLanguage();
  const tableHeaders = translations.bookingHistory.tableHeaders as TableHeaders;
  const bookinghistorycancel = translations.bookingHistory;

  const { updateBooking } = useAvailableBookings();
  const { mutate: acceptBooking } = useAccept();
  const { theme } = useTheme();

  const statusConfig = useStatusConfig();
  const { formatTime, formatSmartDate } = useStringUtils();

  const baseClass = "px-4 break-words whitespace-normal";
  const cellClass =
    theme === "dark"
      ? `${baseClass} bg-gray-900 text-gray-100 hover:bg-gray-900 hover:text-gray-100`
      : baseClass;

  return [
    {
      key: "id",
      header: tableHeaders.id,
      className: cellClass,
    },
    {
      key: "clientName",
      header: tableHeaders.client,
      className: cellClass,
      render: (b) => <span dir="ltr">{b.clientName}</span>,
    },
    {
      key: "serviceType",
      header: tableHeaders.service,
      className: cellClass,
      render: (b) => b.serviceType,
    },
    {
      key: "date",
      header: tableHeaders.date,
      className: cellClass,
      render: (b) => <span dir="ltr">{formatSmartDate(b.date)}</span>,
    },
    {
      key: "time",
      header: tableHeaders.time,
      className: cellClass,
      render: (b) => <span dir="ltr">{formatTime(b.time)}</span>,
    },
    {
      key: "payment",
      header: tableHeaders.payment,
      className: cellClass,
      render: (b) => (
        <span dir="ltr">
          {b.currency} {b.payment}
        </span>
      ),
    },
    {
      key: "status",
      header: tableHeaders.status,
      className: cellClass,
      render: (b) => (
        <Badge className={statusConfig[b.status].color}>
          {statusConfig[b.status].label}
        </Badge>
      ),
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
            onClick={() => toggleExpanded(b.id)}
            className="flex items-center gap-1 cursor-pointer"
          >
            {bookinghistorycancel.actions["View Details"]}
            {expandedBooking === b.id ? <ChevronUp /> : <ChevronDown />}
          </Button>

          <Button
            size="sm"
            variant="default"
            onClick={() => {
              updateBooking(b.id, { status: "WORKER_ACCEPTED" });

              acceptBooking({
                bookingId: b.id,
                bookingStatus: "WORKER_ACCEPTED",
              });

              toast.success("Booking accepted");
            }}
            className="bg-green-500 text-white hover:bg-green-600 cursor-pointer"
          >
            {bookinghistorycancel.actions.Accept}
          </Button>

          <Button
            size="sm"
            variant="default"
            onClick={() => onIgnore(b.id)}   
            className="bg-red-500 text-white hover:bg-red-600 cursor-pointer"
          >
            {bookinghistorycancel.actions.Ignore}
          </Button>
        </div>
      ),
    },
  ];
}
