export function showBrowserNotification(
  title: string,
  body: string,
  bookingId: string
) {
  try {
    if (!("Notification" in window)) return;

    if (Notification.permission !== "granted")
      return;

    const notification = new Notification(
      title,
      {
        body,
        icon: "/logo.png",
        tag: bookingId,
      }
    );

    notification.onclick = () => {
      window.focus();

      window.dispatchEvent(
        new CustomEvent("open-chat", {
          detail: {
            bookingId,
          },
        })
      );

      notification.close();
    };
  } catch (err) {
    console.log(err);
  }
}