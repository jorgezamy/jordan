import { formatearDiaMes } from "../../lib/fechas";
import type { RangoAnual } from "../../lib/fechas";

/** "10 de noviembre – 31 de diciembre". */
export const describirTemporada = ({ desde, hasta }: RangoAnual) =>
  `${formatearDiaMes(desde.mes, desde.dia)} – ${formatearDiaMes(hasta.mes, hasta.dia)}`;
