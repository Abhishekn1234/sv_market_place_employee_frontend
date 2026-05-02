"use client";

import type { Notification } from "../../domain/entities/notification";
import {
  CheckCircle,
  Info,
  BellRing,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

export default function NotificationItem({
  notification,
  markAsRead,
  notificationsTranslations,
  isSelected,
  onSelect,
}: {
  notification: Notification;
  markAsRead: (id: string) => void;
  notificationsTranslations: any;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}) {
  const { theme } = useTheme();

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "BOOKING_REQUEST":
        return <BellRing className="w-5 h-5" />;
      case "BOOKING_UPDATE":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    if (theme === "dark") {
      switch (type) {
        case "BOOKING_REQUEST":
          return "bg-indigo-900/40 text-indigo-300 border-indigo-800";
        case "BOOKING_UPDATE":
          return "bg-emerald-900/40 text-emerald-400 border-emerald-800";
        default:
          return "bg-blue-900/40 text-blue-400 border-blue-800";
      }
    }

    switch (type) {
      case "BOOKING_REQUEST":
        return "bg-indigo-100 text-indigo-600 border-indigo-200";
      case "BOOKING_UPDATE":
        return "bg-emerald-100 text-emerald-600 border-emerald-200";
      default:
        return "bg-blue-100 text-blue-600 border-blue-200";
    }
  };

  const title =
    notification.title || notificationsTranslations.defaultTitle;

  const message =
    notification.message || notificationsTranslations.defaultMessage;

  const getBorderColor = () => {
    if (isSelected) {
      return theme === "dark"
        ? "border-blue-500 ring-2 ring-blue-500/30"
        : "border-blue-500 ring-2 ring-blue-500/30";
    }
    return notification.isRead
      ? theme === "dark"
        ? "border-gray-700"
        : "border-gray-200"
      : "border-blue-200";
  };

  const getBgColor = () => {
    if (isSelected) {
      return theme === "dark" ? "bg-gray-800" : "bg-blue-50";
    }
    if (theme === "dark") {
      return notification.isRead ? "bg-gray-800" : "bg-gray-900";
    }
    return notification.isRead ? "bg-white" : "bg-blue-50/30";
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(notification._id);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      className={`flex items-center justify-between gap-4 p-4 sm:p-5 transition rounded-lg border-2 cursor-pointer hover:opacity-90 ${getBorderColor()} ${getBgColor()}`}
    >
      {/* LEFT */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`p-3 rounded-xl border shrink-0 ${getTypeColor(notification.type)}`}>
          {getTypeIcon(notification.type)}
        </div>

        <div className="min-w-0">
          <h3 className={`font-semibold truncate ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          }`}>
            {title}
          </h3>

          <p className={`text-sm truncate ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            {message}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-end shrink-0 gap-2">
        
        {/* READ BUTTON (ONLY WHEN SELECTED) */}
        {isSelected && !notification.isRead && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(notification._id);
            }}
            className="rounded-md px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white"
          >
            Read
          </Button>
        )}

        {/* DEFAULT ICON BUTTON */}
        {!notification.isRead && !isSelected && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(notification._id);
            }}
            className="rounded-full w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Check className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}