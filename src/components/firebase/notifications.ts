// notifications.ts
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// 🔐 Get FCM Token
export const requestAndGetToken = async (): Promise<string | null> => {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return null;
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    console.log("✅ FCM Token:", token);
    return token;
  } catch (err) {
    console.error("🔥 Token error:", err);
    return null;
  }
};

// 🔔 Foreground handler (NOW ALSO NAVIGATES)
export const initOnMessage = async () => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  const audio = new Audio("/notification.wav");
  const channel = new BroadcastChannel("fcm_channel");
  const DEFAULT_NOTIF_URL = "/notifications";

  // simple in-memory dedupe for foreground notifications
  const recentTags = new Set<string>();
  const addRecentTag = (tag: string) => {
    recentTags.add(tag);
    // forget after 60s to allow future notifications
    setTimeout(() => recentTags.delete(tag), 60000);
  };

  const makeTag = (data: any) => {
    return `${data?.type || "notification"}-${data?.messageId || data?.bookingId || "general"}`;
  };

  onMessage(messaging, (payload) => {
    const data = payload?.data || {};
    const notification = payload?.notification || {};
    if (!data && !notification) return;

    audio.currentTime = 0;
    audio.play().catch(() => {});

    console.log("📩 Foreground message:", { data, notification });

    const title = notification?.title || data?.title || "Notification";
    const body = notification?.body || data?.body || "You have a new update";

    try {
      if (Notification.permission === "granted") {
        const url = DEFAULT_NOTIF_URL;
        const tag = makeTag(data);

        // avoid showing duplicates in foreground
        if (recentTags.has(tag)) {
          console.log("Duplicate foreground notification skipped:", tag);
        } else {
          addRecentTag(tag);

          const notif = new Notification(title, {
            body,
            icon: "/icon.jpg",
            tag,
            actions: [{ action: "open", title: "Open" }],
            data: { url, type: data?.type, bookingId: data?.bookingId, messageId: data?.messageId },
          }as NotificationOptions );

          notif.onclick = (e: any) => {
            e.preventDefault();
            channel.postMessage({ type: "NAVIGATE", url });
            window.focus?.();
            notif.close?.();
          };
        }
      }
    } catch (err) {
      console.error("Foreground notification error:", err);
    }

    // Decide navigation target: if booking is REQUESTED, go to availableBooking
    const bookingStatus = data?.status;
    const bookingId = data?.bookingId;
    const targetUrl = bookingStatus === "REQUESTED"
      ? `/availableBooking?status=requested&bookingId=${bookingId}`
      : DEFAULT_NOTIF_URL;

    // Only navigate if not already on the target path
    try {
      const targetPath = new URL(targetUrl, window.location.origin).pathname;
      const currentPath = window.location.pathname;
      if (!currentPath.includes(targetPath)) {
        channel.postMessage({ type: "NAVIGATE", url: targetUrl });
      }
    } catch (err) {
      // fallback
      if (!window.location.pathname.includes(DEFAULT_NOTIF_URL)) {
        channel.postMessage({ type: "NAVIGATE", url: DEFAULT_NOTIF_URL });
      }
    }
  });
};