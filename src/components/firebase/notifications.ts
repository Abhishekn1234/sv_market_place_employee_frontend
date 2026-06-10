// notifications.ts
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;
// const DEFAULT_NOTIF_URL = "/notifications";

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

  // const audio = new Audio("/notification.wav");
  // const channel = new BroadcastChannel("fcm_channel");

  // // simple in-memory dedupe for foreground notifications
  // const recentTags = new Set<string>();
  // const addRecentTag = (tag: string) => {
  //   recentTags.add(tag);
  //   // forget after 60s to allow future notifications
  //   setTimeout(() => recentTags.delete(tag), 60000);
  // };

  // const makeTag = (data: any) => {
  //   return `${data?.type || "notification"}-${data?.messageId || data?.bookingId || "general"}`;
  // };

 onMessage(messaging, (payload) => {
  const data = payload?.data || {};
  const notification = payload?.notification || {};
console.log(data,notification);
  // console.log("━━━━━━━━━━━━━━━━━━━━━━");
  // console.log("⚡ FOREGROUND FCM RECEIVED (LOG ONLY)");
  // console.log("━━━━━━━━━━━━━━━━━━━━━━");

  // console.log("📩 FULL PAYLOAD:", payload);
  // console.log("📦 DATA:", data);
  // console.log("🔔 NOTIFICATION:", notification);

  // console.log("🧠 PARSED:");
  // console.log("type:", data?.type);
  // console.log("status:", data?.status);
  // console.log("bookingId:", data?.bookingId);
  // console.log("messageId:", data?.messageId);

  // ❌ NO NOTIFICATION CREATION HERE
  // ❌ NO AUDIO
  // ❌ NO NAVIGATION
});
};