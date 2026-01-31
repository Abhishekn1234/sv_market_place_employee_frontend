// sw-registration.ts
export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered:", registration);

      // Optional: force page to be controlled immediately
      if (navigator.serviceWorker.controller) {
        console.log("Page controlled by SW");
      } else {
        console.log("Waiting for SW to take control");
        navigator.serviceWorker.ready.then(() => console.log("SW ready!"));
      }
    } catch (err) {
      console.error("SW registration failed:", err);
    }
  }
}
