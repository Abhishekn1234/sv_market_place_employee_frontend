importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

// ✅ USE ONLY THIS PROJECT (same as your frontend)
firebase.initializeApp({
  apiKey: "AIzaSyChCuX9ZrzrZUmeSc7WO-3Nalq8t84Yjyo",
  authDomain: "sv-marketplace-46503.firebaseapp.com",
  projectId: "sv-marketplace-46503",
  messagingSenderId: "118069674424",
  appId: "1:118069674424:web:c21a0a1edbb9e808a94f4d",
});

const messaging = firebase.messaging();

// ✅ Background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
    data: payload.data,
  });
});

// ✅ Click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification?.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      const hadWindow = clientsArr.some((windowClient) => {
        if (windowClient.url.includes(url)) {
          windowClient.focus();
          return true;
        }
        return false;
      });

      if (!hadWindow) {
        clients.openWindow(url);
      }
    })
  );
});