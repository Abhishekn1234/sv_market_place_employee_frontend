"use client";

import type { Notification } from "../../domain/entities/notification";

import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

import { getTypeIcon } from "../utils/gettypeicon";
import { getTypeColor } from "../utils/gettypecolor";

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
  const { translations } = useLanguage();
  // console.log(notification);
  const navigate = useNavigate();

  const isRead = notification.isRead;

  // =========================
  // SELECT NOTIFICATION
  // =========================
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isRead) return;

    onSelect?.(notification._id);
  };

  // =========================
  // NAVIGATE TO CHAT
  // =========================
 const handleNavigate = () => {
  const type = notification.type;

  // CHAT NOTIFICATIONS
  if (type.startsWith("CHAT")) {
    if (!notification.bookingId) return;

    navigate(`/chat/${notification.bookingId}`);
    return;
  }

  // BOOKING REQUEST
  if (type === "BOOKING_REQUEST") {
    navigate("/availableWork");
    return;
  }

  // OTHER BOOKING UPDATES
   if (type.startsWith("BOOKING")) {
    if (!notification.bookingId) return;

   navigate("/availableWork");
  }
};

  const title =
    notification.title || notificationsTranslations.defaultTitle;

  const message =
    notification.message || notificationsTranslations.defaultMessage;

  return (
    <div
      onClick={handleNavigate}
      className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-200
        ${
          isSelected
            ? "border-blue-500 ring-2 ring-blue-500/20"
            : theme === "dark"
            ? "border-gray-800"
            : "border-gray-200"
        }
        ${
          theme === "dark"
            ? "bg-gray-900 hover:bg-gray-800"
            : "bg-white hover:bg-gray-50"
        }
        cursor-pointer
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        
        {/* CHECKBOX */}
        <div onClick={handleSelect}>
          <Checkbox
            checked={isSelected}
            disabled={isRead}
          />
        </div>

        {/* ICON */}
        <div
          className={`p-3 rounded-xl border shrink-0 ${getTypeColor(
            notification.type,
            theme
          )}`}
        >
          {getTypeIcon(notification.type)}
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold truncate ${
              theme === "dark"
                ? "text-gray-100"
                : "text-gray-900"
            }`}
          >
            {title}
          </h3>

          <p
            className={`text-sm truncate ${
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-600"
            }`}
          >
            {message}
          </p>
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div
        className="flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* SELECTED READ BUTTON */}
        {!isRead && isSelected && (
          <Button
            onClick={() => markAsRead(notification._id)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {translations.notifications.read}
          </Button>
        )}

        {/* QUICK READ */}
        {!isRead && !isSelected && (
          <Button
            onClick={() => markAsRead(notification._id)}
            className="rounded-full w-9 h-9 p-0 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Check className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}