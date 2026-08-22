"use client";

import { useCallback, useEffect, useState } from "react";
import { app } from "../../firebaseConfig";
import { Topic } from "../lib/fcm";

type FcmStatus = "unsupported" | "idle" | "subscribing" | "subscribed" | "error";

const STORAGE_KEY = "fcm-topics-suscritos";

// Cada useFcm(topic) solo lee localStorage al montar — sin esto, si otra
// instancia (ej. la suscripción automática al abrir la app, montada en el
// header) termina de activar un tema DESPUÉS de que Configuración ya
// montó, esa pantalla se queda mostrando el switch apagado aunque en el
// fondo sí quedó activo. localStorage's "storage" event no sirve porque
// solo dispara entre pestañas distintas, no dentro de la misma app.
const TOPICS_CHANGED_EVENT = "fcm-topics-cambiaron";

function leerTopicsSuscritos(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function guardarTopicSuscrito(topic: Topic, suscrito: boolean) {
  const actuales = new Set(leerTopicsSuscritos());
  if (suscrito) actuales.add(topic);
  else actuales.delete(topic);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...actuales]));
  window.dispatchEvent(new Event(TOPICS_CHANGED_EVENT));
}

export function useFcm(topic: Topic) {
  const [status, setStatus] = useState<FcmStatus>("idle");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setStatus("unsupported");
      return;
    }

    const sincronizar = () => {
      const suscrito = Notification.permission === "granted" && leerTopicsSuscritos().includes(topic);

      setStatus((actual) => {
        if (actual === "subscribing") return actual;
        if (suscrito) return "subscribed";
        return actual === "subscribed" ? "idle" : actual;
      });
    };

    sincronizar();
    window.addEventListener(TOPICS_CHANGED_EVENT, sincronizar);
    return () => window.removeEventListener(TOPICS_CHANGED_EVENT, sincronizar);
  }, [topic]);

  const subscribe = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setStatus("unsupported");
      return false;
    }

    setStatus("subscribing");
    try {
      const { getMessaging, getToken, isSupported } = await import("firebase/messaging");

      if (!(await isSupported())) {
        setStatus("unsupported");
        return false;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("idle");
        return false;
      }

      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (!token) {
        setStatus("error");
        return false;
      }

      const res = await fetch("/api/fcm/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, topic }),
      });

      if (!res.ok) {
        setStatus("error");
        return false;
      }

      guardarTopicSuscrito(topic, true);
      setStatus("subscribed");
      return true;
    } catch (error) {
      console.error("❌ Error al suscribirse a notificaciones:", error);
      setStatus("error");
      return false;
    }
  }, [topic]);

  const unsubscribe = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration("/firebase-messaging-sw.js");
      if (registration) {
        const { getMessaging, getToken } = await import("firebase/messaging");
        const messaging = getMessaging(app);
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (token) {
          await fetch("/api/fcm/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, topic }),
          });
        }
      }

      guardarTopicSuscrito(topic, false);
      setStatus("idle");
      return true;
    } catch (error) {
      console.error("❌ Error al cancelar la suscripción:", error);
      return false;
    }
  }, [topic]);

  return { status, subscribe, unsubscribe };
}
