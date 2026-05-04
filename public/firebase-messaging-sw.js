importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyChCuX9ZrzrZUmeSc7WO-3Nalq8t84Yjyo",
  authDomain: "sv-marketplace-46503.firebaseapp.com",
  projectId: "sv-marketplace-46503",
  messagingSenderId: "118069674424",
  appId: "1:118069674424:web:c21a0a1edbb9e808a94f4d",
});

const messaging = firebase.messaging();

// 📩 Background Notification
messaging.onBackgroundMessage((payload) => {
  const title =
    payload?.notification?.title ||
    payload?.data?.title ||
    "New Notification";

  const body =
    payload?.notification?.body ||
    payload?.data?.body ||
    "You have a new update";

  const url = payload?.data?.url || "/notifications";

  self.registration.showNotification(title, {
    body,
    icon: "/logo.png",
    actions: [
      {
        action: "open",
        title: "Open",
      },
    ],
    data: { url },
    vibrate: [200, 100, 200],
    requireInteraction: true,
  });
});

// 🔔 CLICK HANDLING (IMPORTANT FIX)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/notifications";

  event.waitUntil(
    (async () => {
      const clientsArr = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      // If "Open" button clicked
      if (event.action === "open") {
        for (const client of clientsArr) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }

        return clients.openWindow(url);
      }

      // Default click anywhere on notification
      return clients.openWindow(url);
    })()
  );
});