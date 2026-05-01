import type { INotificationRepository } from "../../domain/repositories/NotificationRepo";
import type {
  Notification,
  GetNotificationsParams,
  RegisterDeviceTokenPayload,
} from "../../domain/entities/notification";
import api from "@/api/api"; // your axios instance

export class NotificationRepositoryImpl implements INotificationRepository {
  async getNotifications(params?: GetNotificationsParams): Promise<Notification[]> {
    const res = await api.get("/notifications", { params });
    return res.data.data;
  }

  async getUnreadCount(): Promise<number> {
    const res = await api.get("/notifications/unread-count");
    return res.data.count;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await api.post(`/notifications/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await api.post(`/notifications/read-all`);
  }

  async registerDeviceToken(payload: RegisterDeviceTokenPayload): Promise<void> {
    await api.post("/notifications/device-token/register", payload);
  }

  async unregisterDeviceToken(token: string): Promise<void> {
    await api.post("/notifications/device-token/unregister", { token });
  }
}