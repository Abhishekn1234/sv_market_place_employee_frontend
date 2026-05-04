import type {
  // Notification,
  GetNotificationsParams,
  RegisterDeviceTokenPayload,
  NotificationResponse,
} from "@/pages/Notifications/domain/entities/notification"

export interface INotificationRepository {
  getNotifications(params?: GetNotificationsParams): Promise<NotificationResponse>;
  getUnreadCount(): Promise<number>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(): Promise<void>;

  registerDeviceToken(payload: RegisterDeviceTokenPayload): Promise<void>;
  unregisterDeviceToken(token: string): Promise<void>;
}