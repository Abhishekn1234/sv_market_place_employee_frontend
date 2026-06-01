"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";

import type { NotificationResponse } from "../domain/entities/notification";
import { useLanguage } from "@/context/LanguageContext";

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

  const response = data as NotificationResponse | undefined;
  const notifications = response?.data;
  const pagination = response?.pagination;
  const totalPages = pagination?.totalPages || 1;

  // =========================
  // ACCUMULATED LIST
  // =========================
  const [allNotifications, setAllNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (notifications === undefined) return;

    if (page === 1) {
      setAllNotifications(notifications);
    } else {
      setAllNotifications((prev) => [...prev, ...notifications]);
    }
  }, [notifications, page]);

  useEffect(() => {
    setPage(1);
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
    <div
      className={`min-h-screen py-6 px-4 sm:px-6 lg:px-8 ${
        theme === "dark"
          ? "bg-slate-950 text-white"
          : "bg-slate-0 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-none">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
                {t("notifications.title")}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                {t("notifications.title")}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                {t("notifications.subtitle")}
              </p>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-center dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {t("notifications.unread")}
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                  {unreadCount}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-center dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {t("notifications.total")}
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                  {allNotifications.length}
                </p>
              </div>
            </div>
          </div>
        </div>

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

       
          {allNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("notifications.noNotifications")}
              </p>
            </div>
          ) : (
            <div className="space-y-3 p-4 sm:p-6">
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

              {page < totalPages && (
                <div ref={loadMoreRef} className="flex justify-center py-6">
                  <CommonSpinner />
                </div>
              )}
            </div>
          )}
       
      </div>
    </div>
  );
}