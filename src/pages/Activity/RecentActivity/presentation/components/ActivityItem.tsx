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

  return (
    <CommonCard className="p-4 hover:shadow-md transition">
      <div className="flex gap-4">
        {/* Left icon */}
        <div className="size-10 flex items-center justify-center rounded-full bg-gray-100">
          <TypeIcon className="size-5 text-gray-700" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-gray-900">{activity.title}</h3>
                <StatusIcon
                  className={`size-4 ${STATUS_COLORS[activity.status]}`}
                />
              </div>

              <p className="text-sm text-gray-600">
                {activity.description}
              </p>
            </div>

            <div className="text-right">
              <Badge>{activity.status}</Badge>

              {activity.amount && activity.amount > 0 && (
                <p className="text-green-600 font-medium">
                  ${activity.amount}
                </p>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
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

