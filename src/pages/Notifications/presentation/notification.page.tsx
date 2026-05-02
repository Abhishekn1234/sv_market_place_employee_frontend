"use client";

import { useState } from "react";
import { Bell, Loader2 } from "lucide-react";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  const { translations } = useLanguage();
  const notificationsTranslations = translations.notifications;
  const { theme } = useTheme();

  const {
    data = [],
    isLoading,
    isFetching,
  } = useNotifications({
    page,
    limit,
    unreadOnly: filter === "unread" ? true : undefined,
  });

  const { mutate: markAsReadApi } = useMarkAsRead();
  const { mutate: markAllReadApi } = useMarkAllRead();

  const markAsRead = (id: string) => markAsReadApi(id);
  const markAllAsRead = () => markAllReadApi();

  const handleSelectNotification = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  if (isLoading && page === 1) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const unreadCount = data.filter((n) => !n.isRead).length;

  const pageBg = theme === "dark" ? "text-gray-100" : "";

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
          totalCount={data.length}
        />

        {data.length === 0 ? (
          <CommonCard className="text-center py-16 border-dashed">
            <Bell className="w-16 h-16 mx-auto mb-4 opacity-70" />
            <h3>{notificationsTranslations.noNotifications}</h3>
          </CommonCard>
        ) : (
          <>
            <div className="space-y-3">
              {data.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  markAsRead={markAsRead}
                  notificationsTranslations={notificationsTranslations}
                  isSelected={selectedId === notification._id}
                  onSelect={handleSelectNotification}
                />
              ))}
            </div>

            {/* LOAD MORE SECTION */}
            <div className="flex justify-center py-4">
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={isFetching}
                className="flex items-center gap-2 px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {isFetching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}