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

const OBJECT_TEXT_PATTERN = /\[?object[\s,]+Object\]?/gi;

const TEXT_KEYS = [
  "en",
  "EN",
  "ar",
  "AR",
  "hi",
  "HI",
  "name",
  "displayName",
  "serviceName",
  "serviceTitle",
  "label",
  "title",
  "titles",
  "message",
  "messages",
  "body",
  "text",
  "description",
];

function isObject(value) {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function resolveText(value) {
  if (value == null) return "";

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return resolveText(JSON.parse(trimmed));
      } catch {
        return value;
      }
    }

    return value;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map(resolveText)
      .filter(Boolean)
      .join(", ");
  }

  if (!isObject(value)) return "";

  for (const key of TEXT_KEYS) {
    const text = resolveText(value[key]);
    if (text) return text;
  }

  for (const nestedValue of Object.values(value)) {
    const text = resolveText(nestedValue);
    if (text) return text;
  }

  return "";
}

function getServiceName(data = {}) {
  const booking = isObject(data.booking)
    ? data.booking
    : {};
  const bookingDetails = isObject(data.bookingDetails)
    ? data.bookingDetails
    : {};

  const sources = [
    data.serviceName,
    data.serviceTitle,
    data.service_title,
    data.service_name,
    data.service,
    data.serviceCategory,
    data.service_category,
    data.category,
    booking.serviceName,
    booking.serviceTitle,
    booking.service_title,
    booking.service_name,
    booking.service,
    booking.serviceCategory,
    booking.service_category,
    booking.category,
    bookingDetails.serviceName,
    bookingDetails.serviceTitle,
    bookingDetails.service_title,
    bookingDetails.service_name,
    bookingDetails.service,
    bookingDetails.serviceCategory,
    bookingDetails.service_category,
    bookingDetails.category,
  ];

  for (const source of sources) {
    const text = resolveText(source);
    if (text) return text;
  }

  return "";
}

function formatText(value, fallback, data = {}) {
  const text = resolveText(value) || fallback;

  if (!OBJECT_TEXT_PATTERN.test(text)) {
    return text;
  }

  OBJECT_TEXT_PATTERN.lastIndex = 0;
  return text
    .replace(
      OBJECT_TEXT_PATTERN,
      getServiceName(data) || fallback
    )
    .trim();
}

function showNotification(
  data,
  notification,
  messageId
) {
  const url = getSmartRoute(data);

  const title = formatText(
    notification?.title || data?.title,
    "Notification",
    data
  );

  const body = formatText(
    notification?.body ||
      data?.body ||
      data?.message,
    "You have a new update",
    data
  );

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
