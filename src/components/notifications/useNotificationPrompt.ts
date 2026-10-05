"use client";

import { useCallback } from "react";
import { useFcm } from "../../hooks/useFcm";
import { TOPICS } from "../../lib/fcm";

/**
 * El banner de Peticiones activa las tres secciones a la vez (no solo
 * peticiones) para que una sola decisión del visitante ("Activar
 * notificaciones") lo deje completamente suscrito, sin tener que encontrar
 * Configuración y prender Avisos/Citas por separado.
 */
export function useNotificationPrompt() {
  const peticiones = useFcm(TOPICS.peticiones);
  const avisos = useFcm(TOPICS.avisos);
  const citas = useFcm(TOPICS.citas);
  const fcms = [peticiones, avisos, citas];

  const unsupported = fcms.some((fcm) => fcm.status === "unsupported");
  const todoActivo = fcms.every((fcm) => fcm.status === "subscribed");
  const subscribing = fcms.some((fcm) => fcm.status === "subscribing");

  const activar = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    // Se pide el permiso una sola vez, por separado, antes de suscribir —
    // mismo orden que useAutoSolicitarNotificaciones, para evitar la carrera
    // donde la primera sección se queda sin activar en algunos Android.
    const permiso = await Notification.requestPermission();
    if (permiso !== "granted") return;

    for (const fcm of fcms) {
      if (fcm.status !== "subscribed") await fcm.subscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peticiones, avisos, citas]);

  return { unsupported, todoActivo, subscribing, activar };
}
