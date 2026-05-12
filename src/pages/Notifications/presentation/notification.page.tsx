"use client";

import { useState, useEffect, useMemo } from "react";
import { Bell } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import NotificationsHeader from "./components/NotificationHeader";
import NotificationItem from "./components/NotificationItem";
import { useTheme } from "@/context/ThemeContext";

import { useNotifications } from "./hooks/useNotification";
import { useMarkAsRead } from "./hooks/useMarkasRead";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { CATEGORY_MAP } from "./utils/typemap";
import { useUnreadCount } from "./hooks/useUnreadCount";
import { useMarkAllRead } from "./hooks/useMarkAllRead";
import CommonSpinner from "@/components/common/CommonSpinner";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { t } = useLanguage();
  const notificationTranslations = t("notifications");
  const { theme } = useTheme();

  const {
    data,
    isLoading,
    isFetching,
  } = useNotifications({
    page,
    limit,
    unreadOnly: filter === "unread" ? true : undefined,
    type: CATEGORY_MAP[selectedCategory],
  });
  console.log(data);

  const { mutate: markAsReadApi } = useMarkAsRead();
  const { mutate: markAllRead, isPending } = useMarkAllRead();

  const markAsRead = (id: string) => markAsReadApi(id);

  const notifications = data?.data || [];
  const pagination = data?.pagination;

  const totalPages = pagination?.totalPages || 1;

  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData || 0;

  const totalCount = pagination?.totalItems || 0;
  const readCount = totalCount - unreadCount;

  // =========================
  // UNREAD FILTER (IMPORTANT)
  // =========================
  const unreadNotifications = useMemo(
    () => notifications.filter((n: any) => !n.isRead),
    [notifications]
  );

  // =========================
  // SELECT SINGLE (BLOCK READ)
  // =========================
  const handleSelectNotification = (id: string) => {
    const target = notifications.find((n: any) => n._id === id);

    if (!target || target.isRead) return; // 🚫 prevent read selection

    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // =========================
  // SELECT ALL (UNREAD ONLY)
  // =========================
  const toggleSelectAll = () => {
    const unreadIds = unreadNotifications.map((n: any) => n._id);

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
  // BULK READ
  // =========================
  const markSelectedAsRead = () => {
    selectedIds.forEach((id) => markAsRead(id));
    setSelectedIds([]);
  };

  // =========================
  // EFFECTS
  // =========================
  useEffect(() => {
    setPage(1);
  }, [filter, limit, selectedCategory]);

  useEffect(() => {
    setSelectedIds([]);
  }, [page]);

  if (isLoading) {
    return <CommonSpinner />;
  }

  return (
    <div className={`p-4 ${theme === "dark" ? "text-white" : ""}`}>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <NotificationsHeader
          unreadCount={unreadCount}
          readCount={readCount}
          totalCount={totalCount}
          filter={filter}
          setFilter={setFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          markSelectedAsRead={markSelectedAsRead}
          markAllRead={markAllRead}
          limit={limit}
          isPending={isPending}
          setLimit={setLimit}
          selectedCount={selectedIds.length}
          toggleSelectAll={toggleSelectAll}   // ✅ IMPORTANT
        />

        {/* EMPTY STATE */}
        {notifications.length === 0 ? (
          <CommonCard className="flex items-center justify-center gap-2 py-10">
            <Bell className="w-5 h-5" />
            <span>{t("notifications.noNotifications")}</span>
          </CommonCard>
        ) : (
          <>
            {/* LIST */}
            <div className="space-y-3">
              {notifications.map((notification: any) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  notificationsTranslations={notificationTranslations}
                  markAsRead={markAsRead}
                  isSelected={selectedIds.includes(notification._id)}
                  onSelect={handleSelectNotification}
                />
              ))}
            </div>

            {/* LOADING */}
            {isFetching && <CommonSpinner />}

            {/* PAGINATION */}
            <Pagination className="mt-6 flex justify-end">
              <PaginationContent>

                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, page - 2), page + 1)
                  .map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={page === p}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </div>
  );
}