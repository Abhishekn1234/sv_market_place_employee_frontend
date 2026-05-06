"use client";

import { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
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

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { t } = useLanguage();
  const notificationTranslations=t('notifications');
  const { theme } = useTheme();

 const {
  data,
  isLoading,
  isFetching,
} = useNotifications({
  page,
  limit,
  unreadOnly: filter === "unread" ? true : undefined,
  type: CATEGORY_MAP[selectedCategory], // ✅ FIXED
});

  const { mutate: markAsReadApi } = useMarkAsRead();

  const markAsRead = (id: string) => markAsReadApi(id);

  const { mutate: markAllRead, isPending } = useMarkAllRead();
      const notifications = data?.data || [];
      const pagination = data?.pagination;

      const totalPages = pagination?.totalPages || 1;

    const { data: unreadData } = useUnreadCount();

    const unreadCount = unreadData || 0;


    const totalCount = pagination?.totalItems || 0;
    const readCount = totalCount - unreadCount;

  const handleSelectNotification = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // ✅ BULK READ
  const markSelectedAsRead = () => {
    selectedIds.forEach((id) => markAsRead(id));
    setSelectedIds([]);
  };

  // RESET PAGE ON FILTER/LIMIT CHANGE
useEffect(() => {
  setPage(1);
}, [filter, limit, selectedCategory]); 

  // CLEAR SELECTION ON PAGE CHANGE
  useEffect(() => {
    setSelectedIds([]);
  }, [page]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div className={`p-4 ${theme === "dark" ? "text-white" : ""}`}>
      <div className="max-w-4xl mx-auto space-y-6">

       <NotificationsHeader
          unreadCount={unreadCount}
          readCount={readCount}
          totalCount={totalCount}
          filter={filter}
          setFilter={setFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          markSelectedAsRead={markSelectedAsRead}
          markAllRead={markAllRead}   // ✅ ADD THIS
          limit={limit}
            isPending={isPending}    
          setLimit={setLimit}
          selectedCount={selectedIds.length}
        />

        {notifications.length === 0 ? (
          <CommonCard className="flex items-center justify-center gap-2 py-10">
                <Bell className="w-5 h-5" />
                <span>{t('notifications.noNotifications')}</span>
              </CommonCard>
        ) : (
          <>
            {/* LIST */}
            <div className="space-y-3">
              {notifications.map((notification) => (
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
            {isFetching && (
              <div className="text-center py-3">
                <Loader2 className="animate-spin inline-block mr-2" />
                Loading...
              </div>
            )}

            {/* PAGINATION */}
            <Pagination className="mt-6 flex justify-end">
              <PaginationContent>

                {/* PREVIOUS */}
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {/* PAGE NUMBERS */}
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

                {/* NEXT */}
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