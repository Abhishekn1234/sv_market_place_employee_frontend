"use client";

import { useEffect, useState } from "react";
import { Bell, Mail, Filter } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import type { Notification } from "../domain/entities/notification";
import NotificationsHeader from "./components/NotificationHeader";
import NotificationItem from "./components/NotificationItem";
import { data } from "./data/mockdata";
import { useTheme } from "@/context/ThemeContext";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { translations } = useLanguage();
  const notificationsTranslations = translations.notifications;
  const { theme } = useTheme();

  useEffect(() => {
    setNotifications(data);
  }, []);

  const markAsRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const deleteNotification = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const clearAllNotifications = () => setNotifications([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    if (selectedCategory !== "all")
      return notification.category === selectedCategory;
    return true;
  });

  const pageBg = theme === "dark" ? "text-gray-100" : "";
  const cardBg =
    theme === "dark" ? "bg-gray-900 text-gray-100 border-gray-700" : "";

  return (
    <div className={`min-h-screen p-3 sm:p-4 md:p-8 ${pageBg}`}>
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <NotificationsHeader
          unreadCount={unreadCount}
          filter={filter}
          setFilter={setFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          markAllAsRead={markAllAsRead}
          clearAllNotifications={clearAllNotifications}
          notificationsTranslations={notificationsTranslations}
          totalCount={notifications.length}
        />

        {/* Empty State */}
        {filteredNotifications.length === 0 ? (
          <CommonCard
            className={`text-center py-12 sm:py-16 border-2 border-dashed ${cardBg}`}
          >
            <Bell className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-70" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              {notificationsTranslations.noNotifications}
            </h3>
            <p className="text-sm sm:text-base opacity-80">
              {notificationsTranslations.caughtUp}
            </p>
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

        {/* Footer Actions */}
        <CommonCard
          className={`p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 ${cardBg}`}
        >
          <div className="text-sm flex items-center gap-1 whitespace-nowrap">
            {notificationsTranslations.unread}{" "}
            {filteredNotifications.length} / {notifications.length}{" "}
            {notificationsTranslations.total}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button className="text-sm flex items-center gap-1 whitespace-nowrap hover:opacity-80">
              <Mail className="w-4 h-4" />
              {notificationsTranslations.emailDigest}
            </button>

            <button className="text-sm flex items-center gap-1 whitespace-nowrap hover:opacity-80">
              <Filter className="w-4 h-4" />
              {notificationsTranslations.notificationSettings}
            </button>
          </div>
        </CommonCard>
      </div>
    </div>
  );
}
