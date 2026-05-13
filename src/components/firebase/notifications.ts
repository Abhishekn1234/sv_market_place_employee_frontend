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

  onMessage(messaging, (payload) => {
    const data = payload?.data;
    if (!data) return;

    audio.currentTime = 0;
    audio.play().catch(() => {});

    console.log("📩 Foreground message:", data);
  });
};