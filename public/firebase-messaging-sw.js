// firebase-messaging-sw.js

importScripts("./firebase-config.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

firebase.initializeApp(self.FIREBASE_CONFIG);
const messaging = firebase.messaging();

// 🔥 Background notification (ONLY PLACE SYSTEM NOTIFICATION IS SHOWN)
messaging.onBackgroundMessage(async (payload) => {
  console.log("📩 Background message:", payload);

  if (!payload?.data) return;

  const title = payload.data.title || "New Notification";
  const body = payload.data.body || "";
  const url = payload.data.url || "/notifications";

  const tag = `notif-${title}-${body}-${url}`;

  const existing = await self.registration.getNotifications();
  if (existing.some((n) => n.tag === tag)) return;

  self.registration.showNotification(title, {
    body,
    icon: "/icon.jpg",
    tag,
    data: { url },
    actions: [{ action: "open", title: "Open" }],
    requireInteraction: true,
  });
});

// 🔔 Click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/notifications";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if (client.url.includes(url)) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});