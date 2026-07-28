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

    const registration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    // console.log("✅ FCM Token:", token);
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
    const data = payload?.data || {};
    const notification = payload?.notification || {};

    console.log(data, notification);

    // Play sound only for chat notifications
    if (
      data.type === "CHAT_MESSAGE" ||
      data.type === "NEW_MESSAGE"
    ) {
      audio.currentTime = 0;

      audio.play().catch((err) => {
        console.log("Unable to play notification sound:", err);
      });
    }
  });
 };