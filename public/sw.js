self.addEventListener("message", (event) => {
  if (event.data?.type === "LOCATION_NOTIFICATION") {
    const { title, body, placeName } = event.data.payload;

    self.registration.showNotification(title, {
      body,
      tag: "location-change",
      requireInteraction: true,
      actions: [
        { action: "update", title: "Update" },
        { action: "close", title: "Close" },
      ],
      data: { placeName }, // store placeName in notification data
    });

    // Send placeName to all clients to update localStorage
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

  // Update all clients again on click
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

  // Open Profile page directly on Location tab
  if (event.action === "update" || !event.action) {
    event.waitUntil(
      clients.openWindow("/settings/profile?tab=location")
    );
  }
});
