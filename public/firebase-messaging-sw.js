// firebase-messaging-sw.js

importScripts("./firebase-config.js");

importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js"
);

firebase.initializeApp(self.FIREBASE_CONFIG);

const messaging = firebase.messaging();

const channel = new BroadcastChannel("fcm_channel");

// ✅ TAKE CONTROL IMMEDIATELY
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// ✅ FORCE UPDATE
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
function getNotificationContent(data) {
  const base = {
    title: "Notification",
    body: "You have a new update",
    url: "/notifications",
  };

  const map = {
    NEW_MESSAGE: {
      title: "New chat message",
      body: "You received a new message in chat",
      url: `/chat/${data.bookingId}`,
    },

    BOOKING_REQUEST: {
      title: "New booking request",
      body: "Tap to view booking",
      url: `/availableWork`,
    },

    WORK_ASSIGNED: {
      title: "Work assigned",
      body: "A new work has been assigned",
      url: `/currentWork`,
    },

    BOOKING_UPDATED: {
      title: "Booking updated",
      body: "Booking status updated",
      url: `/availableBooking?bookingId=${data.bookingId}`,
    },
  };

  return map[data.type] || base;
}
// ✅ BACKGROUND MESSAGE
messaging.onBackgroundMessage((payload) => {
  const data = payload?.data;
  if (!data) return;

  const { title, body, url } = getNotificationContent(data);

  self.registration.showNotification(title, {
    body,
    icon: "/icon.jpg",
    badge: "/icon.jpg",
    requireInteraction: true,
    actions: [
      { action: "open", title: "Open" }
    ],
    data: {
      url,
      type: data.type,
      bookingId: data.bookingId,
    },
  });
});

// ✅ CLICK HANDLER
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};

  let url = data.url || "/notifications";

  if (event.action === "open") {
    url = data.url;
  }

  event.waitUntil(
    (async () => {
      const clientsArr = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clientsArr) {
        client.focus();

        client.postMessage({
          type: "NAVIGATE",
          url,
        });

        return;
      }

      return self.clients.openWindow(url);
    })()
  );
});