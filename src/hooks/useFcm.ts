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

// Temas que alguna instancia (en cualquier parte de la app) está
// suscribiendo/desuscribiendo ahora mismo — vive en memoria del módulo,
// compartido por todas las instancias de useFcm dentro de la misma
// pestaña, para que puedan mostrarse como "cargando" entre sí en vez de
// solo "apagado" mientras el trabajo real todavía no termina.
const topicsEnCurso = new Set<string>();

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

function marcarEnCurso(topic: Topic, enCurso: boolean) {
  if (enCurso) topicsEnCurso.add(topic);
  else topicsEnCurso.delete(topic);
  window.dispatchEvent(new Event(TOPICS_CHANGED_EVENT));
}

// Temas ya re-registrados en esta pestaña desde que cargó la página —
// evita que dos instancias de useFcm(mismoTema) (ej. el auto-suscriptor
// del header y Configuración, montados a la vez) disparen el mismo
// re-registro por duplicado.
const topicsResuscritos = new Set<string>();

// FCM puede rotar el token del dispositivo de forma silenciosa
// (actualización del navegador, larga inactividad, etc.) sin que la app
// se entere: localStorage sigue diciendo "suscrito" y el permiso del
// navegador sigue "granted", pero la suscripción al tema en los
// servidores de FCM quedó apuntando a un token que ya nadie escucha. Un
// envío a ese tema no falla (topic messaging no reporta por-token), así
// que esto se ve como "antes llegaban, ahora ya no" sin ningún error en
// el servidor. Para autosanarlo, en cada carga se vuelve a pedir el
// token vigente y se re-registra contra el tema — subscribeToTopic es
// idempotente, así que si el token no cambió esto es un no-op.
async function resuscribirSilenciosamente(topic: Topic) {
  if (topicsResuscritos.has(topic)) return;
  topicsResuscritos.add(topic);

  try {
    const { getMessaging, getToken, isSupported } = await import("firebase/messaging");
    if (!(await isSupported())) return;

    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    if (!token) return;

    await fetch("/api/fcm/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, topic }),
    });
  } catch (error) {
    console.error("❌ Error re-suscribiendo en segundo plano:", error);
  }
}

export function useFcm(topic: Topic) {
  const [status, setStatus] = useState<FcmStatus>("idle");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setStatus("unsupported");
      return;
    }

    const sincronizar = () => {
      if (topicsEnCurso.has(topic)) {
        setStatus("subscribing");
        return;
      }

      const suscrito = Notification.permission === "granted" && leerTopicsSuscritos().includes(topic);

      setStatus((actual) => {
        if (suscrito) return "subscribed";
        return actual === "subscribed" || actual === "subscribing" ? "idle" : actual;
      });
    };

    sincronizar();
    window.addEventListener(TOPICS_CHANGED_EVENT, sincronizar);

    if (Notification.permission === "granted" && leerTopicsSuscritos().includes(topic)) {
      resuscribirSilenciosamente(topic);
    }

    return () => window.removeEventListener(TOPICS_CHANGED_EVENT, sincronizar);
  }, [topic]);

  const subscribe = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setStatus("unsupported");
      return false;
    }

    setStatus("subscribing");
    marcarEnCurso(topic, true);
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
    } finally {
      marcarEnCurso(topic, false);
    }
  }, [topic]);

  const unsubscribe = useCallback(async () => {
    setStatus("subscribing");
    marcarEnCurso(topic, true);
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
    } finally {
      marcarEnCurso(topic, false);
    }
  }, [topic]);

  return { status, subscribe, unsubscribe };
}
