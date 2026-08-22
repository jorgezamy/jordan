importScripts("https://www.gstatic.com/firebasejs/12.13.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.13.0/firebase-messaging-compat.js");

// NEXT_PUBLIC_* values are already exposed client-side, hardcoding here is not a new exposure.
firebase.initializeApp({
  apiKey: "AIzaSyClLfs7YP6Cvdcz1-FMVsb60RUEDemqxSQ",
  authDomain: "jordan-85626.firebaseapp.com",
  projectId: "jordan-85626",
  storageBucket: "jordan-85626.firebasestorage.app",
  messagingSenderId: "54302587465",
  appId: "1:54302587465:web:9e200fe151a4bf806d9d98",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? "Centro Cristiano Jordán", {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-192.png",
    data: payload.data,
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = event.notification.data?.link ?? "/peticiones";
  event.waitUntil(clients.openWindow(link));
});
