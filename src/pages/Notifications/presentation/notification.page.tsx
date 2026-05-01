"use client";

import { useState } from "react";
import { Bell, Mail, Filter } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import NotificationsHeader from "./components/NotificationHeader";
import NotificationItem from "./components/NotificationItem";
import { useTheme } from "@/context/ThemeContext";

import { useNotifications } from "./hooks/useNotification";
import { useMarkAsRead } from "./hooks/useMarkasRead";
import { useMarkAllRead } from "./hooks/useMarkAllRead";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { translations } = useLanguage();
  const notificationsTranslations = translations.notifications;
  const { theme } = useTheme();

  const { data: notifications = [], isLoading } = useNotifications({
    unreadOnly: filter === "unread" ? true : undefined,
  });

  const { mutate: markAsReadApi } = useMarkAsRead();
  const { mutate: markAllReadApi } = useMarkAllRead();

  const mapTypeToCategory = (type: string) => {
    switch (type) {
      case "BOOKING_REQUEST":
      case "BOOKING_UPDATE":
        return "booking";
      case "ADMIN_MESSAGE":
        return "system";
      default:
        return "system";
    }
  };

  const markAsRead = (id: string) => {
    markAsReadApi(id);
  };

  const markAllAsRead = () => {
    markAllReadApi();
  };

  const deleteNotification = () => {
    console.warn("Delete not implemented");
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((notification) => {
    const category = mapTypeToCategory(notification.type);

    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;

    if (selectedCategory !== "all") {
      return category === selectedCategory;
    }

    return true;
  });

  const pageBg = theme === "dark" ? "text-gray-100" : "";
  const cardBg =
    theme === "dark" ? "bg-gray-900 text-gray-100 border-gray-700" : "";

  return (
    <div className={`min-h-screen p-4 ${pageBg}`}>
      <div className="max-w-4xl mx-auto space-y-6">

        <NotificationsHeader
          unreadCount={unreadCount}
          filter={filter}
          setFilter={setFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          markAllAsRead={markAllAsRead}
          clearAllNotifications={() => {}}
          notificationsTranslations={notificationsTranslations}
          totalCount={notifications.length}
        />

        {filteredNotifications.length === 0 ? (
          <CommonCard className={`text-center py-16 border-dashed ${cardBg}`}>
            <Bell className="w-16 h-16 mx-auto mb-4 opacity-70" />
            <h3>{notificationsTranslations.noNotifications}</h3>
          </CommonCard>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                markAsRead={markAsRead}
                deleteNotification={deleteNotification}
                notificationsTranslations={notificationsTranslations}
              />
            ))}
          </div>
        )}

        <CommonCard className={`p-4 flex justify-between ${cardBg}`}>
          <div>
            {notificationsTranslations.unread} {unreadCount}
          </div>

          <div className="flex gap-4">
            <button className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              Email
            </button>

            <button className="flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Settings
            </button>
          </div>
        </CommonCard>
      </div>
    </div>
  );
}