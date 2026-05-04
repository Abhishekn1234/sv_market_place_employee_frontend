"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { Bell, Check } from "lucide-react";

export default function NotificationsHeader({
  unreadCount,
  readCount,
  totalCount,
  setFilter,
  // markSelectedAsRead,
  markAllRead,        // ✅ ADD THIS
  isPending,          // ✅ ADD THIS
  notificationsTranslations,
  limit,
  setLimit,
   selectedCount,
  selectedCategory,
  setSelectedCategory,
}: any) {
  const {t,translations}=useLanguage();
  return (
    <div className="p-4 border rounded-lg space-y-4">

      {/* TOP ROW */}
      <div className="flex justify-between items-center">

        {/* LEFT - TITLE */}
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell /> {notificationsTranslations.title}
        </h2>

        {/* RIGHT - BULK ACTION */}
           <Button
          onClick={markAllRead}
          disabled={isPending || unreadCount === 0 ||selectedCount === 0}
          className="bg-blue-600 text-white"
        >
          <Check className="w-4 h-4 mr-1" />
          {translations.notifications.markAllRead} ({selectedCount})
        </Button>
      </div>

      {/* SECOND ROW */}
      <div className="flex justify-between items-center flex-wrap gap-3">

        {/* LEFT - FILTER BUTTONS */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setFilter("all")} className="bg-gray-100 text-black hover:text-white">
            {translations.notifications.categories.all}({totalCount})
          </Button>

          <Button onClick={() => setFilter("unread")} className="bg-gray-100 text-black hover:text-white">
            {translations.notifications.unread} ({unreadCount})
          </Button>

          <Button onClick={() => setFilter("read")} className="bg-gray-100 text-black hover:text-white">
           {translations.notifications.read} ({readCount})
          </Button>
        </div>

        {/* RIGHT - DROPDOWNS */}
        <div className="flex gap-2 items-center">

          {/* CATEGORY DROPDOWN */}
          <Select
            value={selectedCategory}
            onValueChange={(v) => setSelectedCategory(v)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('notifications.categories.all')}</SelectItem>
              <SelectItem value="booking">{t('notifications.categories.bookings')}</SelectItem>
              <SelectItem value="payment">{t('notifications.categories.payments')}</SelectItem>
              <SelectItem value="system">{t('notifications.categories.system')}</SelectItem>
              <SelectItem value="alert">{t('notifications.categories.alerts')}</SelectItem>
            </SelectContent>
          </Select>

          {/* LIMIT DROPDOWN */}
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