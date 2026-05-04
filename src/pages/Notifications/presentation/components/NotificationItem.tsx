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
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/context/LanguageContext";

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

  const isDisabled = notification.isRead;
 const {translations}=useLanguage();
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

  return (
    <div
      onClick={() => {
        if (!isDisabled) onSelect?.(notification._id);
      }}
      className={`flex items-center justify-between gap-4 p-4 rounded-lg border-2 transition
        ${isSelected ? "border-blue-500 ring-2 ring-blue-500/30" : ""}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3 flex-1">

        <Checkbox
          checked={isSelected}
          disabled={isDisabled}
          onCheckedChange={() => {
            if (!isDisabled) onSelect?.(notification._id);
          }}
          onClick={(e) => e.stopPropagation()}
        />

        <div className={`p-3 rounded-xl border ${getTypeColor(notification.type)}`}>
          {getTypeIcon(notification.type)}
        </div>

        <div>
          <h3 className={`${theme === "dark" ? "text-gray-100" : "text-gray-900"} font-semibold`}>
            {title}
          </h3>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-sm`}>
            {message}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex gap-2">
        {!notification.isRead && isSelected && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(notification._id);
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {translations.notifications.read}
          </Button>
        )}

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