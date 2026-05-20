// firebase-messaging-sw.js

function getNotificationContent(data = {}, notification = {}) {
  const type = data.type;
  const bookingId = data.bookingId;
  const base = {
    title: notification.title || "Notification",
    body: notification.body || "You have a new update",
    url: "/notifications",
  };

  const map = {
    CHAT_MESSAGE: {
      title: notification.title || "New chat message",
      body: notification.body || "You received a new message in chat",
      url: `/chat/${bookingId}`,
    },

    NEW_MESSAGE: {
      title: notification.title || "New chat message",
      body: notification.body || "You received a new message in chat",
      url: `/chat/${bookingId}`,
    },

    BOOKING_REQUEST: {
      title: notification.title || "New booking request",
      body: notification.body || "Tap to view booking request",
      url: `/availableBooking?status=requested&bookingId=${bookingId}`,
    },

    BOOKING_UPDATE: {
      title: notification.title || "Booking status updated",
      body: notification.body || "Tap to view booking",
      url:
        data.status === "REQUESTED"
          ? `/availableBooking?status=requested&bookingId=${bookingId}`
          : `/availableBooking?bookingId=${bookingId}`,
    },

    BOOKING_UPDATED: {
      title: notification.title || "Booking status updated",
      body: notification.body || "Tap to view booking",
      url:
        data.status === "REQUESTED"
          ? `/availableBooking?status=requested&bookingId=${bookingId}`
          : `/availableBooking?bookingId=${bookingId}`,
    },

    WORK_ASSIGNED: {
      title: notification.title || "Work assigned",
      body: notification.body || "A new work has been assigned",
      url: "/currentWork",
    },
  };

  return map[type] || base;
}

function shouldHandlePush(data = {}, notification = {}) {
  const handledTypes = [
    "CHAT_MESSAGE",
    "NEW_MESSAGE",
    "BOOKING_REQUEST",
    "BOOKING_UPDATE",
    "BOOKING_UPDATED",
    "WORK_ASSIGNED",
  ];

  return (
    handledTypes.includes(data.type) ||
    notification.title === "New chat message" ||
    notification.title === "New booking request"
  );
}

function showActionNotification(data = {}, notification = {}) {
  const { title, body, url } = getNotificationContent(data, notification);

  return self.registration.showNotification(title, {
    body,
    icon: "/icon.jpg",
    badge: "/icon.jpg",
    requireInteraction: true,
    actions: [{ action: "open", title: "Open" }],
    tag: `${data.type || "notification"}-${data.bookingId || url}`,
    data: {
      url,
      type: data.type,
      bookingId: data.bookingId,
    },
  });
}

self.addEventListener("push", (event) => {
  let payload;
  try {
    payload = event.data?.json();
  } catch (_err) {
    return;
  }

  const data = payload?.data || {};
  const notification = payload?.notification || {};

  if (!payload?.notification || !shouldHandlePush(data, notification)) return;

  event.stopImmediatePropagation();
  event.waitUntil(showActionNotification(data, notification));
});

importScripts("./firebase-config.js");

importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js"
);

firebase.initializeApp(self.FIREBASE_CONFIG);

const messaging = firebase.messaging();

// Take control immediately.
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Force update.
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Background data-only messages still need the custom action notification.
messaging.onBackgroundMessage((payload) => {
  const data = payload?.data;
  if (!data || payload?.notification) return;

  showActionNotification(data, payload?.notification);
});

// Click handler.
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
