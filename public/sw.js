self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const { action } = event;
  const data = event.notification.data;

  
  if (action === "close") {
    return; 
  }

  
  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

  
      for (const client of allClients) {
        if ("focus" in client) {
          client.postMessage({
            type: "NAVIGATE",
            payload: {
              url: data?.url,
              tab: data?.tab,
            },
          });

          return client.focus();
        }
      }

      
      if (clients.openWindow && data?.url) {
        return clients.openWindow(data.url);
      }
    })()
  );
});
