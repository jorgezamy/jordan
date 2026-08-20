"use client";

import { useEffect, useState } from "react";
import { NOVEDADES_MAX_VECES, VERSION_NOVEDADES } from "./constants";

const STORAGE_KEY = "novedades-estado";

interface EstadoNovedades {
  version: string;
  veces: number;
  cerrado: boolean;
}

function leerEstado(): EstadoNovedades {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: "", veces: 0, cerrado: false };
    return JSON.parse(raw) as EstadoNovedades;
  } catch {
    return { version: "", veces: 0, cerrado: false };
  }
}

function guardarEstado(estado: EstadoNovedades) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
}

export function useNovedades() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const guardado = leerEstado();
    const actual: EstadoNovedades =
      guardado.version === VERSION_NOVEDADES
        ? guardado
        : { version: VERSION_NOVEDADES, veces: 0, cerrado: false };

    if (actual.cerrado || actual.veces >= NOVEDADES_MAX_VECES) return;

    guardarEstado({ ...actual, veces: actual.veces + 1 });
    setVisible(true);
  }, []);

  const cerrar = () => {
    guardarEstado({ version: VERSION_NOVEDADES, veces: NOVEDADES_MAX_VECES, cerrado: true });
    setVisible(false);
  };

  return { visible, cerrar };
}
