"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";

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

  const { t } = useLanguage();
  const { theme } = useTheme();

const { mutateAsync: markAsReadApi, isPending: isMarkingSelected } = useMarkAsRead();
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllRead();

  // =========================
  // API (NO LIMIT)
  // =========================
  const { data, isLoading, isFetching } = useNotifications({
    page,
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

  useEffect(() => {
    setPage(1);
    setAllNotifications([]);
    setSelectedIds([]);
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
    const unreadIds = unreadNotifications.map((n) => n._id);

    const allSelected =
      unreadIds.length > 0 &&
      unreadIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !unreadIds.includes(id))
      );
    } else {
      setSelectedIds(unreadIds);
    }
  };

  // =========================
  // MARK AS READ (SELECTED ONLY)
  // =========================
 const markSelectedAsRead = async () => {
  const idsToMark = [...selectedIds];

  if (!idsToMark.length) return;

  await Promise.all(
    idsToMark.map((id) => markAsReadApi(id))
  );

  setAllNotifications((prev) =>
    prev.map((n) =>
      idsToMark.includes(n._id) ? { ...n, isRead: true } : n
    )
  );

  setSelectedIds([]);
};
  // =========================
  // MARK ALL READ (ONLY WHEN SELECT ALL MODE)
  // =========================
  const handleMarkAllAsRead = async () => {
    await markAllRead();

    setAllNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );

    setSelectedIds([]);
  };

  // =========================
  // INFINITE SCROLL
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

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    });

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
          markAllRead={handleMarkAllAsRead}
          selectedNotificationIds={selectedIds}
          isPending={isMarkingSelected || isMarkingAll}
          toggleSelectAll={toggleSelectAll}
          currentPageUnreadCount={unreadNotifications.length}
        />

        {/* LIST */}
        <CommonCard className="p-0">
          <div className="space-y-3">
            {allNotifications.map((notification) => (
              <NotificationItem
                notificationsTranslations={t("notifications")}
                key={notification._id}
                notification={notification}
                markAsRead={markAsReadApi}
                isSelected={selectedIds.includes(notification._id)}
                onSelect={handleSelectNotification}
              />
            ))}
          </div>

          {/* LOADER */}
          {page < totalPages && (
            <div
              ref={loadMoreRef}
              className="flex justify-center py-6"
            >
              <CommonSpinner />
            </div>
          )}
        </CommonCard>

      </div>
    </div>
  );
}