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

    const bookingStatus = String(
      booking?.status ||
        (notification as any).status ||
        (notification as any).bookingStatus ||
        ""
    ).toUpperCase();
    
    const isRequested = bookingStatus === "REQUESTED";

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
      if (type === "BOOKING_REQUEST" || isRequested) {
        navigate("/availableBooking");
        return;
      }

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

  const formattedDate = new Date(notification.createdAt).toLocaleString(
    undefined,
    {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div
      onClick={!isDisabled ? handleNavigate : undefined}
      className={`group flex flex-col gap-4 rounded-3xl border bg-white p-4 shadow-sm transition-all duration-200 sm:flex-row sm:items-center sm:justify-between sm:p-5
        ${
          isSelected
            ? "border-blue-500 ring-2 ring-blue-500/20"
            : theme === "dark"
            ? "border-slate-800 bg-slate-950 shadow-slate-900/20"
            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
        }
        ${isDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
      `}
    >
      <div className="flex flex-1 items-start gap-4 min-w-0">
        <div
          onClick={handleSelect}
          className={isDisabled ? "cursor-not-allowed" : "cursor-pointer"}
        >
          <Checkbox checked={isSelected} disabled={isDisabled} />
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-3xl border text-white ${getTypeColor(
            notification.type,
            theme
          )}`}
        >
          {getTypeIcon(notification.type)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3
                className={`font-semibold tracking-tight ${
                  theme === "dark"
                    ? "text-slate-100"
                    : "text-slate-900"
                }`}
              >
                {title}
              </h3>
              <p
                className={`mt-1 text-sm leading-6 ${
                  theme === "dark"
                    ? "text-slate-400"
                    : "text-slate-600"
                }`}
              >
                {message}
              </p>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 sm:mt-0">
              <span>{formattedDate}</span>
              <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                isRead
                  ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
              }`}>
                {isRead ? "Read" : "Unread"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}