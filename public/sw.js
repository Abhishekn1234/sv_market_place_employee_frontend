self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      if (clientsArr.length > 0) {
        const client =
          clientsArr.find(c => c.visibilityState === "visible") || clientsArr[0];

        client.postMessage({
          type: "NAVIGATE",
          payload: { url: data.url, tab: data.tab }
        });

        return client.focus();
      }
      return clients.openWindow(data.url || "/");
    })
  );
});
