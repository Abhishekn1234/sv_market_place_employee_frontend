import { toast } from "react-toastify";

// Webpushr notification
export function sendWebpushrNotification(title: string, body: string, url: string) {
  if (typeof window !== "undefined" && typeof webpushr !== "undefined") {
    webpushr("sendNotification", {
      title,
      message: body,
      url,
      icon: "/logo.png",
      requireInteraction: true,
    });
  }
}

// Combined notification: toast + webpushr
export function notifyUser(title: string, body: string, url: string, inApp = true, background = true) {
  if (inApp && typeof window !== "undefined") toast.info(`${title}: ${body}`);
  if (background) sendWebpushrNotification(title, body, url);
}
