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

// 🔔 Foreground Notifications (NO DUPLICATE)
export const initOnMessage = async () => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  const audio = new Audio("/notification.wav");

  onMessage(messaging, (payload) => {
    console.log("📩 Foreground message:", payload);

    const title = payload?.data?.title || "🔔 New Notification";
    const url = payload?.data?.url || "/notifications";

    // 🔊 Sound only
    audio.currentTime = 0;
    audio.play().catch(() => {});

    // 🔥 Custom event for UI
    window.dispatchEvent(
      new CustomEvent("in-app-notification", {
        detail: { title, url },
      })
    );
  });
};