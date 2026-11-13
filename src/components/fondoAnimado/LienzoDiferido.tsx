"use client";

import dynamic from "next/dynamic";

/**
 * `LienzoAnimado` cargado bajo demanda: el motor de animación (escenas, dibujo)
 * solo se descarga cuando hay un efecto activo; fuera de temporada no pesa nada.
 */
export const LienzoDiferido = dynamic(() => import("./LienzoAnimado").then((m) => m.LienzoAnimado), {
  ssr: false,
});
