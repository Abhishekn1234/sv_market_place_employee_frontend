// firebase-messaging-sw.js

importScripts("./firebase-config.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

firebase.initializeApp(self.FIREBASE_CONFIG);
const messaging = firebase.messaging();

const channel = new BroadcastChannel("fcm_channel");

// 🔥 ensure SW controls pages immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// 📩 Background notification
messaging.onBackgroundMessage(async (payload) => {
  console.log("📩 Background message:", payload);

  if (!payload?.data) return;

  const title = payload.data.title || "New Notification";
  const body = payload.data.body || "";
  const url = payload.data.url || "/notifications";

  const tag = `notif-${title}-${url}`;

  const existing = await self.registration.getNotifications();
  if (existing.some((n) => n.tag === tag)) return;

  self.registration.showNotification(title, {
    body,
    icon: "/icon.jpg",
    tag,
    data: { url },
    requireInteraction: true,
  });
});

// 🔔 Click handler (UNIFIED)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};

  // build navigation URL from payload
  let url = "/notifications";

  if (data.type === "BOOKING_REQUEST") {
    url = `/availableBooking?bookingId=${data.bookingId}`;
  }

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      // try to focus existing tab
      for (const client of clients) {
        client.focus();

        client.postMessage({
          type: "NAVIGATE",
          url,
        });

        return;
      }

      // fallback open new tab
      return self.clients.openWindow(url);
    })()
  );
});