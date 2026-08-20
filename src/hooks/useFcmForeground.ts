"use client";

import { useEffect } from "react";
import { app } from "../../firebaseConfig";
import { PREF_SONIDO_KEY, PREF_VIBRACION_KEY, leerPrefBooleana } from "../lib/fcm";

function reproducirSonido() {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.3);
  } catch (error) {
    console.error("❌ Error reproduciendo sonido:", error);
  }
}

/**
 * Muestra una notificación local cuando llega un push de cualquier tema
 * mientras la app está en primer plano. Se monta una sola vez a nivel
 * global (no por tema) para no duplicar avisos cuando hay varias
 * suscripciones activas a la vez.
 *
 * Sonido y vibración solo pueden controlarse aquí (primer plano) — un
 * push en segundo plano lo muestra el sistema operativo, que ignora
 * estas preferencias.
 */
export function useFcmForeground() {
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    let unsubscribe: (() => void) | undefined;

    import("firebase/messaging").then(async ({ getMessaging, onMessage, isSupported }) => {
      if (!(await isSupported())) return;

      const messaging = getMessaging(app);
      unsubscribe = onMessage(messaging, (payload) => {
        const { title, body } = payload.notification ?? {};
        if (!title) return;

        new Notification(title, { body, icon: "/icons/icon-192.png" });

        if (leerPrefBooleana(PREF_VIBRACION_KEY, true) && "vibrate" in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
        if (leerPrefBooleana(PREF_SONIDO_KEY, true)) {
          reproducirSonido();
        }
      });
    });

    return () => unsubscribe?.();
  }, []);
}
