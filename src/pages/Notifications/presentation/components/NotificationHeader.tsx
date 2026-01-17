import { CommonCard } from "@/components/common/CommonCard";
import { 
  Bell, Check, Trash2, Settings 
} from "lucide-react";
export default function NotificationsHeader({
  unreadCount,
  filter,
  setFilter,
  selectedCategory,
  setSelectedCategory,
  markAllAsRead,
  clearAllNotifications,
  notificationsTranslations,
  totalCount
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
  return (
    <CommonCard className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {unreadCount}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{notificationsTranslations.title}</h1>
            <p className="text-gray-600">{notificationsTranslations.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Check className="w-4 h-4" /> {notificationsTranslations.markAllRead}
          </button>
          <button
            onClick={clearAllNotifications}
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> {notificationsTranslations.clearAll}
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="flex-1 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {notificationsTranslations.all} ({totalCount})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${filter === "unread" ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {notificationsTranslations.unread} ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === "read" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {notificationsTranslations.read} ({totalCount - unreadCount})
          </button>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700"
          >
            <option value="all">{notificationsTranslations.allCategories}</option>
            <option value="booking">{notificationsTranslations.bookings}</option>
            <option value="payment">{notificationsTranslations.payments}</option>
            <option value="system">{notificationsTranslations.system}</option>
            <option value="alert">{notificationsTranslations.alerts}</option>
          </select>
        </div>
      </div>
    </CommonCard>
  );
}