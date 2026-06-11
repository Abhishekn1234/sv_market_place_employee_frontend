import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const getNotificationId = (n: any) =>
  n?._id || n?.id || n?.messageId;

const getNotificationRoute = (n: any) => {
  if (n.url) return n.url;

  if (n.type === "ADMIN_MESSAGE") {
    return "/notifications";
  }

  if (n.bookingId) {
    if (
      n.status === "REQUESTED" ||
      n.status === "requested"
    ) {
      return `/availableBooking?status=requested&bookingId=${n.bookingId}`;
    }

    return `/availableWork?bookingId=${n.bookingId}`;
  }

  return "/notifications";
};

export const useForegroundNotifications = (notificationsData: any) => {
  const navigate = useNavigate();
  const location = useLocation();

  const shownIds = useRef(new Set<string>());

  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    if (!notificationsData) return;

    const notifications = Array.isArray(notificationsData)
      ? notificationsData
      : Array.isArray(notificationsData?.data)
      ? notificationsData.data
      : Array.isArray(notificationsData?.notifications)
      ? notificationsData.notifications
      : [];

    const isSameRoute = (url: string) => {
      try {
        const current = location.pathname + location.search;

        const target = new URL(url, window.location.origin);
        const normalizedTarget =
          target.pathname + target.search;

        return current === normalizedTarget;
      } catch {
        return false;
      }
    };

    notifications.forEach((n: any) => {
      const id = getNotificationId(n);
      if (!id) return;

      if (n.isRead) return;
      if (shownIds.current.has(id)) return;

      const url = getNotificationRoute(n);

      // ✅ KEY FIX: do not show notification if already on same page
      if (isSameRoute(url)) return;

      shownIds.current.add(id);

      // const title =
      //   n.title ||
      //   (n.type === "ADMIN_MESSAGE"
      //     ? "Admin Message"
      //     : "Notification");

      // const body =
      //   n.message ||
      //   n.body ||
      //   "You have a new notification";

      // const browserNotification = new Notification(title, {
      //   body,
      //   icon: "/logo.png",
      //   badge: "/logo.png",
      //   tag: id,
      //   data: { url },
      // });

      // browserNotification.onclick = () => {
      //   window.focus();
      //   navigate(url);
      //   browserNotification.close();
      // };
    });
  }, [notificationsData, navigate, location.pathname, location.search]);
};