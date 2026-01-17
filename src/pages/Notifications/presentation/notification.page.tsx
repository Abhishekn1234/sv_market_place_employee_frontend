"use client";

import { useEffect, useState } from "react";
import { 
  Bell,  Mail, Filter 
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import type { Notification } from "../domain/entities/notification";
import NotificationsHeader from "./components/NotificationHeader";
import NotificationItem from "./components/NotificationItem";
import { data } from "./data/mockdata";
// ---------- Notifications Page ----------
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { translations } = useLanguage();
  const notificationsTranslations = translations.Notifications;

  // Fetch notifications
  useEffect(() => {
    const response=data;
    setNotifications(response);
  }, []);

  const markAsRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllAsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const deleteNotification = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const clearAllNotifications = () => setNotifications([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    if (selectedCategory !== "all") return notification.category === selectedCategory;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
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

        {filteredNotifications.length === 0 ? (
          <CommonCard className="text-center py-16 border-2 border-dashed border-gray-300">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{notificationsTranslations.noNotifications}</h3>
            <p className="text-gray-500">{notificationsTranslations.caughtUp}</p>
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

        {/* Footer */}
        <CommonCard className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 text-sm">
            {notificationsTranslations.showing} {filteredNotifications.length} of {notifications.length} {notificationsTranslations.all}
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1">
              <Mail className="w-4 h-4" /> {notificationsTranslations.emailDigest}
            </button>
            <button className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1">
              <Filter className="w-4 h-4" /> {notificationsTranslations.notificationSettings}
            </button>
          </div>
        </CommonCard>
      </div>
    </div>
  );
}
