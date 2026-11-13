import { festivoForzado, festivoParaFecha } from "../festivos/utils";
import { buscarPorFecha } from "../../lib/fechas";
import { INFO_CELEBRACION, PARAM_VISTA_PREVIA, TEMPORADAS_TITULO } from "./constants";
import type { NombreCelebracion } from "./types";

function temporadaParaFecha(fecha: Date): NombreCelebracion | null {
  return buscarPorFecha(TEMPORADAS_TITULO, fecha)?.nombre ?? null;
}

function celebracionForzada(search: string): NombreCelebracion | null {
  const valor = new URLSearchParams(search).get(PARAM_VISTA_PREVIA);
  return (Object.keys(INFO_CELEBRACION) as NombreCelebracion[]).find((n) => n === valor) ?? null;
}

/** Lo que se celebra hoy: primero un festivo, si no, la temporada. */
export function celebracionDeHoy(search: string, hoy: Date): NombreCelebracion | null {
  return (
    celebracionForzada(search) ??
    festivoForzado(search) ??
    festivoParaFecha(hoy) ??
    temporadaParaFecha(hoy)
  );
}

export const textoTitulo = (titulo: string, ano: number) => titulo.replace("{año}", String(ano));

/** Degradado (de ida y vuelta, para que el brillo animado se repita sin cortes). */
export function degradado(colores: string[]): string {
  const paradas = [...colores, ...colores.slice(0, -1).reverse()].map((c) => `var(${c})`);
  return `linear-gradient(90deg, ${paradas.join(", ")})`;
}
