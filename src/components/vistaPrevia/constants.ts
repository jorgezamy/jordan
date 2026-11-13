import { PARAM_VISTA_PREVIA as PARAM_CELEBRACION } from "../celebracion/constants";
import type { NombreTemporadaTitulo } from "../celebracion/types";
import { PARAM_VISTA_PREVIA as PARAM_FESTIVO } from "../festivos/constants";
import { PARAM_VISTA_PREVIA as PARAM_FONDO } from "../fondoAnimado/constants";
import { PARAM_FECHA } from "../../lib/fechas";

export const ETIQUETAS_TEMPORADA: Record<NombreTemporadaTitulo, string> = {
  navidena: "Temporada navideña",
  invierno: "Entrada del invierno",
  bienvenidaAno: "Bienvenida del año",
  primavera: "Primavera",
  verano: "Verano",
  otono: "Otoño",
};

/**
 * Se simula un día ya dentro de la temporada (no el primero), para no caer
 * justo en un festivo que coincida con su inicio (p. ej. Día del Padre el 21 de junio).
 */
export const DIAS_DENTRO_DE_TEMPORADA = 2;

/** Parámetros de URL que activan una vista previa. */
export const PARAMS_VISTA_PREVIA = [PARAM_FECHA, PARAM_FONDO, PARAM_FESTIVO, PARAM_CELEBRACION];

export const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
