"use client";

import { OPCIONES_HEADER } from "./constants";
import { LienzoDiferido } from "./LienzoDiferido";
import { useEfectoDeHoy } from "./useEfectoDeHoy";

/**
 * Efecto de temporada dentro del header (todas las páginas), más denso para que
 * se note en sus 64 px. `fondo-oscuro` usa siempre los colores para fondo
 * oscuro, porque el header es `bg-primary` en ambos temas.
 */
export function FondoHeader() {
  const efecto = useEfectoDeHoy();
  if (!efecto) return null;
  return (
    <LienzoDiferido
      efecto={efecto}
      opciones={OPCIONES_HEADER}
      className="fondo-oscuro absolute inset-0 h-full w-full"
    />
  );
}
