import { CommonCard } from "@/components/common/CommonCard";
import type { Notification } from "../../domain/entities/notification";
import { 
  CheckCircle, XCircle, AlertTriangle, Info,  Check, Trash2, ExternalLink, MoreVertical, 
} from "lucide-react";
// ---------- Single Notification ----------
export default function NotificationItem({
  notification,
  markAsRead,
  deleteNotification,
  notificationsTranslations
}: {
  notification: Notification;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  notificationsTranslations: any;
}) {
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
  const getCategoryColor = (category: Notification["category"]) => {
    switch (category) {
      case "booking": return "bg-indigo-100 text-indigo-700";
      case "payment": return "bg-emerald-100 text-emerald-700";
      case "system": return "bg-gray-100 text-gray-700";
      case "alert": return "bg-rose-100 text-rose-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <CommonCard className={`${notification.read ? "border-gray-200" : "border-blue-200 bg-gradient-to-r from-blue-50 to-white"}`}>
      <div className="p-5 flex items-start gap-4">
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
          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
        </div>
      </div>
    </CommonCard>
  );
}