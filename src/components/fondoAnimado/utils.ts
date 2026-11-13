import { buscarPorFecha } from "../../lib/fechas";
import { CALENDARIO, NOMBRES_EFECTO, PARAM_VISTA_PREVIA } from "./constants";
import type { NombreEfecto } from "./types";

/** Efecto que toca según el calendario, o null si no hay ninguno. */
export function efectoParaFecha(fecha: Date): NombreEfecto | null {
  return buscarPorFecha(CALENDARIO, fecha)?.efecto ?? null;
}

/** Efecto forzado por `?fondo=...` en la URL (para ver cómo se ve antes de su fecha). */
export function efectoForzado(search: string): NombreEfecto | null {
  const valor = new URLSearchParams(search).get(PARAM_VISTA_PREVIA);
  return NOMBRES_EFECTO.find((n) => n === valor) ?? null;
}
