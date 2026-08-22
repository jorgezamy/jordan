"use client";

import { useEffect, useRef } from "react";
import { TOPICS } from "../lib/fcm";
import { useFcm } from "./useFcm";

/**
 * Al abrir la app, si el visitante nunca ha decidido sobre notificaciones
 * (Notification.permission === "default"), muestra el diálogo nativo del
 * sistema una sola vez. Si lo acepta, activa las tres secciones de una vez
 * — así no tiene que ir a Configuración a prenderlas manualmente.
 *
 * Si ya decidió (concedido o denegado en una visita anterior), no hace nada:
 * el navegador tampoco vuelve a mostrar el diálogo una vez que se denegó.
 */
export function useAutoSolicitarNotificaciones() {
  const peticiones = useFcm(TOPICS.peticiones);
  const avisos = useFcm(TOPICS.avisos);
  const citas = useFcm(TOPICS.citas);
  const yaIntentado = useRef(false);

  useEffect(() => {
    if (yaIntentado.current) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "default") return;

    yaIntentado.current = true;

    (async () => {
      // Se pide el permiso una sola vez, por separado, y se espera a que
      // quede resuelto antes de suscribir nada. Si en vez de esto se deja
      // que la primera llamada a subscribe() sea la que internamente pida
      // el permiso, en algunos Android hay una carrera de tiempos entre
      // que el usuario toca "Habilitar" y que esa misma llamada ve el
      // resultado — la primera sección (peticiones) se queda sin activar
      // mientras las siguientes sí, porque para ellas el permiso ya
      // estaba resuelto de sobra.
      const permiso = await Notification.requestPermission();
      if (permiso !== "granted") return;

      await peticiones.subscribe();
      await avisos.subscribe();
      await citas.subscribe();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
