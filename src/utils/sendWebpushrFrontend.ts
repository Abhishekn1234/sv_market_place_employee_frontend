// src/utils/sendWebpushrFrontend.ts
export async function sendWebpushrNotificationFrontend(title: string, message: string, url: string) {
  const API_KEY = "bdb169c92f494baf19617356cc54776b"; // Your Webpushr Key
  const AUTH_TOKEN = "117379"; // Your Webpushr Auth Token

  const body = {
    title: title,
    message: message,
    target_url: url,
    action_buttons: [
      { title: "Open App", url },
    ],
  };

  try {
    const res = await fetch("https://api.webpushr.com/v1/notification/send/all", {
      method: "POST",
      headers: {
        "webpushrKey": API_KEY,
        "webpushrAuthToken": AUTH_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("Notification response:", data);
    return data;
  } catch (err) {
    console.error("Failed to send notification:", err);
  }
}
