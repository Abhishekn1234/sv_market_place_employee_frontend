importScripts('./firebase-config.js');
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

firebase.initializeApp(self.FIREBASE_CONFIG);
const messaging = firebase.messaging();
let notificationQueue = [];

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message:", payload);

  // ✅ Handle both payload types
  const title =
    payload?.data?.title ||
    payload?.notification?.title ||
    "New Notification";

  const body =
    payload?.data?.body ||
    payload?.notification?.body ||
    "You have a new update";

  const url = payload?.data?.url || "/notifications";

  // 🚫 IMPORTANT: Skip duplicate if Firebase already showed one
  if (payload.notification) return;

  const key = title + body + url;

  if (notificationQueue.includes(key)) return;

  notificationQueue.push(key);
  if (notificationQueue.length > 2) notificationQueue.shift();

  const tag = `notif-${notificationQueue.length}`;

  self.registration.showNotification(title, {
    body,
    icon: "/icon.jpg",
    tag,
    requireInteraction: true,
    actions: [{ action: "open", title: "Open" }],
    data: { url },
  });
});

// 🔔 Click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/notifications";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});