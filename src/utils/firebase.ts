// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB0R9QElkDcytB6oyDqEG-03A0Sb0RUy70",
  authDomain: "message-notification-c0d8c.firebaseapp.com",
  projectId: "message-notification-c0d8c",
  storageBucket: "message-notification-c0d8c.firebasestorage.app",
  messagingSenderId: "1041446819156",
  appId: "1:1041446819156:web:f8d483d90677a2d85124c1",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// 🔑 Your VAPID PUBLIC KEY (from Firebase console)
const VAPID_KEY =
  "BGD7626gbXEFTFV-qEQ-zQuccVdV_uCxKbVsvJNE7TkzmudBW3CFDn04XKLDjq42_qUEAl4UxfQt3XqUdPlRLRg";

/** Request permission & get FCM token */
export async function requestFcmToken() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: await navigator.serviceWorker.ready,
  });

  if (token) {
    localStorage.setItem("fcmToken", token);
    console.log("FCM TOKEN:", token);
  }

  return token;
}

/** Foreground messages */
export function listenForeground(cb: (payload: any) => void) {
  onMessage(messaging, cb);
}
