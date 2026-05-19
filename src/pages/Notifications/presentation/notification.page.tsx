"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Bell } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import NotificationsHeader from "./components/NotificationHeader";
import NotificationItem from "./components/NotificationItem";
import { useTheme } from "@/context/ThemeContext";

import { useNotifications } from "./hooks/useNotification";
import { useMarkAsRead } from "./hooks/useMarkasRead";
import { useMarkAllRead } from "./hooks/useMarkAllRead";
import CommonSpinner from "@/components/common/CommonSpinner";

import { CATEGORY_MAP } from "./utils/typemap";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const limit = 10;

  const { t } = useLanguage();
  const { theme } = useTheme();

  const notificationTranslations = t("notifications");

  const { mutate: markAsReadApi } = useMarkAsRead();
  const { mutate: markAllRead, isPending } = useMarkAllRead();

  // =========================
  // API
  // =========================
  const { data, isLoading, isFetching } = useNotifications({
    page,
    limit,
    unreadOnly: filter === "unread" ? true : undefined,
    type: CATEGORY_MAP[selectedCategory],
  });

  const notifications = data?.data || [];
  const pagination = data?.pagination;

  const totalPages = pagination?.totalPages || 1;

  // =========================
  // ACCUMULATED LIST
  // =========================
  const [allNotifications, setAllNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (page === 1) {
      setAllNotifications(notifications);
    } else {
      setAllNotifications((prev) => [...prev, ...notifications]);
    }
  }, [notifications, page]);

  // reset on filter change
  useEffect(() => {
    setPage(1);
    setAllNotifications([]);
  }, [filter, selectedCategory]);

  // =========================
  // UNREAD
  // =========================
  const unreadNotifications = useMemo(
    () => allNotifications.filter((n) => !n.isRead),
    [allNotifications]
  );

  const unreadCount = unreadNotifications.length;
  const readCount = allNotifications.length - unreadCount;

  // =========================
  // SELECT LOGIC
  // =========================
  const handleSelectNotification = (id: string) => {
    const target = allNotifications.find((n) => n._id === id);
    if (!target || target.isRead) return;

    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const pageUnreadIds = unreadNotifications.map((n) => n._id);

    const allSelected =
      pageUnreadIds.length > 0 &&
      pageUnreadIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !pageUnreadIds.includes(id))
      );
    } else {
      setSelectedIds(pageUnreadIds);
    }
  };

  const markAsRead = (id: string) => markAsReadApi(id);

  const markSelectedAsRead = () => {
    const ids = selectedIds.filter((id) =>
      allNotifications.some((n) => n._id === id && !n.isRead)
    );

    if (!ids.length) return;

    ids.forEach(markAsRead);
    setSelectedIds([]);
  };

  const handleMarkedRead = (id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  // =========================
  // INFINITE SCROLL (IMPORTANT)
  // =========================
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(() => {
    if (!isFetching && page < totalPages) {
      setPage((p) => p + 1);
    }
  }, [isFetching, page, totalPages]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  if (isLoading && page === 1) return <CommonSpinner />;

  return (
    <div className={`p-4 ${theme === "dark" ? "text-white" : ""}`}>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <NotificationsHeader
          unreadCount={unreadCount}
          readCount={readCount}
          totalCount={allNotifications.length}
          filter={filter}
          setFilter={setFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          markSelectedAsRead={markSelectedAsRead}
          markAllRead={markAllRead}
          limit={limit}
          isPending={isPending}
          selectedCount={selectedIds.length}
          toggleSelectAll={toggleSelectAll}
          currentPageUnreadCount={unreadNotifications.length}
        />

        {/* EMPTY */}
        {allNotifications.length === 0 ? (
          <CommonCard className="flex items-center justify-center gap-2 py-10">
            <Bell className="w-5 h-5" />
            <span>{t("notifications.noNotifications")}</span>
          </CommonCard>
        ) : (
          <>
            {/* LIST */}
            <div className="space-y-3">
              {allNotifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  notificationsTranslations={notificationTranslations}
                  markAsRead={markAsRead}
                  isSelected={selectedIds.includes(notification._id)}
                  onSelect={handleSelectNotification}
                  onMarkedRead={handleMarkedRead}
                />
              ))}
            </div>

            {/* 👇 OBSERVER TRIGGER + SPINNER */}
            {page < totalPages && (
              <div
                ref={loadMoreRef}
                className="flex justify-center py-6"
              >
                <CommonSpinner />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}