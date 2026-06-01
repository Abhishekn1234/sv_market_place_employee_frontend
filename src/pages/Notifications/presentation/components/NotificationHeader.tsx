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

import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/context/LanguageContext";

import { Bell, Check } from "lucide-react";
import { toast } from "react-toastify";

interface NotificationsHeaderProps {
  unreadCount: number;
  readCount: number;
  totalCount: number;

  filter: "all" | "unread" | "read";
  setFilter: (filter: "all" | "unread" | "read") => void;

  markSelectedAsRead: () => void | Promise<void>;

  // SINGLE SOURCE OF TRUTH
  selectedNotificationIds: string[];

  markAllRead: () => void | Promise<void>;

  isPending: boolean;

  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  toggleSelectAll: () => void;

  currentPageUnreadCount: number;
}

export default function NotificationsHeader({
  unreadCount,
  readCount,
  totalCount,

  setFilter,

  markSelectedAsRead,

  selectedNotificationIds = [],

  markAllRead,

  isPending,

  selectedCategory,
  setSelectedCategory,

  toggleSelectAll,

  currentPageUnreadCount,
}: NotificationsHeaderProps) {
  const { t, translations } = useLanguage();

  const notificationsTranslations = translations.notifications;

  const [bulkHandled, setBulkHandled] = useState(false);

  // =========================
  // SINGLE SOURCE OF TRUTH
  // =========================
  const selectedCount = selectedNotificationIds.length;

  const hasSelection = selectedCount > 0;

  // =========================
  // RESET BULK STATE
  // =========================
  useEffect(() => {
    if (selectedCount === 0 && bulkHandled) {
      setBulkHandled(false);
    }
  }, [selectedCount, bulkHandled]);

  // =========================
  // DISABLED STATE
  // =========================
  const isDisabled =
    isPending ||
    selectedCount === 0 ||
    bulkHandled;

  // =========================
  // MARK SELECTED
  // =========================
  const handleMarkSelected = async () => {
    if (isDisabled) return;

    setBulkHandled(true);

    try {
      await Promise.resolve(markSelectedAsRead());

      toast.success(
        t("notifications.markSelectedSuccess")
      );
    } catch (error) {
      console.error(error);

      toast.error(
        t("notifications.markSelectedFailed")
      );
    } finally {
      setBulkHandled(false);
    }
  };

  // =========================
  // SELECT ALL STATE
  // =========================
  const isAllSelected =
    currentPageUnreadCount > 0 &&
    selectedCount === currentPageUnreadCount;

  // =========================
  // MARK ALL
  // =========================
  const handleMarkAll = async () => {
    if (isDisabled) return;

    setBulkHandled(true);

    try {
      await Promise.resolve(markAllRead());

      toast.success(
        t("notifications.markAllSuccess")
      );
    } catch (error) {
      console.error(error);

      toast.error(
        t("notifications.markAllFailed")
      );
    } finally {
      setBulkHandled(false);
    }
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
            <Bell className="w-5 h-5" />
            {notificationsTranslations.title}
          </h2>

        </div>

        {/* BULK ACTIONS */}
        {hasSelection && (
          <div className="ml-auto flex items-center gap-2">

            {/* MARK SELECTED */}
            <Button
              onClick={handleMarkSelected}
              disabled={isDisabled}
              className="bg-blue-600 text-white"
            >
              <Check className="w-4 h-4 mr-1" />

              {notificationsTranslations.markSelected} (
              {selectedCount})
            </Button>

            {/* MARK ALL */}
            {isAllSelected && (
              <Button
                onClick={handleMarkAll}
                disabled={isDisabled}
                className="bg-gray-600 text-white"
              >
                {notificationsTranslations.markAllRead}
              </Button>
            )}

          </div>
        )}

      </div>

      {/* SECOND ROW */}
      <div className="flex justify-between items-center flex-wrap gap-3">

        {/* FILTERS */}
        <div className="flex gap-2 flex-wrap">

          <Button
            onClick={() => setFilter("all")}
            variant="outline"
          >
            {notificationsTranslations.categories.all} (
            {totalCount})
          </Button>

          <Button
            onClick={() => setFilter("unread")}
            variant="outline"
          >
            {notificationsTranslations.unread} (
            {unreadCount})
          </Button>

          <Button
            onClick={() => setFilter("read")}
            variant="outline"
          >
            {notificationsTranslations.read} (
            {readCount})
          </Button>

        </div>

        {/* CATEGORY */}
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={notificationsTranslations.categoryPlaceholder} />
          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">
              {notificationsTranslations.categories.all}
            </SelectItem>

            <SelectItem value="booking">
              {notificationsTranslations.categories.booking}
            </SelectItem>

            <SelectItem value="payment">
              {notificationsTranslations.categories.payment}
            </SelectItem>

            <SelectItem value="system">
              {notificationsTranslations.categories.system}
            </SelectItem>

            <SelectItem value="alert">
              {notificationsTranslations.categories.alert}
            </SelectItem>

          </SelectContent>
        </Select>

      </div>
    </div>
  );
}