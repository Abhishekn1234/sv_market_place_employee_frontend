import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type  { JSX } from "react";
import { Calendar, User, MapPin } from "lucide-react";
import type { Activity } from "../../domain/entities/activity";
import { useLanguage } from "@/context/LanguageContext";
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
  const { language, t } = useLanguage();
  const isRTL = language === "AR";

  return (
    <div className={`space-y-6 ${isRTL ? "rtl" : "ltr"}`}>
      {Object.entries(groupedActivities).map(([date, activities]) => (
        <Card key={date} className="p-6">
          {/* Date Header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b">
            <Calendar className="size-4 text-gray-600" />
            <h3 className="text-gray-900">{date}</h3>

            <Badge
              variant="secondary"
              className={`${isRTL ? "mr-2" : "ml-2"}`}
            >
              {activities.length}{" "}
              {activities.length === 1
                ? t("activity")
                : `${t("activity")}s`}
            </Badge>
          </div>

          {/* Activities */}
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div
                  className={`flex items-start gap-4 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`
                      flex items-center justify-center size-10 rounded-full shrink-0
                      ${activity.type === "booking" ? "bg-blue-100 text-blue-600" : ""}
                      ${activity.type === "transaction" ? "bg-purple-100 text-purple-600" : ""}
                      ${activity.type === "payment" ? "bg-green-100 text-green-600" : ""}
                    `}
                  >
                    {getActivityIcon(activity.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="text-gray-900">{activity.title}</h4>
                          {getStatusIcon(activity.status)}
                          <span className="text-xs text-gray-500">
                            {activity.timestamp.toLocaleTimeString(
                              isRTL ? "ar" : "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600">
                          {activity.description}
                        </p>
                      </div>

                      {/* Status + Amount */}
                      <div
                        className={`flex flex-col gap-2 shrink-0 ${
                          isRTL ? "items-start" : "items-end"
                        }`}
                      >
                        {getStatusBadge(activity.status)}
                        {activity.amount && activity.amount > 0 && (
                          <span className="text-green-600">
                            ${activity.amount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta info */}
                    {(activity.client || activity.location) && (
                      <div
                        className={`flex gap-4 mt-2 text-sm text-gray-500 flex-wrap ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
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
        </Card>
      ))}
    </div>
  );
}

