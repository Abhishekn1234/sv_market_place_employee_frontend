import type { ActivityStatus } from "../../domain/entities/activitystatus";
import type { ActivityType } from "../../domain/entities/activitytype";
import { 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,} from "lucide-react";
  import { Badge } from "@/components/ui/badge";
import type { TimePeriod } from "../../domain/entities/timeperiod";
  export const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "booking":
        return <Calendar className="size-5" />;
      case "transaction":
        return <TrendingUp className="size-5" />;
      case "payment":
        return <DollarSign className="size-5" />;
    }
  };

 export  const getStatusBadge = (status: ActivityStatus) => {
    const variants: Record<ActivityStatus, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      completed: { variant: "default", label: "Completed" },
      confirmed: { variant: "secondary", label: "Confirmed" },
      pending: { variant: "outline", label: "Pending" },
      cancelled: { variant: "destructive", label: "Cancelled" }
    };
    
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

 export  const getStatusIcon = (status: ActivityStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="size-4 text-green-600" />;
      case "confirmed":
        return <CheckCircle2 className="size-4 text-blue-600" />;
      case "pending":
        return <Clock className="size-4 text-amber-600" />;
      case "cancelled":
        return <AlertCircle className="size-4 text-red-600" />;
    }
  };


 export const getPeriodLabel = (period: TimePeriod): string => {
    const labels: Record<TimePeriod, string> = {
      "7days": "Last 7 Days",
      "15days": "Last 15 Days",
      "1month": "Last Month",
      "3months": "Last 3 Months",
      "6months": "Last 6 Months"
    };
    return labels[period];
  };