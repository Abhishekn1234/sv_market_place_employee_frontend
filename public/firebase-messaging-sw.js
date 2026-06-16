/* =========================
   IMPORT CONFIG
========================= */

importScripts("./firebase-config.js");

importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js"
);

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
   ROUTE DECIDER
========================= */

function getSmartRoute(data = {}) {
  const type = data?.type;
  const status = data?.status;
  const bookingId = data?.bookingId;

  console.log("📍 Route Decision:", {
    type,
    status,
    bookingId,
  });

  /**
   * PAYMENT RELATED
   * ALWAYS GO TO NOTIFICATIONS
   */
  if (
    [
      "PAID",
      "INVOICE_GENERATED",
      "PAYMENT_PENDING",
      "COMPLETED",
    ].includes(status)
  ) {
    return "/notifications";
  }

  /**
   * CHAT
   */
  if (
    type === "CHAT_MESSAGE" ||
    type === "NEW_MESSAGE"
  ) {
    return bookingId
      ? `/chat/${bookingId}`
      : "/notifications";
  }

  /**
   * NEW BOOKING REQUEST
   */
  if (
    type === "BOOKING_REQUEST" ||
    status === "REQUESTED"
  ) {
    return bookingId
      ? `/availableBooking?status=requested&bookingId=${bookingId}`
      : "/availableBooking?status=requested";
  }

  /**
   * WORK UPDATES
   * NOTE:
   * PAID status already returned above,
   * so it will never reach here.
   */
  if (
    type === "BOOKING_UPDATE" ||
    type === "BOOKING_UPDATED" ||
    status === "WORKER_ACCEPTED"
  ) {
    return bookingId
      ? `/availableWork?bookingId=${bookingId}`
      : "/availableWork";
  }

  /**
   * DEFAULT
   */
  return "/notifications";
}

/* =========================
   SHOW NOTIFICATION
========================= */

function showNotification(
  data,
  notification,
  messageId
) {
  const url = getSmartRoute(data);

  const title =
    notification?.title ||
    data?.title ||
    "Notification";

  const body =
    notification?.body ||
    data?.body ||
    "You have a new update";

  const tag =
    messageId ||
    data?.messageId ||
    data?.bookingId ||
    "general";

  console.log("🚀 Final Route:", url);

  return self.registration.showNotification(
    title,
    {
      body,
      icon: "/icon.png",
      badge: "/icon.png",
      requireInteraction: true,
      tag,
      data: {
        url,
        type: data?.type,
        status: data?.status,
        bookingId: data?.bookingId,
        messageId:
          messageId || data?.messageId,
      },
    }
  );
}

/* =========================
   BACKGROUND MESSAGE
========================= */

messaging.onBackgroundMessage(
  async (payload) => {
    console.log(
      "━━━━━━━━━━━━━━━━━━━━━━"
    );
    console.log(
      "🔥 FIREBASE MESSAGE RECEIVED"
    );
    console.log(
      "━━━━━━━━━━━━━━━━━━━━━━"
    );

    console.log("📩 RAW PAYLOAD:", payload);
    console.log("📦 DATA:", payload?.data);
    console.log(
      "🔔 NOTIFICATION:",
      payload?.notification
    );

    const data = payload?.data || {};
    const notification =
      payload?.notification || {};
    const messageId = payload?.messageId;

    const clientsArr =
      await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

    const isForeground =
      clientsArr.some(
        (client) =>
          client.visibilityState ===
          "visible"
      );

    console.log(
      "👀 Foreground Active:",
      isForeground
    );

    if (isForeground) {
      console.log(
        "⏭️ Skipping notification (foreground)"
      );
      return;
    }

    await showNotification(
      data,
      notification,
      messageId
    );
  }
);

/* =========================
   NOTIFICATION CLICK
========================= */

self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    const data =
      event.notification.data || {};

    const url =
      data.url ||
      getSmartRoute(data) ||
      "/notifications";

    console.log(
      "🔔 Notification Clicked"
    );
    console.log("📍 Redirect URL:", url);

    event.waitUntil(
      (async () => {
        const clientsArr =
          await self.clients.matchAll({
            type: "window",
            includeUncontrolled: true,
          });

        const sameOriginClients =
          clientsArr.filter(
            (client) => {
              try {
                return (
                  new URL(client.url)
                    .origin ===
                  self.location.origin
                );
              } catch {
                return false;
              }
            }
          );

        if (
          sameOriginClients.length > 0
        ) {
          const client =
            sameOriginClients.find(
              (c) => c.focused
            ) ||
            sameOriginClients[0];

          await client.focus();

          client.postMessage({
            type: "NAVIGATE",
            isUserAction: true,
            url,
            status: data.status,
            bookingId:
              data.bookingId,
          });

          return;
        }

        const targetUrl = new URL(
          url,
          self.location.origin
        ).href;

        await self.clients.openWindow(
          targetUrl
        );
      })()
    );
  }
);