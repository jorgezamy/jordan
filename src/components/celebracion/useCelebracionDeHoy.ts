"use client";

import { fechaEfectiva } from "../../lib/fechas";
import { useValorDelCliente } from "../../hooks/useValorDelCliente";
import type { NombreCelebracion } from "./types";
import { celebracionDeHoy } from "./utils";

const leer = () => celebracionDeHoy(window.location.search, fechaEfectiva(window.location.search));
const leerAno = () => fechaEfectiva(window.location.search).getFullYear();

/** null en el servidor y cuando hoy no se celebra nada. */
export function useCelebracionDeHoy(): NombreCelebracion | null {
  return useValorDelCliente(leer, null);
}

/** Año para "¡Bienvenido {año}!" (respeta `?fecha=`). */
export function useAnoEfectivo(): number {
  return useValorDelCliente(leerAno, 0);
}
