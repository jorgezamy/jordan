"use client";

import { useCallback, useEffect, useState } from "react";
import { useFcm } from "../../hooks/useFcm";
import {
  PREF_SONIDO_KEY,
  PREF_VIBRACION_KEY,
  guardarPrefBooleana,
  leerPrefBooleana,
} from "../../lib/fcm";
import { SECCION_AVISOS, SECCION_CITAS, SECCION_PETICIONES } from "./constants";

export function useNotificationSettings() {
  const [sonido, setSonidoState] = useState(true);
  const [vibracion, setVibracionState] = useState(true);

  useEffect(() => {
    setSonidoState(leerPrefBooleana(PREF_SONIDO_KEY, true));
    setVibracionState(leerPrefBooleana(PREF_VIBRACION_KEY, true));
  }, []);

  const setSonido = useCallback((valor: boolean) => {
    setSonidoState(valor);
    guardarPrefBooleana(PREF_SONIDO_KEY, valor);
  }, []);

  const setVibracion = useCallback((valor: boolean) => {
    setVibracionState(valor);
    guardarPrefBooleana(PREF_VIBRACION_KEY, valor);
  }, []);

  const peticiones = useFcm(SECCION_PETICIONES.topic);
  const avisos = useFcm(SECCION_AVISOS.topic);
  const citas = useFcm(SECCION_CITAS.topic);

  const secciones = [
    { ...SECCION_PETICIONES, fcm: peticiones },
    { ...SECCION_AVISOS, fcm: avisos },
    { ...SECCION_CITAS, fcm: citas },
  ];

  const alternarSeccion = async (fcm: typeof peticiones) => {
    if (fcm.status === "subscribed") {
      await fcm.unsubscribe();
    } else {
      await fcm.subscribe();
    }
  };

  const fcms = [peticiones, avisos, citas];
  const todoActivo = fcms.every((fcm) => fcm.status === "subscribed");
  const todoDeshabilitado = fcms.some((fcm) => fcm.status === "subscribing" || fcm.status === "unsupported");

  const alternarTodo = async () => {
    if (todoActivo) {
      for (const fcm of fcms) {
        if (fcm.status === "subscribed") await fcm.unsubscribe();
      }
    } else {
      for (const fcm of fcms) {
        if (fcm.status !== "subscribed") await fcm.subscribe();
      }
    }
  };

  return {
    sonido,
    setSonido,
    vibracion,
    setVibracion,
    secciones,
    alternarSeccion,
    todoActivo,
    todoDeshabilitado,
    alternarTodo,
  };
}
