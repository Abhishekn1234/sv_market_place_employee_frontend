import { CommonCard } from "@/components/common/CommonCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Bell, Check, Trash2, Settings } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function NotificationsHeader({
  unreadCount,
  filter,
  setFilter,
  selectedCategory,
  setSelectedCategory,
  markAllAsRead,
  clearAllNotifications,
  notificationsTranslations,
  totalCount,
}: {
  unreadCount: number;
  filter: "all" | "unread" | "read";
  setFilter: (val: "all" | "unread" | "read") => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  notificationsTranslations: any;
  totalCount: number;
}) {
  const { theme } = useTheme();

  const mutedBtn =
    theme === "dark"
      ? "text-gray-300 bg-gray-800 hover:bg-gray-700"
      : "bg-gray-100 text-gray-900 hover:bg-gray-200";

  const selectBg =
    theme === "dark"
      ? "bg-gray-900 border-gray-700 text-gray-100"
      : "bg-white border-gray-300 text-gray-900";
 console.log(notificationsTranslations);
  return (
    <CommonCard className="mb-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>

            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {unreadCount}
              </div>
            )}
          </div>

          <div>
            <h1
              className={`text-xl sm:text-2xl font-semibold ${
                theme === "dark" ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {notificationsTranslations.title}
            </h1>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {notificationsTranslations.subtitle}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={markAllAsRead}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm"
          >
            <Check className="w-4 h-4" />
            {notificationsTranslations.markAllRead}
          </Button>

          <Button
            onClick={clearAllNotifications}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${mutedBtn}`}
          >
            <Trash2 className="w-4 h-4" />
            {notificationsTranslations.clearAll}
          </Button>

          <Button className={`p-2 rounded-lg ${mutedBtn}`}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mt-5">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 flex-1">
          <Button
            onClick={() => setFilter("all")}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              filter === "all" ? "bg-blue-600 text-white" : mutedBtn
            }`}
          >
            {notificationsTranslations.total} ({totalCount})
          </Button>

          <Button
            onClick={() => setFilter("unread")}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              filter === "unread" ? "bg-rose-600 text-white" : mutedBtn
            }`}
          >
            {notificationsTranslations.unread} ({unreadCount})
          </Button>

          <Button
            onClick={() => setFilter("read")}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              filter === "read" ? "bg-emerald-600 text-white" : mutedBtn
            }`}
          >
            {notificationsTranslations.read} ({totalCount - unreadCount})
          </Button>
        </div>

        {/* Category Select */}
        <div className="w-full lg:w-[220px]">
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger className={`w-full ${selectBg}`}>
              <SelectValue
                placeholder={notificationsTranslations.categories}
              />
            </SelectTrigger>

            <SelectContent className={selectBg}>
              <SelectItem value="all">
                {notificationsTranslations.categories.all}
              </SelectItem>
              <SelectItem value="booking">
                {notificationsTranslations.categories.bookings}
              </SelectItem>
              <SelectItem value="payment">
                {notificationsTranslations.categories.payments}
              </SelectItem>
              <SelectItem value="system">
                {notificationsTranslations.categories.system}
              </SelectItem>
              <SelectItem value="alert">
                {notificationsTranslations.categories.alerts}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CommonCard>
  );
}
