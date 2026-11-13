import type { NombreFestivo } from "../festivos/types";
import type { RangoAnual } from "../../lib/fechas";

export type NombreTemporadaTitulo = "bienvenidaAno" | "primavera" | "verano" | "otono" | "navidena" | "invierno";

export type NombreCelebracion = NombreFestivo | NombreTemporadaTitulo;

export interface TemporadaTitulo extends RangoAnual {
  nombre: NombreTemporadaTitulo;
}

export interface InfoCelebracion {
  /** Texto pequeño sobre el título. */
  etiqueta: string;
  /** `{año}` se reemplaza por el año actual. */
  titulo: string;
  /** Variables CSS (globals.css) del degradado del título. */
  colores: string[];
}
