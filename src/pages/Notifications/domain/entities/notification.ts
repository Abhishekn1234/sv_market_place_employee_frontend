export type NotificationType =
  | "BOOKING_REQUEST"
  | "BOOKING_UPDATE"
  | "ADMIN_MESSAGE";

export interface Notification {
  id?: string;
  _id:string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  bookingId?:string;
  createdAt: string;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  type?: NotificationType;
  unreadOnly?: boolean;
}

export interface RegisterDeviceTokenPayload {
  token: string;
  platform: "ANDROID" | "IOS" | "WEB";
  roleId: string;
  deviceId: string;
  appId: string;
}

export interface NotificationResponse {
  data: Notification[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}