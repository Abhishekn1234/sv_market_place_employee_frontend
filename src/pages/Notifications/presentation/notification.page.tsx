import  { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, Bell, Check, Trash2, Settings, ExternalLink, MoreVertical, Mail, Filter } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Notification = {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  type: "success" | "error" | "warning" | "info";
  category: "booking" | "payment" | "system" | "alert";
  priority: "low" | "medium" | "high";
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { translations } = useLanguage();
  const notificationsTranslations = translations.Notifications;

  // Fetch notifications (simulate)
  useEffect(() => {
    const data: Notification[] = [
      {
        id: "1",
        title: "New Booking Assigned",
        description: "You have a new service booking today at 10:00 AM. Please confirm your availability.",
        date: "Just now",
        read: false,
        type: "info",
        category: "booking",
        priority: "high"
      },
      {
        id: "2",
        title: "Payment Received",
        description: "Your payment of $150 has been completed and credited to your wallet.",
        date: "2 hours ago",
        read: true,
        type: "success",
        category: "payment",
        priority: "medium"
      },
      {
        id: "3",
        title: "Booking Cancelled",
        description: "A booking scheduled for today has been cancelled by the client.",
        date: "4 hours ago",
        read: false,
        type: "error",
        category: "booking",
        priority: "high"
      },
      {
        id: "4",
        title: "System Maintenance",
        description: "Scheduled maintenance will occur tomorrow from 2:00 AM to 4:00 AM.",
        date: "Yesterday",
        read: true,
        type: "warning",
        category: "system",
        priority: "low"
      },
      {
        id: "5",
        title: "New Message Received",
        description: "You have received a new message from client #12345 regarding their booking.",
        date: "Yesterday",
        read: false,
        type: "info",
        category: "booking",
        priority: "medium"
      },
      {
        id: "6",
        title: "Withdrawal Successful",
        description: "Your withdrawal request of $500 has been processed successfully.",
        date: "2 days ago",
        read: true,
        type: "success",
        category: "payment",
        priority: "medium"
      },
      {
        id: "7",
        title: "Service Rating",
        description: "Client #7890 has rated your service with 5 stars. Great job!",
        date: "2 days ago",
        read: false,
        type: "success",
        category: "booking",
        priority: "low"
      },
      {
        id: "8",
        title: "Profile Update Required",
        description: "Please update your profile information for verification.",
        date: "3 days ago",
        read: true,
        type: "warning",
        category: "system",
        priority: "medium"
      },
    ];
    setNotifications(data);
  }, []);

  // Actions
  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const deleteNotification = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const clearAllNotifications = () => setNotifications([]);

  // Helpers
  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success": return <CheckCircle className="w-5 h-5" />;
      case "error": return <XCircle className="w-5 h-5" />;
      case "warning": return <AlertTriangle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success": return "bg-emerald-100 text-emerald-600 border-emerald-200";
      case "error": return "bg-rose-100 text-rose-600 border-rose-200";
      case "warning": return "bg-amber-100 text-amber-600 border-amber-200";
      default: return "bg-blue-100 text-blue-600 border-blue-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "booking": return "bg-indigo-100 text-indigo-700";
      case "payment": return "bg-emerald-100 text-emerald-700";
      case "system": return "bg-gray-100 text-gray-700";
      case "alert": return "bg-rose-100 text-rose-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    if (selectedCategory !== "all") return notification.category === selectedCategory;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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
                <Check className="w-4 h-4" />
                {notificationsTranslations.markAllRead}
              </button>
              <button
                onClick={clearAllNotifications}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {notificationsTranslations.clearAll}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {notificationsTranslations.all} ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  filter === "unread" ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {notificationsTranslations.unread} ({unreadCount})
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "read" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {notificationsTranslations.read} ({notifications.length - unreadCount})
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
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{notificationsTranslations.noNotifications}</h3>
            <p className="text-gray-500">{notificationsTranslations.caughtUp}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`group bg-white rounded-xl border transition-all duration-300 hover:shadow-lg ${
                  notification.read ? "border-gray-200" : "border-blue-200 bg-gradient-to-r from-blue-50 to-white"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${getTypeColor(notification.type)} border`}>
                      {getTypeIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                        <div className="flex items-start gap-2">
                          <h3 className={`font-semibold ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
                            {notification.title}
                          </h3>
                          {notification.priority === "high" && !notification.read && (
                            <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">
                              {notificationsTranslations.highPriority}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 whitespace-nowrap">{notification.date}</span>
                      </div>

                      <p className="text-gray-600 mb-3">{notification.description}</p>

                      <div className="flex flex-wrap items-center gap-3">
                        {notification.category && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(notification.category)}`}>
                            {notification.category}
                          </span>
                        )}
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                          <ExternalLink className="w-4 h-4" />
                          {notificationsTranslations.viewDetails}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                              title={notificationsTranslations.markAllRead}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 hover:bg-rose-50 rounded-lg text-rose-600"
                            title={notificationsTranslations.clearAll}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">
              {notificationsTranslations.showing} {filteredNotifications.length} of {notifications.length} {notificationsTranslations.all}
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {notificationsTranslations.emailDigest}
              </button>
              <button className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1">
                <Filter className="w-4 h-4" />
                {notificationsTranslations.notificationSettings}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
