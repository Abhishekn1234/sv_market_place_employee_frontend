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

  onMessage(messaging, (payload) => {
    console.log("📩 Foreground message:", payload);

    const title = payload?.data?.title || "New Notification";
    const url = payload?.data?.url || "/notifications";

    // 🔊 sound
    audio.currentTime = 0;
    audio.play().catch(() => {});

    // 📡 unified navigation channel
    channel.postMessage({
      type: "NAVIGATE",
      url,
      title,
    });
  });
};