// src/components/firebase/notifications.ts

import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";

const VAPID_KEY = "BI2b4vrUDzHchIB1c-679DSWk1wD2weRFgDGihHy5VA0XkVP_lYcALYnK54v6aO8hQ4W8h28eql26_ZySjN2yRI";


export const requestAndGetToken = async (): Promise<string | null> => {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("❌ Permission denied");
      return null;
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

// ✅ Foreground notifications (FIXED)
export const initOnMessage = async () => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("📩 Foreground message:", payload);

    // 🔥 Extract notification data safely
    const title = payload?.notification?.title || "New Notification";
    const body = payload?.notification?.body || "";
    const icon = payload?.notification?.icon || "/icons/icon-192.png";

    // ✅ Show browser notification
    if (Notification.permission === "granted") {
      const notification = new Notification(title, {
        body,
        icon,
        data: payload?.data, // pass custom data
      });

      // 🔁 Handle click
      notification.onclick = (event) => {
        event.preventDefault();

        const url = payload?.data?.url || "/notifications";

        window.focus();
        window.location.href = url;
      };
    }
  });
};