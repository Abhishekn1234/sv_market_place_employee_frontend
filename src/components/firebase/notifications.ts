// src/components/firebase/notifications.ts

import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// 🔐 Get Token
export const requestAndGetToken = async (): Promise<string | null> => {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    // ⚠️ Only request if not already granted
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        console.log("❌ Permission denied");
        return null;
      }
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    if (!token) {
      console.log("❌ No FCM token");
      return null;
    }

    console.log("✅ FCM Token:", token);
    return token;
  } catch (err) {
    console.error("🔥 Token error:", err);
    return null;
  }
};



// 🔔 Foreground Notifications
export const initOnMessage = async () => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  const audio = new Audio("/notification.wav");

  onMessage(messaging, (payload) => {
    console.log("📩 Foreground message:", payload);

    const title = payload?.notification?.title || "🔔 New Notification";
    const url = payload?.data?.url || "/notifications";

    // 🔊 SOUND ONLY (foreground UX)
    audio.currentTime = 0;
    audio.play().catch(() => {
      console.log("🔇 Autoplay blocked");
    });

    // OPTIONAL: show in-app event (toast, badge, etc.)
    window.dispatchEvent(
      new CustomEvent("in-app-notification", {
        detail: { title, url },
      })
    );
  });
};