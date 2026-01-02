self.addEventListener("message", (event) => {
  if (event.data?.type === "LOCATION_NOTIFICATION") {
    const { title, body, placeName } = event.data.payload;

    // Show notification instantly
    self.registration.showNotification(title, {
      body,
      tag: "location-change",
      requireInteraction: true,
      actions: [
        { action: "update", title: "Update" },
        { action: "close", title: "Close" },
      ],
      data: { placeName },
    });

    // Update all clients immediately
    if (placeName) {
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsList) => {
        clientsList.forEach((client) => {
          client.postMessage({
            type: "UPDATE_LAST_NOTIFIED_LOCATION",
            payload: { placeName },
          });
        });
      });
    }
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const placeName = event.notification.data?.placeName;

  if (placeName) {
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsList) => {
      clientsList.forEach((client) => {
        client.postMessage({
          type: "UPDATE_LAST_NOTIFIED_LOCATION",
          payload: { placeName },
        });
      });
    });
  }

  if (event.action === "update" || !event.action) {
    event.waitUntil(clients.openWindow("/settings/profile?tab=location"));
  }
});

