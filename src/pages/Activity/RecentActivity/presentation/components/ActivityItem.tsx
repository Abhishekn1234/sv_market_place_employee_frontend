import { Badge } from "@/components/ui/badge";
import { CommonCard } from "@/components/common/CommonCard";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Receipt,
} from "lucide-react";

import type { Activity } from "../../domain/entities/activity";
import { useTheme } from "@/context/ThemeContext";
import { formatDate } from "../helpers/formatdate";
import type { StatusConfig } from "../../domain/entities/activitystatus.type";


const ICONS = {
  booking: Calendar,
  transaction: TrendingUp,
  payment: DollarSign,
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  completed: {
    color: "text-green-600 bg-green-50",
    icon: CheckCircle2,
  },

  confirmed: {
    color: "text-blue-600 bg-blue-50",
    icon: CheckCircle2,
  },

  pending: {
    color: "text-amber-600 bg-amber-50",
    icon: Clock,
  },

  requested: {
    color: "text-yellow-600 bg-yellow-50",
    icon: Clock,
  },

  IN_PROGRESS: {
    color: "text-indigo-600 bg-indigo-50",
    icon: TrendingUp,
  },

  worker_accepted: {
    color: "text-cyan-600 bg-cyan-50",
    icon: CheckCircle2,
  },

  invoice_generated: {
    color: "text-purple-600 bg-purple-50",
    icon: Receipt,
  },

  cancelled: {
    color: "text-red-600 bg-red-50",
    icon: AlertCircle,
  },

  customer_cancelled: {
    color: "text-red-600 bg-red-50",
    icon: AlertCircle,
  },

  worker_cancelled: {
    color: "text-red-600 bg-red-50",
    icon: AlertCircle,
  },
};



export function ActivityItem({ activity }: { activity: Activity }) {
  const { theme } = useTheme();

  const TypeIcon = ICONS[activity.type] ?? Calendar;

  const statusConfig =
    STATUS_CONFIG[activity.status] ??
    { color: "text-gray-600 bg-gray-100", icon: Clock };

  const StatusIcon = statusConfig.icon;

  return (
    <CommonCard className="p-4 transition hover:shadow-md">
      <div className="flex gap-4 items-start">

        {/* Activity Icon */}
        <div className="size-10 shrink-0 flex items-center justify-center rounded-full bg-gray-100">
          <TypeIcon className="size-5 text-gray-700" />
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-2">

          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
            <div className="space-y-1">

              <div className="flex items-center gap-2">

                <h3
                  className={`font-medium ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {activity.title}
                </h3>

                <StatusIcon className={`size-4 ${statusConfig.color}`} />
              </div>

              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {activity.description}
              </p>

            </div>

            {/* Status + Amount */}
            <div className="flex flex-row sm:flex-col sm:text-right gap-2">

              <Badge className={`capitalize ${statusConfig.color}`}>
                {activity.status.replace(/_/g, " ")}
              </Badge>

              {activity.amount && activity.amount > 0 && (
                <p className="font-medium text-green-600">
                  {activity.currency} {activity.amount}
                </p>
              )}

            </div>
          </div>

      
          <div
            className={`flex flex-wrap gap-x-4 gap-y-2 text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {formatDate(activity.timestamp)}
            </span>

            {activity.client && (
              <span className="flex items-center gap-1">
                <User className="size-3.5" />
                {activity.client}
              </span>
            )}

            {activity.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {activity.location}
              </span>
            )}
          </div>

        </div>
      </div>
    </CommonCard>
  );
}