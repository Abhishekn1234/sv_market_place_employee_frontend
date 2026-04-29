"use client";

import { CommonCard } from "@/components/common/CommonCard";
import type { Notification } from "../../domain/entities/notification";
import {
  CheckCircle,
  Info,
  Check,
  Trash2,
  ExternalLink,
  MoreVertical,
  BellRing,
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

  // 🔥 Map backend type → UI icon
  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "BOOKING_REQUEST":
        return <BellRing className="w-5 h-5" />;
      case "BOOKING_UPDATE":
        return <CheckCircle className="w-5 h-5" />;
      case "ADMIN_MESSAGE":
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  // 🎨 Color mapping
  const getTypeColor = (type: Notification["type"]) => {
    if (theme === "dark") {
      switch (type) {
        case "BOOKING_REQUEST":
          return "bg-indigo-900/40 text-indigo-300 border-indigo-800";
        case "BOOKING_UPDATE":
          return "bg-emerald-900/40 text-emerald-400 border-emerald-800";
        case "ADMIN_MESSAGE":
        default:
          return "bg-blue-900/40 text-blue-400 border-blue-800";
      }
    }

    switch (type) {
      case "BOOKING_REQUEST":
        return "bg-indigo-100 text-indigo-600 border-indigo-200";
      case "BOOKING_UPDATE":
        return "bg-emerald-100 text-emerald-600 border-emerald-200";
      case "ADMIN_MESSAGE":
      default:
        return "bg-blue-100 text-blue-600 border-blue-200";
    }
  };

  // 🕒 Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <CommonCard
      className={`group transition ${
        theme === "dark"
          ? notification.isRead
            ? "bg-gray-800 border-gray-700"
            : "bg-gradient-to-r from-blue-900/30 to-gray-800 border-blue-800"
          : notification.isRead
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
            <h3
              className={`font-semibold break-words ${
                theme === "dark"
                  ? notification.isRead
                    ? "text-gray-300"
                    : "text-gray-100"
                  : notification.isRead
                  ? "text-gray-700"
                  : "text-gray-900"
              }`}
            >
              {notification.title}
            </h3>

            <span className="text-xs sm:text-sm text-gray-500">
              {formatDate(notification.createdAt)}
            </span>
          </div>

          <p
            className={`mb-3 text-sm break-words ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {notification.message}
          </p>

          <div className="flex items-center gap-3">
            <button className="text-sm text-blue-600 hover:text-blue-400 font-medium flex items-center gap-1">
              <ExternalLink className="w-4 h-4" />
              {notificationsTranslations.viewDetails}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col items-center gap-2 ml-auto">
          <div className="flex sm:flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            
            {!notification.isRead && (
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

          {!notification.isRead && (
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
