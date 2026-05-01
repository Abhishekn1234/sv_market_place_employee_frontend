importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

// 🔥 Firebase config (MUST MATCH FRONTEND PROJECT)
firebase.initializeApp({
  apiKey: "AIzaSyChCuX9ZrzrZUmeSc7WO-3Nalq8t84Yjyo",
  authDomain: "sv-marketplace-46503.firebaseapp.com",
  projectId: "sv-marketplace-46503",
  messagingSenderId: "118069674424",
  appId: "1:118069674424:web:c21a0a1edbb9e808a94f4d",
});

const messaging = firebase.messaging();


// ============================
// 📩 BACKGROUND MESSAGE
// ============================
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message:", payload);

  const title =
    payload?.notification?.title ||
    payload?.data?.title ||
    "New Notification";

  const options = {
    body:
      payload?.notification?.body ||
      payload?.data?.body ||
      "",

    icon: "/logo.png",

    data: {
      url: payload?.data?.url || "/",
    },

    vibrate: [200, 100, 200],
    requireInteraction: true,
  };

  self.registration.showNotification(title, options);
});


// ============================
// 🔔 CLICK HANDLING
// ============================
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification?.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      // Try focus existing tab
      for (const client of clientsArr) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }

      // Otherwise open new tab
      return clients.openWindow(url);
    })
  );
});