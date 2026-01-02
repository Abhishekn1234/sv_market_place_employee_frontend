self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "update") {
    // handle update click
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        client.postMessage({ type: "UPDATE_LOCATION", payload: { loc: null, placeName: null } });
        client.focus();
        return;
      }
      clients.openWindow("/settings/profile");
    });
  } else if (event.action === "close") {
    // just close notification
  } else {
    // click outside buttons
    const url = event.notification.data?.url || "/";
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
        for (const client of clientsArr) {
          if (client.url.includes(url)) return client.focus();
        }
        return clients.openWindow(url);
      })
    );
  }
});
