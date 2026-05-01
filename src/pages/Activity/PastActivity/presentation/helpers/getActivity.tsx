import type { ActivityStatus } from "../../domain/entities/activitystatus";
import type { ActivityType } from "../../domain/entities/activitytype";
import type { TimePeriod } from "../../domain/entities/timeperiod";

import {
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/pages/Booking/AvailableBooking/domain/entities/bookingstatus";

/* ---------------- ACTIVITY ICON ---------------- */

export const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "booking":
      return <Calendar className="size-5" />;

    case "transaction":
      return <TrendingUp className="size-5" />;

    case "payment":
      return <DollarSign className="size-5" />;

    default:
      return <Calendar className="size-5" />;
  }
};



const STATUS_VARIANTS: Record<
  BookingStatus,
  { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
> = {
  completed: { variant: "default", label: "Completed" },
  WORK_COMPLETED:{variant: "default", label: "Completed"},
  IN_PROGRESS:{ variant: "outline", label: "In Progress"},
  confirmed: { variant: "secondary", label: "Confirmed" },

  pending: { variant: "outline", label: "Pending" },

  requested: { variant: "outline", label: "Requested" },

  ongoing: { variant: "secondary", label: "Ongoing" },

  WORK_COMPLETED_PENDING: {
    variant: "secondary",
    label: "Work Completed (Pending Approval)",
  },

  workCompletedPending: {
    variant: "secondary",
    label: "Work Completed (Pending Approval)",
  },

  INVOICE_GENERATED: {
    variant: "secondary",
    label: "Invoice Generated",
  },

  WORKER_ACCEPTED: {
    variant: "secondary",
    label: "Worker Accepted",
  },

  WORKER_CANCELLED: {
    variant: "destructive",
    label: "Worker Cancelled",
  },

  CUSTOMER_CANCELLED: {
    variant: "destructive",
    label: "Customer Cancelled",
  },

  cancelled: { variant: "destructive", label: "Cancelled" },

 
};
export const getStatusBadge = (status: BookingStatus) => {
  const config = STATUS_VARIANTS[status] ?? STATUS_VARIANTS.pending;

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

/* ---------------- STATUS ICON ---------------- */

export const getStatusIcon = (status: ActivityStatus) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="size-4 text-green-600" />;

    case "confirmed":
      return <CheckCircle2 className="size-4 text-blue-600" />;

    case "pending":
      return <Clock className="size-4 text-amber-600" />;

    case "cancelled":
      return <AlertCircle className="size-4 text-red-600" />;

    default:
      return <Clock className="size-4 text-gray-500" />;
  }
};

/* ---------------- PERIOD LABEL ---------------- */

export const getPeriodLabel = (period: TimePeriod): string => {
  const labels: Record<TimePeriod, string> = {
    "7days": "Last 7 Days",
    "15days": "Last 15 Days",
    "1month": "Last Month",
    "3months": "Last 3 Months",
    "6months": "Last 6 Months",
    all: "All Time",
  };

  return labels[period];
};
