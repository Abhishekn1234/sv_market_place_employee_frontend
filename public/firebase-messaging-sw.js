/* =========================
   IMPORT CONFIG
========================= */
importScripts("./firebase-config.js");

importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

firebase.initializeApp(self.FIREBASE_CONFIG);

const messaging = firebase.messaging();

/* =========================
   LIFECYCLE
========================= */

// Take control immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Skip waiting (hot update support)
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/* =========================
   ROUTING LOGIC
========================= */

function getNotificationContent(data = {}, notification = {}) {
  const type = data.type;
  const bookingId = data.bookingId;

  const base = {
    title: notification?.title || data?.title || "Notification",
    body: notification?.body || data?.body || "You have a new update",
    url: "/notifications",
  };

  const map = {
    CHAT_MESSAGE: {
      title: notification?.title || "New chat message",
      body: notification?.body || "You received a new message in chat",
      url: `/chat/${bookingId}`,
    },

    NEW_MESSAGE: {
      title: notification?.title || "New chat message",
      body: notification?.body || "You received a new message in chat",
      url: `/chat/${bookingId}`,
    },

    BOOKING_REQUEST: {
      title: "New booking request",
      body: "Tap to view booking request",
      url:
        data.status === "REQUESTED"
          ? `/availableBooking?status=requested&bookingId=${bookingId}`
          : `/availableWork?bookingId=${bookingId}`,
    },

    BOOKING_UPDATE: {
      title: "Booking status updated",
      body: "Tap to view booking",
      url:
        data.status === "REQUESTED"
          ? `/availableBooking?status=requested&bookingId=${bookingId}`
          : `/availableWork?bookingId=${bookingId}`,
    },

    BOOKING_UPDATED: {
      title: "Booking status updated",
      body: "Tap to view booking",
      url:
        data.status === "REQUESTED"
          ? `/availableBooking?status=requested&bookingId=${bookingId}`
          : `/availableWork?bookingId=${bookingId}`,
    },

    WORK_ASSIGNED: {
      title: "Work assigned",
      body: "A new work has been assigned",
      url: "/availableWork",
    },

    ADMIN_MESSAGE: {
      title: "Admin Message",
      body: notification?.body || data?.message || "You received a new admin message",
      url: "/notifications",
    },
  };

  return map[type] || base;
}

/* =========================
   SHOW NOTIFICATION
========================= */

function showNotification(data, notification) {
  const { title, body, url } = getNotificationContent(data, notification);

  return self.registration.showNotification(title, {
    body,
    icon: "/icon.png",
    badge: "/icon.png",
    requireInteraction: true,
    tag: `${data.type || "notification"}-${data.bookingId || url}`,
    data: {
      url,
      type: data.type,
      bookingId: data.bookingId,
    },
  });
}

/* =========================
   BACKGROUND MESSAGES (FCM)
========================= */

messaging.onBackgroundMessage((payload) => {
  const data = payload?.data || {};
  const notification = payload?.notification || {};

  showNotification(data, notification);
});

/* =========================
   CLICK HANDLER
========================= */

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  const url = data.url || "/notifications";

  event.waitUntil(
    (async () => {
      const clientsArr = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clientsArr) {
        if ("focus" in client) {
          await client.focus();

          client.postMessage({
            type: "NAVIGATE",
            url,
          });

          return;
        }
      }

      await self.clients.openWindow(url);
    })()
  );
});