"use client";

import { useCallback, useEffect, useState } from "react";
import { app } from "../../firebaseConfig";

type FcmStatus = "unsupported" | "idle" | "subscribing" | "subscribed" | "error";

export function useFcm() {
  const [status, setStatus] = useState<FcmStatus>("idle");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "granted") {
      setStatus("subscribed");
    }
  }, []);

  useEffect(() => {
    if (status !== "subscribed") return;

    let unsubscribe: (() => void) | undefined;

    import("firebase/messaging").then(({ getMessaging, onMessage }) => {
      const messaging = getMessaging(app);
      unsubscribe = onMessage(messaging, (payload) => {
        const { title, body } = payload.notification ?? {};
        if (title && Notification.permission === "granted") {
          new Notification(title, { body, icon: "/icons/icon-192.png" });
        }
      });
    });

    return () => unsubscribe?.();
  }, [status]);

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
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        setStatus("error");
        return false;
      }

      setStatus("subscribed");
      return true;
    } catch (error) {
      console.error("❌ Error al suscribirse a notificaciones:", error);
      setStatus("error");
      return false;
    }
  }, []);

  return { status, subscribe };
}
