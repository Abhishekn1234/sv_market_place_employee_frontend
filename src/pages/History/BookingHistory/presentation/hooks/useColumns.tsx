import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { TableColumn } from "@/components/common/CommonTable";
import type { Booking } from "../../domain/entities/booking";

import { useLanguage } from "@/context/LanguageContext";
import { useStatusConfig } from "./statusconfig";
import { useStringUtils } from "./useStringutils";

import type { TableHeaders } from "../../domain/entities/tableheader.types";

type Params = {
  expandedBooking: string | null;
  toggleExpanded: (id: string) => void;
};

export function useBookingColumns({
  expandedBooking,
  toggleExpanded,
}: Params): TableColumn<Booking>[] {
  const { translations } = useLanguage();
   
    const tableHeaders = translations.tableHeaders as TableHeaders;
  const statusConfig = useStatusConfig();
  const { formatTime } = useStringUtils();

  return [
    {
      key: "id",
      header: tableHeaders.id,
    },
    {
      key: "clientName",
      header: tableHeaders.client,
      render: (b) => <span dir="ltr">{b.clientName}</span>,
    },
    {
      key: "serviceType",
      header: tableHeaders.service,
    },
    {
      key: "date",
      header: tableHeaders.date,
      render: (b) => <span dir="ltr">{b.date}</span>,
    },
    {
      key: "time",
      header: tableHeaders.time,
      render: (b) => <span dir="ltr">{formatTime(b.time)}</span>,
    },
    {
      key: "payment",
      header: tableHeaders.payment,
      render: (b) => <span dir="ltr">${b.payment}</span>,
    },
    {
      key: "status",
      header: tableHeaders.status,
      render: (b) => (
        <Badge className={statusConfig[b.status].color}>
          {statusConfig[b.status].label}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: tableHeaders.actions,
      render: (b) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => toggleExpanded(b.id)}
        >
          {expandedBooking === b.id ? <ChevronUp /> : <ChevronDown />}
        </Button>
      ),
    },
  ];
}
