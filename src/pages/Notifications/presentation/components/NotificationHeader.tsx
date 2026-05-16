"use client";

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

export default function NotificationsHeader({
  unreadCount,
  readCount,
  totalCount,
  setFilter,
  markSelectedAsRead,
   markAllRead,
  isPending,
  limit,
  setLimit,
  selectedCount,
  selectedCategory,
  setSelectedCategory,
  toggleSelectAll,
  currentPageUnreadCount, // ✅ IMPORTANT ADD
}: any) {
  const { t, translations } = useLanguage();
  const notificationsTranslations = translations.notifications;

  const hasSelection = selectedCount > 0;

  // =========================
  // FIX: PAGE BASED COUNT (NOT GLOBAL)
  // =========================
  const selectableCount = currentPageUnreadCount;

  const isAllSelected =
    selectableCount > 0 &&
    selectedCount === selectableCount;

  const isDisabledBulk = isPending || selectedCount === 0;

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
            disabled={selectableCount === 0}
          />

          <div className="text-sm font-medium">
            {isAllSelected
              ? t("notifications.unselectAll")
              : t("notifications.selectAll")}
          </div>

          <h2 className="text-lg font-semibold flex items-center gap-2 ml-4">
            <Bell /> {notificationsTranslations.title}
          </h2>
        </div>

        {/* BULK ACTION */}
        {hasSelection && (
            <div className="ml-auto flex items-center gap-2">
              <Button
                onClick={markSelectedAsRead}
                disabled={isDisabledBulk}
                className="bg-blue-600 text-white"
              >
                <Check className="w-4 h-4 mr-1" />
                {translations.notifications.markSelected} ({selectedCount})
              </Button>

              <Button
                onClick={markAllRead}
                disabled={isPending}
                className="bg-gray-600 text-white"
              >
                {translations.notifications.markAllRead}
              </Button>
            </div>
          )}
      </div>

      {/* SECOND ROW */}
      <div className="flex justify-between items-center flex-wrap gap-3">

        {/* FILTERS */}
        <div className="flex gap-2 flex-wrap">

          <Button
            onClick={() => setFilter("all")}
            className="bg-gray-100 text-black hover:text-white"
          >
            {translations.notifications.categories.all} ({totalCount})
          </Button>

          <Button
            onClick={() => setFilter("unread")}
            className="bg-gray-100 text-black hover:text-white"
          >
            {translations.notifications.unread} ({unreadCount})
          </Button>

          <Button
            onClick={() => setFilter("read")}
            className="bg-gray-100 text-black hover:text-white"
          >
            {translations.notifications.read} ({readCount})
          </Button>

        </div>

        {/* DROPDOWNS */}
        <div className="flex gap-2 items-center">

          {/* CATEGORY */}
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("notifications.categories.all")}
              </SelectItem>
              <SelectItem value="booking">
                {t("notifications.categories.bookings")}
              </SelectItem>
              <SelectItem value="payment">
                {t("notifications.categories.payments")}
              </SelectItem>
              <SelectItem value="system">
                {t("notifications.categories.system")}
              </SelectItem>
              <SelectItem value="alert">
                {t("notifications.categories.alerts")}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* LIMIT */}
          <Select
            value={String(limit)}
            onValueChange={(v) => setLimit(Number(v))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="25">25</SelectItem>
            </SelectContent>
          </Select>

        </div>
      </div>
    </div>
  );
}