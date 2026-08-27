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

// Precacheados para que el ícono y el badge de la notificación se sirvan desde
// caché en vez de depender de la red justo cuando llega el push — sin esto,
// una descarga lenta o fallida del badge hace que Android muestre un cuadro
// blanco genérico en la barra de estatus en vez del logo monocromo.
const ICON_CACHE_NAME = "notif-icons-v1";
const ICON_PATHS = ["/icons/icon-192.png", "/icons/badge-192.png"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(ICON_CACHE_NAME).then((cache) => cache.addAll(ICON_PATHS)),
  );
});

self.addEventListener("fetch", (event) => {
  const path = new URL(event.request.url).pathname;
  if (ICON_PATHS.includes(path)) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached ?? fetch(event.request)),
    );
  }
});

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? "Centro Cristiano Jordán", {
    body,
    // Quitar "icon" no libera espacio: Chrome/Android genera un avatar
    // placeholder (círculo con letra) cuando falta, así que se deja el
    // logo real en vez de eso.
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
