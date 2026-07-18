"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";

import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useTheme } from "@/context/presentation/components/ThemeContext";

import NotificationsHeader from "./components/NotificationHeader";
import NotificationItem from "./components/NotificationItem";

import { useMarkAsRead } from "./hooks/useMarkasRead";
import { useMarkAllRead } from "./hooks/useMarkAllRead";
import { useGetNotifications } from "./hooks/useGetNotifications";
import { useUnreadCount } from "./hooks/useUnreadCount";
import CommonSpinner from "@/components/common/CommonSpinner";
import { CATEGORY_MAP } from "./utils/typemap";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { t } = useLanguage();
  const { theme } = useTheme();

  const { mutateAsync: markAsReadApi, isPending: isMarkingSelected } =
    useMarkAsRead();

  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllRead();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [selectAll, setSelectAll] = useState(false);
   const {
    data: unreadCountData,
    isLoading: isUnreadLoading,
    refetch: refetchUnreadCount,
  } = useUnreadCount();
 const unreadCount = unreadCountData ?? 0;
  // =========================
  // INFINITE QUERY
  // =========================
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetNotifications({
    limit: 20,
    unreadOnly: filter === "unread" ? true : undefined,
    type: CATEGORY_MAP[selectedCategory],
  });
  

  // =========================
  // FLATTEN DATA
  // =========================
  const notifications = data?.pages.flatMap((page) => page.data) ?? [];

  const lastPage = data?.pages?.[data.pages.length - 1];
  const pagination = lastPage?.pagination;

  const totalCount = pagination?.totalItems ?? 0;

  // =========================
  // PAGE-LEVEL UNREAD (only for loaded items — used for selection UI,
  // NOT for the header stat anymore)
  // =========================
  const loadedUnreadNotifications = useMemo(
    () => notifications.filter((n) => !n.isRead),
    [notifications]
  );

  const readCount = totalCount - unreadCount; // now derived from real totals
  const currentPageUnreadCount = loadedUnreadNotifications.length;
  

  // =========================
  // SELECT LOGIC
  // =========================
  const handleSelectNotification = (id: string) => {
     if (selectAll) {
        setSelectAll(false);
    }
    const target = notifications.find((n) => n._id === id);
    if (!target || target.isRead) return;

    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

 const toggleSelectAll = () => {
  const next = !selectAll;

  setSelectAll(next);

  if (next) {
    // Select every unread notification on the current page
    setSelectedIds(
      loadedUnreadNotifications.map((notification) => notification._id)
    );
  } else {
    // Unselect everything
    setSelectedIds([]);
  }
};

  // =========================
  // MARK SELECTED AS READ
  // =========================
  const handleMarkAllAsRead = async () => {
  await markAllRead();
  setSelectedIds([]);
  setSelectAll(false);
  refetchUnreadCount();
   };

    const markSelectedAsRead = async () => {
      if (!selectedIds.length) return;
      await Promise.all(selectedIds.map((id) => markAsReadApi(id)));
      setSelectedIds([]);
      refetchUnreadCount();
    };
  // =========================
  // LOAD MORE
  // =========================
  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // =========================
  // INTERSECTION OBSERVER
  // =========================
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observerRef.current.observe(el);

    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  // =========================
  // LOADING STATE
  // =========================
  if (isLoading) return <CommonSpinner />;

  // =========================
  // UI
  // =========================
  return (
    <div
      className={`py-6 px-4 sm:px-6 lg:px-8 ${
        theme === "dark"
          ? "bg-slate-950 text-white"
          : "bg-slate-0 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER STATS */}
        <div className="rounded-3xl border border-slate-200 bg-white/90 dark::border-slate-800 dark:bg-slate-900/90 dark:shadow-none p-6">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-semibold">
                {t("notifications.title")}
              </h1>
              <p className="text-sm text-slate-500">
                {t("notifications.subtitle")}
              </p>
            </div>

            <div className="flex gap-4">
             {/* HEADER STATS */}
                <div>
                  <p className="text-xs">{t("notifications.unread")}</p>
                  <p className="text-xl font-bold">
                    {isUnreadLoading ? "…" : unreadCount}
                  </p>
                </div>

              <div>
                <p className="text-xs">{t("notifications.total")}</p>
                <p className="text-xl font-bold">{totalCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* HEADER CONTROLS */}
        <NotificationsHeader
          unreadCount={unreadCount}
          readCount={readCount}
          totalCount={totalCount}
          filter={filter}
          setFilter={setFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          markSelectedAsRead={markSelectedAsRead}
          markAllRead={handleMarkAllAsRead}
          isAllSelected={selectAll}
          selectedNotificationIds={selectedIds}
          isPending={isMarkingSelected || isMarkingAll}
          toggleSelectAll={toggleSelectAll}
          currentPageUnreadCount={currentPageUnreadCount} 
        />

        {/* LIST */}
        {notifications.length === 0 ? (
          <div className="text-center p-8 text-slate-500">
           {t("common.noData")}
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4 sm:p-6">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                notificationsTranslations={t("notifications")}
                markAsRead={markAsReadApi}
                isSelected={selectedIds.includes(notification._id)}
                onSelect={handleSelectNotification}
              />
            ))}

            {/* LOADER */}
            {hasNextPage && (
              <div
                ref={loadMoreRef}
                className="h-20 flex items-center justify-center"
              >
                {isFetchingNextPage && <CommonSpinner />}
              </div>
            )}

            {/* END */}
            {!hasNextPage && notifications.length > 0 && (
              <div className="text-center text-sm text-slate-500 py-4">
                {t("notifications.end")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}