import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { TableColumn } from "@/components/common/CommonTable";
import type { Booking } from "../../domain/entities/booking";
import type {
  NormalizedBookingStatus,
  StatusOptions,
  TableHeaders,
} from "../../domain/entities/booking.types";
import { formatTime } from "../../domain/entities/booking.types";

export const getStatusConfig = (statusOptions: StatusOptions) => ({
  completed: {
    label: statusOptions.completed,
    color: "bg-green-100 text-green-700",
  },
  confirmed: {
    label: statusOptions.confirmed,
    color: "bg-blue-100 text-blue-700",
  },
  pending: {
    label: statusOptions.pending,
    color: "bg-yellow-100 text-yellow-700",
  },
  inProgress: {
    label: statusOptions.inProgress,
    color: "bg-purple-100 text-purple-700",
  },
  cancelled: {
    label: statusOptions.cancelled,
    color: "bg-red-100 text-red-700",
  },
} satisfies Record<
  NormalizedBookingStatus,
  { label: string; color: string }
>);

export const getBookingColumns = (
  headers: TableHeaders,
  statusConfig: Record<
    NormalizedBookingStatus,
    { label: string; color: string }
  >,
  expandedBooking: string | null,
  toggleExpanded: (id: string) => void
): TableColumn<Booking>[] => [
  { key: "id", header: headers.id },

  {
    key: "clientName",
    header: headers.client,
    render: (b) => <span dir="ltr">{b.clientName}</span>,
  },

  { key: "serviceType", header: headers.service },

  {
    key: "date",
    header: headers.date,
    render: (b) => <span dir="ltr">{b.date}</span>,
  },

  {
    key: "time",
    header: headers.time,
    render: (b) => <span dir="ltr">{formatTime(b.time)}</span>,
  },

  {
    key: "payment",
    header: headers.payment,
    render: (b) => <span dir="ltr">${b.payment}</span>,
  },

  {
    key: "status",
    header: headers.status,
    render: (b) => (
      <Badge className={statusConfig[b.status].color}>
        {statusConfig[b.status].label}
      </Badge>
    ),
  },

  {
    key: "actions",
    header: headers.actions,
    render: (b) => (
      <Button size="sm" variant="ghost" onClick={() => toggleExpanded(b.id)}>
        {expandedBooking === b.id ? <ChevronUp /> : <ChevronDown />}
      </Button>
    ),
  },
];
