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
      body: notification?.body || data?.body || data?.message || "You received a new admin message",
      url: "/notifications",
    },
  };

  const result = map[type] || base;

  // If this is a booking notification with REQUESTED status, route to availableBooking
  if (
    (type === "BOOKING_REQUEST" || type === "BOOKING_UPDATE" || type === "BOOKING_UPDATED") &&
    data.status === "REQUESTED"
  ) {
    result.url = `/availableBooking?status=requested&bookingId=${bookingId}`;
  }

  // Admin messages (and defaults) keep notifications page
  if (type === "ADMIN_MESSAGE" || !type) {
    result.url = data?.url || "/notifications";
  }

  return result;
}

/* =========================
   SHOW NOTIFICATION
========================= */

function showNotification(data, notification, messageId) {
  const { title, body, url } = getNotificationContent(data, notification);

  // ✅ Use messageId as the tag. 
  // If the payload has a 'notification' block, the browser shows a native one automatically.
  // By using the same messageId as tag, this manual showNotification (with buttons) 
  // will REPLACE the default browser one instead of creating a second card.
  const tag = messageId || data.messageId || data.bookingId || "general";

  return self.registration.showNotification(title, {
    body,
    icon: "/icon.png",
    badge: "/icon.png",
    requireInteraction: true,
    renotify: false,
    tag,
    actions: [
      { action: "open", title: "Open" },
      { action: "close", title: "Close" },
    ],
    data: {
      url,
      type: data.type,
      bookingId: data.bookingId,
      messageId: messageId || data.messageId,
    },
  });
}

/* =========================
   BACKGROUND MESSAGES (FCM)
========================= */
messaging.onBackgroundMessage((payload) => {
  const data = payload?.data || {};
  const notification = payload?.notification || {};
  const messageId = payload?.messageId;

  // ✅ Check if app is in foreground to avoid showing native notification 
  // when the In-App FloatingNotification is already showing.
  self.clients
    .matchAll({ type: "window", includeUncontrolled: true })
    .then((clients) => {
      const isForeground = clients.some((client) => client.focused);

      if (isForeground) {
        console.log("⏭️ App is in foreground, skipping native notification.");
        return;
      }

      console.log("📥 Background Message Received, showing native notification:", messageId);
      showNotification(data, notification, messageId);
    });
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
      if (event.action === "close") return;

      const clientsArr = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clientsArr) {
        if ("focus" in client) {
          await client.focus();

          // Check if client is already on the target page
          const clientUrl = new URL(client.url).pathname;
          let targetPath = "/notifications";
          try {
            targetPath = new URL(url, self.location.origin).pathname;
          } catch (e) {}

          if (!clientUrl.includes(targetPath)) {
            client.postMessage({
              type: "NAVIGATE",
              isUserAction: true,
              url,
            });
          }

          return;
        }
      }

      await self.clients.openWindow(url);
    })()
  );
});