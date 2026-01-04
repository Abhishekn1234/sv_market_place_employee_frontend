self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data;

  if (event.action === "update") {
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
        if (clientsArr.length > 0) {
          clientsArr[0].postMessage({
            type: "NAVIGATE",
            payload: { url: data.url, tab: data.tab, skipNotification: true },
          });
          clientsArr[0].focus();
        } else {
          clients.openWindow(data.url);
        }
      })
    );
  } else if (event.action === "close") {
    // Just close the notification
  } else {
    // Clicked on body
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
        if (clientsArr.length > 0) {
          clientsArr[0].focus();
        } else {
          clients.openWindow(data.url);
        }
      })
    );
  }
});
