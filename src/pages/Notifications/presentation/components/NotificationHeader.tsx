"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";

import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/context/LanguageContext";
import { Bell, Check } from "lucide-react";
import { toast } from "react-toastify";

export default function NotificationsHeader({
  unreadCount,
  readCount,
  totalCount,
  setFilter,
  markSelectedAsRead,
  selectedNotificationIds = [], // ✅ Default to empty array to prevent length error
  markAllRead,
  isPending,
  selectedCount,
  selectedCategory,
  setSelectedCategory,
  toggleSelectAll,
  currentPageUnreadCount,

}: any) {
  const { t, translations } = useLanguage();
  const notificationsTranslations = translations.notifications;

  const [bulkHandled, setBulkHandled] = useState(false);

  useEffect(() => {
    if (selectedCount === 0 && bulkHandled) {
      setBulkHandled(false);
    }
  }, [selectedCount]);

  const hasSelection = selectedCount > 0 && !bulkHandled;
  const queryClient = useQueryClient();

  // =========================
  // ACTIONS
  // =========================
  const handleMarkSelected = async () => {
    // The button's disabled state is controlled by `isDisabled`, which correctly checks `selectedCount === 0`.
    // If `isDisabled` is false, it means `selectedCount > 0`.
    // If `selectedNotificationIds` is empty here, it indicates a discrepancy
    // between `selectedCount` and the actual `selectedNotificationIds` array,
    // which should be addressed in the parent component.
    if (isDisabled) return;
    if (selectedNotificationIds.length === 0) {
      console.warn("Attempted to mark selected, but selectedNotificationIds is empty despite selectedCount > 0. This indicates a state management issue in the parent component.");
      toast.error(t("notifications.noNotificationsSelected"));
      return;
    }

    setBulkHandled(true);

    // 1. Optimistically update the cache
    // We assume the query key for fetching notifications is "notifications"
    const previousNotifications = queryClient.getQueryData(["notifications"]);

    queryClient.setQueryData(["notifications"], (old: any) => {
      if (!old || !old.notifications) return old;
      return {
        ...old,
        notifications: old.notifications.map((notif: any) =>
          selectedNotificationIds?.includes(notif._id) ? { ...notif, isRead: true } : notif
        ),
      };
    });

    try {
      // 2. Call the actual API to mark selected notifications as read
      // The `markSelectedAsRead` prop is expected to be a function that handles the API call
      // and returns a Promise. It might implicitly know which notifications to mark,
      // or it might accept `selectedNotificationIds` as an argument.
      // For this implementation, we assume it handles the selected IDs internally.
      await Promise.resolve(markSelectedAsRead());
      toast.success(t("notifications.markSelectedSuccess"));
    } catch (error) {
      // 3. Revert to previous state on error
      queryClient.setQueryData(["notifications"], previousNotifications);
      toast.error(t("notifications.markSelectedFailed"));
    } finally {
      setBulkHandled(false);
    }
  };

  const isAllSelected =
    currentPageUnreadCount > 0 &&
    selectedCount === currentPageUnreadCount;

  const isDisabled = isPending || selectedCount === 0 || bulkHandled;

  const handleMarkAll = async () => {
    if (isDisabled) return;

    setBulkHandled(true);
    await Promise.resolve(markAllRead());
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">

      {/* TOP ROW */}
      <div className="flex justify-between items-center">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* SELECT ALL */}
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={toggleSelectAll}
            disabled={currentPageUnreadCount === 0}
          />

          <div className="text-sm font-medium">
            {isAllSelected
              ? t("notifications.unselectAll")
              : t("notifications.selectAll")}
          </div>

          <h2 className="text-lg font-semibold flex items-center gap-2 ml-4">
            <Bell />
            {notificationsTranslations.title}
          </h2>
        </div>

        {/* BULK ACTIONS */}
        {hasSelection && (
          <div className="ml-auto flex items-center gap-2">

            {/* MARK SELECTED (always when any selection) */}
            <Button
              onClick={handleMarkSelected}
              disabled={isDisabled}
              className="bg-blue-600 text-white"
            >
              <Check className="w-4 h-4 mr-1" />
              {translations.notifications.markSelected} ({selectedCount})
            </Button>

            {/* MARK ALL ONLY WHEN SELECT ALL ACTIVE */}
            {isAllSelected && (
              <Button
                onClick={handleMarkAll}
                disabled={isDisabled}
                className="bg-gray-600 text-white"
              >
                {translations.notifications.markAllRead}
              </Button>
            )}

          </div>
        )}
      </div>

      {/* SECOND ROW */}
      <div className="flex justify-between items-center flex-wrap gap-3">

        {/* FILTERS */}
        <div className="flex gap-2 flex-wrap">

          <Button onClick={() => setFilter("all")} variant="outline">
            {translations.notifications.categories.all} ({totalCount})
          </Button>

          <Button onClick={() => setFilter("unread")} variant="outline">
            {translations.notifications.unread} ({unreadCount})
          </Button>

          <Button onClick={() => setFilter("read")} variant="outline">
            {translations.notifications.read} ({readCount})
          </Button>

        </div>

        {/* CATEGORY (your Select kept) */}
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="booking">Bookings</SelectItem>
            <SelectItem value="payment">Payments</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="alert">Alerts</SelectItem>
          </SelectContent>
        </Select>

      </div>
    </div>
  );
}