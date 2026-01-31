import { CommonCard } from "@/components/common/CommonCard";
import type { Notification } from "../../domain/entities/notification";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Check,
  Trash2,
  ExternalLink,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

export default function NotificationItem({
  notification,
  markAsRead,
  deleteNotification,
  notificationsTranslations,
}: {
  notification: Notification;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  notificationsTranslations: any;
}) {
  const { theme } = useTheme();

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <XCircle className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    if (theme === "dark") {
      switch (type) {
        case "success":
          return "bg-emerald-900/40 text-emerald-400 border-emerald-800";
        case "error":
          return "bg-rose-900/40 text-rose-400 border-rose-800";
        case "warning":
          return "bg-amber-900/40 text-amber-400 border-amber-800";
        default:
          return "bg-blue-900/40 text-blue-400 border-blue-800";
      }
    }

    switch (type) {
      case "success":
        return "bg-emerald-100 text-emerald-600 border-emerald-200";
      case "error":
        return "bg-rose-100 text-rose-600 border-rose-200";
      case "warning":
        return "bg-amber-100 text-amber-600 border-amber-200";
      default:
        return "bg-blue-100 text-blue-600 border-blue-200";
    }
  };

  const getCategoryColor = (category: Notification["category"]) => {
    if (theme === "dark") {
      switch (category) {
        case "booking":
          return "bg-indigo-900/40 text-indigo-300";
        case "payment":
          return "bg-emerald-900/40 text-emerald-300";
        case "system":
          return "bg-gray-800 text-gray-300";
        case "alert":
          return "bg-rose-900/40 text-rose-300";
        default:
          return "bg-gray-800 text-gray-300";
      }
    }

    switch (category) {
      case "booking":
        return "bg-indigo-100 text-indigo-700";
      case "payment":
        return "bg-emerald-100 text-emerald-700";
      case "system":
        return "bg-gray-100 text-gray-700";
      case "alert":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <CommonCard
      className={`group transition ${
        theme === "dark"
          ? notification.read
            ? "bg-gray-800 border-gray-700"
            : "bg-gradient-to-r from-blue-900/30 to-gray-800 border-blue-800"
          : notification.read
          ? "border-gray-200"
          : "border-blue-200 bg-gradient-to-r from-blue-50 to-white"
      }`}
    >
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4">
        {/* Icon */}
        <div
          className={`p-3 rounded-xl border shrink-0 ${getTypeColor(
            notification.type
          )}`}
        >
          {getTypeIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`font-semibold break-words ${
                  theme === "dark"
                    ? notification.read
                      ? "text-gray-300"
                      : "text-gray-100"
                    : notification.read
                    ? "text-gray-700"
                    : "text-gray-900"
                }`}
              >
                {notification.title}
              </h3>

              {notification.priority === "high" && !notification.read && (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    theme === "dark"
                      ? "bg-rose-900/40 text-rose-300"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {notificationsTranslations.highPriority}
                </span>
              )}
            </div>

            <span className="text-xs sm:text-sm text-gray-500">
              {notification.date}
            </span>
          </div>

          <p
            className={`mb-3 text-sm break-words ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {notification.description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {notification.category && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                  notification.category
                )}`}
              >
                {notification.category}
              </span>
            )}

            <button className="text-sm text-blue-600 hover:text-blue-400 font-medium flex items-center gap-1">
              <ExternalLink className="w-4 h-4" />
              {notificationsTranslations.viewDetails}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col items-center gap-2 ml-auto">
          <div className="flex sm:flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            {!notification.read && (
              <Button
                onClick={() => markAsRead(notification.id)}
                className="p-2 rounded-lg"
              >
                <Check className="w-4 h-4" />
              </Button>
            )}

            <Button
              onClick={() => deleteNotification(notification.id)}
              className="p-2 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <Button className="p-2 rounded-lg">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          {!notification.read && (
            <div
              className={`hidden sm:block w-2 h-2 rounded-full ${
                theme === "dark" ? "bg-blue-400" : "bg-blue-600"
              }`}
            />
          )}
        </div>
      </div>
    </CommonCard>
  );
}
