"use client";

import { useState } from "react";
import type { Notification } from "../../domain/entities/notification";

// import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { useTheme } from "@/context/ThemeContext";
// import { useLanguage } from "@/context/LanguageContext";

import { getTypeIcon } from "../utils/gettypeicon";
import { getTypeColor } from "../utils/gettypecolor";

import { useAssign } from "@/pages/Booking/AvaliableWorks/presentation/hooks/useAssign";

type Props = {
  notification: Notification;
  markAsRead: (id: string) => void | Promise<void>;
  notificationsTranslations: any;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onMarkedRead?: (id: string) => void;
};

export default function NotificationItem({
  notification,
  // markAsRead,
  notificationsTranslations,
  isSelected,
  onSelect,
  // onMarkedRead,
}: Props) {
  const { theme } = useTheme();
  // const { translations } = useLanguage();
  const navigate = useNavigate();

  const isRead = notification.isRead;

  // =========================
  // LOCAL HANDLED STATE
  // =========================
  const [handled, ] = useState(false);

  const isDisabled = isRead || handled;

  const ALLOWED_STATUSES = [
    "IN_PROGRESS",
    "WORKER_ACCEPTED",
    "WORK_COMPLETED_PENDING",
  ] as const;

  // =========================
  // ASSIGNED WORKS
  // =========================
  const { assignedWorks } = useAssign();

  // =========================
  // SELECT
  // =========================
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isDisabled) return;

    onSelect?.(notification._id);
  };

  const getAssignedBooking = (id?: string) => {
    if (!id) return null;

    return (
      assignedWorks?.find((a) => a.booking?._id === id)?.booking || null
    );
  };

  // =========================
  // MARK AS READ
  // =========================
  // const handleMarkRead = async () => {
  //   if (isDisabled) return;

  //   try {
  //     setHandled(true);

  //     await Promise.resolve(markAsRead(notification._id));

  //     onMarkedRead?.(notification._id);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // =========================
  // NAVIGATE
  // =========================
  const handleNavigate = () => {
    if (isDisabled) return;

    const type = notification.type;
    const bookingId = notification.bookingId;

    const booking = getAssignedBooking(bookingId);

    const isAllowed = booking?.status
      ? ALLOWED_STATUSES.includes(booking.status as any)
      : false;

    // CHAT
    if (type.startsWith("CHAT")) {
      if (!booking) {
        toast.error("Booking not found or already finished.");
        return;
      }

      navigate(`/chat/${bookingId}`);
      return;
    }

    // BOOKING REQUEST
    if (
      type === "BOOKING_REQUEST" ||
      type.startsWith("BOOKING")
    ) {
      if (!booking) {
        toast.error("Booking not found or already finished.");
        return;
      }

      if (!isAllowed) {
        toast.error("Booking is not in an active state.");
        return;
      }

      navigate("/availableWork");
      return;
    }
  };

  const title =
    notification.title || notificationsTranslations.defaultTitle;

  const message =
    notification.message || notificationsTranslations.defaultMessage;

  return (
    <div
      onClick={!isDisabled ? handleNavigate : undefined}
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
            ? isRead
              ? "bg-gray-900 opacity-50"
              : "bg-gray-900 hover:bg-gray-800"
            : isRead
            ? "bg-gray-100 opacity-60"
            : "bg-white hover:bg-gray-50"
        }

        ${
          isDisabled
            ? "cursor-not-allowed opacity-70"
            : "cursor-pointer"
        }
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3 flex-1 min-w-0">

        {/* CHECKBOX */}
        {!isDisabled && (
          <div onClick={handleSelect}>
            <Checkbox checked={isSelected} />
          </div>
        )}

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

      {/* RIGHT */}
      <div
        className="flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* {!isDisabled && isSelected && (
          <Button
            onClick={handleMarkRead}
            disabled={isDisabled}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {translations.notifications.read}
          </Button>
        )} */}

        {/* {!isDisabled && !isSelected && (
          <Button
            onClick={handleMarkRead}
            disabled={isDisabled}
            className="rounded-full w-9 h-9 p-0 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Check className="w-4 h-4" />
          </Button>
        )} */}
      </div>
    </div>
  );
}