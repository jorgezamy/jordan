"use client";

import { LienzoDiferido } from "./LienzoDiferido";
import { useEfectoDeHoy } from "./useEfectoDeHoy";

/** Animación de temporada detrás del contenido de la página de inicio. */
export function FondoAnimado() {
  const efecto = useEfectoDeHoy();
  if (!efecto) return null;
  return <LienzoDiferido efecto={efecto} className="fixed inset-0 -z-10 h-full w-full" />;
}
