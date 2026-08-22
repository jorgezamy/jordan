export const TOPICS = {
  peticiones: "nuevas-peticiones",
  avisos: "nuevos-avisos",
  citas: "nueva-cita-biblica",
} as const;

export type Topic = (typeof TOPICS)[keyof typeof TOPICS];

// Payload sent to FCM's Admin SDK, not resolved by a service worker — needs absolute URLs.
// A top-level `notification` payload (used by every /api/*/notify route) makes Android
// auto-display the push without ever running firebase-messaging-sw.js's onBackgroundMessage,
// so the icon has to be set here for it to show up instead of a generated placeholder avatar.
export const NOTIFICATION_ICON_URL = "https://www.centrocristianojordan.com/icons/icon-192.png";
export const NOTIFICATION_BADGE_URL = "https://www.centrocristianojordan.com/icons/badge-192.png";

export function esTopicValido(topic: unknown): topic is Topic {
  return typeof topic === "string" && (Object.values(TOPICS) as string[]).includes(topic);
}

export const PREF_SONIDO_KEY = "notif-sonido";
export const PREF_VIBRACION_KEY = "notif-vibracion";

export function leerPrefBooleana(key: string, defecto: boolean): boolean {
  if (typeof window === "undefined") return defecto;
  const valor = window.localStorage.getItem(key);
  return valor === null ? defecto : valor === "1";
}

export function guardarPrefBooleana(key: string, valor: boolean) {
  window.localStorage.setItem(key, valor ? "1" : "0");
}
