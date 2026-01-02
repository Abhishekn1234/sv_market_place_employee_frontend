// Service Worker for Firebase Cloud Messaging
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB0R9QElkDcytB6oyDqEG-03A0Sb0RUy70",
  authDomain: "message-notification-c0d8c.firebaseapp.com",
  projectId: "message-notification-c0d8c",
  messagingSenderId: "1041446819156",
  appId: "1:1041446819156:web:f8d483d90677a2d85124c1",
});

const messaging = firebase.messaging();

// Background notifications
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/logo.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    data: { url: payload.notification.click_action || '/' },
  });
});

// Notification click handling
// Inside firebase-messaging-sw.js
self.addEventListener('push', event => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/logo.png',
      data: { url: data.url },
    })
  );
});

