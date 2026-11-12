"use client";

import { useEffect, useState } from "react";

import { TAMANO_LETRA_POR_DEFECTO, TAMANOS_LETRA } from "./constants";
import { guardarTamanoLetra, leerTamanoLetra } from "./utils";

// Tamaño de letra del texto bíblico, recordado por visitante en localStorage.
export function useTamanoLetra() {
  const [indice, setIndice] = useState(TAMANO_LETRA_POR_DEFECTO);

  useEffect(() => {
    setIndice(leerTamanoLetra());
  }, []);

  const cambiar = (delta: number) => {
    setIndice((actual) => {
      const nuevo = Math.min(TAMANOS_LETRA.length - 1, Math.max(0, actual + delta));
      guardarTamanoLetra(nuevo);
      return nuevo;
    });
  };

  return {
    claseTamano: TAMANOS_LETRA[indice],
    puedeAumentar: indice < TAMANOS_LETRA.length - 1,
    puedeDisminuir: indice > 0,
    aumentar: () => cambiar(1),
    disminuir: () => cambiar(-1),
  };
}
