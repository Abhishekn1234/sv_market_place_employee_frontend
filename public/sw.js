self.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "LOCATION_CHANGED") return;

  const { lat, lng } = event.data.payload || {};
  if (!lat || !lng) return;

  self.registration.showNotification("Location Changed", {
    body: "Your location was updated",
    tag: "location-update",
    renotify: true,
    requireInteraction: true,
    actions: [
      { action: "update", title: "Update" },
      { action: "close", title: "Close" },
    ],
    data: {
      lat,
      lng,
      url: "/settings/profile",
    },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") {
    // Do nothing – just close
    return;
  }

  if (event.action === "update") {
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        // Focus existing tab if open
        for (const client of clientList) {
          if ("focus" in client) {
            client.focus();
            client.postMessage({
              type: "FROM_NOTIFICATION",
              payload: event.notification.data,
            });
            return;
          }
        }

        // Otherwise open new tab
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
    );
  }
});
