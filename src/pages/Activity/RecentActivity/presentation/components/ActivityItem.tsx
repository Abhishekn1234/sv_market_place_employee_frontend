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
} from "lucide-react";
import type { Activity } from "../../domain/entities/activity";
import { useTheme } from "@/context/ThemeContext";

const ICONS = {
  booking: Calendar,
  transaction: TrendingUp,
  payment: DollarSign,
};

const STATUS_ICONS = {
  completed: CheckCircle2,
  confirmed: CheckCircle2,
  pending: Clock,
  cancelled: AlertCircle,
};

const STATUS_COLORS = {
  completed: "text-green-600",
  confirmed: "text-blue-600",
  pending: "text-amber-600",
  cancelled: "text-red-600",
};

export function ActivityItem({ activity }: { activity: Activity }) {
  const TypeIcon = ICONS[activity.type];
  const StatusIcon = STATUS_ICONS[activity.status];
  const { theme } = useTheme();

  return (
    <CommonCard className="p-4 transition hover:shadow-md">
      <div className="flex gap-4 items-start">
        {/* Icon */}
        <div className="size-10 shrink-0 flex items-center justify-center rounded-full bg-gray-100">
          <TypeIcon className="size-5 text-gray-700" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          {/* Top row */}
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

                <StatusIcon
                  className={`size-4 ${STATUS_COLORS[activity.status]}`}
                />
              </div>

              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {activity.description}
              </p>
            </div>

            {/* Status + amount */}
            <div className="flex flex-row sm:flex-col sm:text-right gap-2">
              <Badge className="w-fit">{activity.status}</Badge>

              {activity.amount && activity.amount > 0 && (
                <p className="text-green-600 font-medium">
                  ${activity.amount}
                </p>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div
            className={`flex flex-wrap gap-x-4 gap-y-2 text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {activity.timestamp.toLocaleString()}
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
