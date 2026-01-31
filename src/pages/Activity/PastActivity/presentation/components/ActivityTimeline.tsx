import { Badge } from "@/components/ui/badge";
import type { JSX } from "react";
import { Calendar, User, MapPin } from "lucide-react";
import type { Activity } from "../../domain/entities/activity";
import { useLanguage } from "@/context/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import { useTheme } from "@/context/ThemeContext";

type ActivityTimelineProps = {
  groupedActivities: Record<string, Activity[]>;
  getActivityIcon: (type: Activity["type"]) => JSX.Element;
  getStatusIcon: (status: Activity["status"]) => JSX.Element;
  getStatusBadge: (status: Activity["status"]) => JSX.Element;
};

export function ActivityTimeline({
  groupedActivities,
  getActivityIcon,
  getStatusIcon,
  getStatusBadge,
}: ActivityTimelineProps) {
  const { language, translations } = useLanguage();
  const isRTL = language === "AR";
  const { theme } = useTheme();
  const pa = translations.pastActivities;

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-4 sm:space-y-6">
      {Object.entries(groupedActivities).map(([date, activities]) => (
        <CommonCard key={date} className="p-4 sm:p-6">
          {/* Date Header */}
          <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b">
            <Calendar className="size-4 shrink-0 text-gray-500" />

            <h3
              className={`
                text-sm sm:text-base font-medium
                ${theme === "dark" ? "text-gray-100" : "text-gray-900"}
              `}
            >
              {date}
            </h3>

            <Badge variant="secondary" className="whitespace-nowrap">
              {activities.length} {pa.timelineMeta.activityCount}
            </Badge>
          </div>

          {/* Activities */}
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`
                  rounded-lg p-3 sm:p-4
                  transition-shadow hover:shadow-md
                  ${theme === "dark" ? "text-gray-100" : "text-gray-800"}
                `}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Icon */}
                  <div
                    className={`
                      shrink-0 flex items-center justify-center
                      size-9 sm:size-10 rounded-full
                      ${activity.type === "booking" && "bg-blue-100 text-blue-600"}
                      ${activity.type === "transaction" && "bg-purple-100 text-purple-600"}
                      ${activity.type === "payment" && "bg-green-100 text-green-600"}
                    `}
                  >
                    {getActivityIcon(activity.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 mb-2">
                      {/* Title + Time */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="text-sm sm:text-base font-medium truncate">
                            {activity.title}
                          </h4>

                          {getStatusIcon(activity.status)}

                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {activity.timestamp.toLocaleTimeString(
                              isRTL ? "ar" : "en-US",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 line-clamp-2">
                          {activity.description}
                        </p>
                      </div>

                      {/* Status + Amount */}
                      <div
                        className={`
                          flex flex-row lg:flex-col gap-2 shrink-0
                          ${isRTL ? "lg:items-start" : "lg:items-end"}
                        `}
                      >
                        {getStatusBadge(activity.status)}

                        {activity.amount && activity.amount > 0 && (
                          <span className="text-sm font-medium text-green-600 whitespace-nowrap">
                            ${activity.amount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta */}
                    {(activity.client || activity.location) && (
                      <div className="flex flex-wrap gap-3 mt-2 text-xs sm:text-sm text-gray-500">
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
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CommonCard>
      ))}
    </div>
  );
}
