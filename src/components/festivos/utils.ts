import { formatearDiaMes, MESES } from "../../lib/fechas";
import { FESTIVOS, ORDINALES, PARAM_VISTA_PREVIA } from "./constants";
import type { FechaFestivo, NombreFestivo } from "./types";

/** Día exacto del festivo en `ano` (el Día del Padre cambia cada año). */
export function fechaDelFestivo(fecha: FechaFestivo, ano: number): Date {
  if (fecha.tipo === "fija") return new Date(ano, fecha.mes - 1, fecha.dia);
  const diaSemanaDel1 = new Date(ano, fecha.mes - 1, 1).getDay();
  const primerDomingo = 1 + ((7 - diaSemanaDel1) % 7);
  return new Date(ano, fecha.mes - 1, primerDomingo + 7 * (fecha.numero - 1));
}

function caeEn(fecha: FechaFestivo, hoy: Date): boolean {
  const dia = fechaDelFestivo(fecha, hoy.getFullYear());
  return dia.getMonth() === hoy.getMonth() && dia.getDate() === hoy.getDate();
}

export function festivoParaFecha(hoy: Date): NombreFestivo | null {
  return FESTIVOS.find((f) => caeEn(f.fecha, hoy))?.nombre ?? null;
}

export function festivoForzado(search: string): NombreFestivo | null {
  const valor = new URLSearchParams(search).get(PARAM_VISTA_PREVIA);
  return FESTIVOS.find((f) => f.nombre === valor)?.nombre ?? null;
}

/** "10 de mayo" o "Tercer domingo de junio". */
export function describirFecha(fecha: FechaFestivo): string {
  if (fecha.tipo === "fija") return formatearDiaMes(fecha.mes, fecha.dia);
  return `${ORDINALES[fecha.numero - 1]} domingo de ${MESES[fecha.mes - 1]}`;
}
