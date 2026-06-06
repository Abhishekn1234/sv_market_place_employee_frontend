/* =========================
   IMPORT CONFIG
========================= */
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

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/* =========================
   ROUTE DECIDER (🔥 CORE FIX)
========================= */

function getSmartRoute(data = {}) {
  const type = data?.type;
  const status = data?.status;
  const bookingId = data?.bookingId;

  // CHAT
  if (type === "CHAT_MESSAGE" || type === "NEW_MESSAGE") {
    return `/chat/${bookingId}`;
  }

  // REQUESTED → AVAILABLE BOOKING
  if (type === "BOOKING_REQUEST" || status === "REQUESTED") {
    return `/availableBooking?status=requested&bookingId=${bookingId}`;
  }

  // BOOKING UPDATE → AVAILABLE WORK
  if (
    type === "BOOKING_UPDATE" ||
    type === "BOOKING_UPDATED" ||
    status === "WORKER_ACCEPTED"
  ) {
    return `/availableWork?bookingId=${bookingId}`;
  }

  // DEFAULT
  return "/notifications";
}

/* =========================
   SHOW NOTIFICATION
========================= */

function showNotification(data, notification, messageId) {
  const url = getSmartRoute(data);

  const title = notification?.title || data?.title || "Notification";
  const body = notification?.body || data?.body || "You have a new update";

  const tag = messageId || data.messageId || data.bookingId || "general";

  console.log("🚀 FINAL ROUTE:", url);

  return self.registration.showNotification(title, {
    body,
    icon: "/icon.png",
    badge: "/icon.png",
    requireInteraction: true,
    tag,
    data: {
      url,
      type: data.type,
      status: data.status,
      bookingId: data.bookingId,
      messageId: messageId || data.messageId,
    },
  });
}

/* =========================
   BACKGROUND MESSAGE
========================= */

messaging.onBackgroundMessage((payload) => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔥 FIREBASE MESSAGE RECEIVED");
  console.log("━━━━━━━━━━━━━━━━━━━━━━");

  console.log("📩 RAW PAYLOAD:", payload);
  console.log("📦 DATA:", payload?.data);
  console.log("🔔 NOTIFICATION:", payload?.notification);

  const data = payload?.data || {};
  const notification = payload?.notification || {};
  const messageId = payload?.messageId;

  console.log("🧠 PARSED:");
  console.log("type:", data?.type);
  console.log("status:", data?.status);
  console.log("bookingId:", data?.bookingId);

  self.clients
    .matchAll({ type: "window", includeUncontrolled: true })
    .then((clients) => {
      const isForeground = clients.some((c) => c.focused);

      console.log("👀 Foreground active:", isForeground);

      if (isForeground) {
        console.log("⏭️ Skipping notification (foreground)");
        return;
      }

      console.log("🚀 SHOWING NOTIFICATION");
      showNotification(data, notification, messageId);
    });
});

/* =========================
   CLICK HANDLER
========================= */

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  const url = getSmartRoute(data);

  console.log("🖱 CLICK EVENT");
  console.log("➡️ NAVIGATING TO:", url);

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

          client.postMessage({
            type: "NAVIGATE",
            isUserAction: true,
            url,
            status: data.status,
            bookingId: data.bookingId,
          });

          return;
        }
      }

      await self.clients.openWindow(url);
    })()
  );
});