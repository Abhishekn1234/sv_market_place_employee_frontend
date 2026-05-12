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

// ✅ BACKGROUND MESSAGE
messaging.onBackgroundMessage(async (payload) => {
  console.log("📩 Background message:", payload);

  if (!payload?.data) return;

  const data = payload.data;

  const title =
    data.title || "New Notification";

  const body =
    data.body || "You have a new update";

  // ✅ UNIQUE TAG
  const tag =
    data.notificationId ||
    `${Date.now()}-${Math.random()}`;

  // ✅ ROUTE
  let url = "/notifications";

  switch (data.type) {
    case "BOOKING_REQUEST":
      url = `/availableBooking?bookingId=${data.bookingId}`;
      break;

    case "NEW_MESSAGE":
      url = `/chat/${data.bookingId}`;
      break;

    case "WORK_ASSIGNED":
      url = `/currentWork`;
      break;

    default:
      url = "/notifications";
  }

  // ✅ ACTION BUTTONS
  let actions = [];

  switch (data.type) {
    case "BOOKING_REQUEST":
      actions = [
        {
          action: "open_booking",
          title: "Open Booking",
        },
      ];
      break;

    case "NEW_MESSAGE":
      actions = [
        {
          action: "open_chat",
          title: "Open Chat",
        },
      ];
      break;

    case "WORK_ASSIGNED":
      actions = [
        {
          action: "open_work",
          title: "Open Work",
        },
      ];
      break;

    default:
      actions = [
        {
          action: "open_notifications",
          title: "Open",
        },
      ];
  }

  // ✅ SHOW NOTIFICATION
  self.registration.showNotification(title, {
    body,

    icon: "/icon.jpg",
    badge: "/icon.jpg",

    requireInteraction: true,

    tag,

    renotify: true,

    actions,

    data: {
      ...data,
      url,
    },
  });
});

// ✅ CLICK HANDLER
self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    const data =
      event.notification.data || {};

    let url =
      data.url || "/notifications";

    // ✅ BUTTON CLICK
    switch (event.action) {
      case "open_booking":
        url = `/availableBooking?bookingId=${data.bookingId}`;
        break;

      case "open_chat":
        url = `/chat/${data.bookingId}`;
        break;

      case "open_work":
        url = `/currentWork`;
        break;

      default:
        break;
    }

    event.waitUntil(
      (async () => {
        const clientsArr =
          await self.clients.matchAll({
            type: "window",
            includeUncontrolled: true,
          });

        // ✅ EXISTING TAB
        for (const client of clientsArr) {
          await client.focus();

          client.postMessage({
            type: "NAVIGATE",
            url,
          });

          channel.postMessage({
            type: "NAVIGATE",
            url,
          });

          return;
        }

        // ✅ NEW TAB
        return self.clients.openWindow(url);
      })()
    );
  }
);