import type { Notification } from "../../domain/entities/notification";

export const data: Notification[] = [
  {
    id: "1",
    title: "New Booking Assigned",
    message:
      "You have a new service booking today at 10:00 AM. Please confirm your availability.",
    createdAt: new Date().toISOString(),
    isRead: false,
    type: "BOOKING_REQUEST",
  },
  {
    id: "2",
    title: "Payment Received",
    message: "Your payment has been completed and credited to your wallet.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    type: "BOOKING_UPDATE",
  },
  {
    id: "3",
    title: "Booking Cancelled",
    message: "A booking scheduled for today has been cancelled by the client.",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    type: "BOOKING_UPDATE",
  },
  {
    id: "4",
    title: "System Maintenance",
    message:
      "Scheduled maintenance will occur tomorrow from 2:00 AM to 4:00 AM.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    type: "ADMIN_MESSAGE",
  },
];
