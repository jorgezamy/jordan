import { Timestamp } from "firebase/firestore";

import { EXPIRACION_DIAS } from "./constants";
import { Aviso } from "./types";

export function formatFecha(timestamp?: Timestamp) {
  if (!timestamp) return "";

  const date = timestamp.toDate();
  const tieneHora = date.getHours() !== 0 || date.getMinutes() !== 0;

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(tieneHora ? { hour: "numeric" as const, minute: "2-digit" as const } : {}),
  }).format(date);
}

// La fecha ("YYYY-MM-DD") y la hora ("HH:mm") vienen de inputs separados —
// la hora es independiente y opcional. Se interpretan/formatean en hora
// local (no UTC). Sin hora se guarda medianoche, que formatFecha trata como
// "sin hora específica" (no la muestra).
export function inputValueAFechaHora(fecha: string, hora: string): Date {
  const [y, m, d] = fecha.split("-").map(Number);
  if (!hora) return new Date(y, m - 1, d);

  const [h, min] = hora.split(":").map(Number);
  return new Date(y, m - 1, d, h, min);
}

export function fechaAInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function horaAInputValue(date: Date): string {
  if (date.getHours() === 0 && date.getMinutes() === 0) return "";

  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${min}`;
}

export function esVisible(aviso: Aviso, ahora: Date) {
  if (!aviso.fecha) return true;

  const fechaBase = aviso.fechaFin ?? aviso.fecha;
  const limite = fechaBase.toDate();
  limite.setDate(limite.getDate() + EXPIRACION_DIAS);
  return ahora <= limite;
}

export function formatRangoFecha(fecha?: Timestamp, fechaFin?: Timestamp) {
  if (!fecha) return "";
  if (!fechaFin) return formatFecha(fecha);
  return `Del ${formatFecha(fecha)} al ${formatFecha(fechaFin)}`;
}

export function ordenarAvisos(avisos: Aviso[]) {
  const porFechaCreacion = (a: Aviso, b: Aviso) =>
    a.fechaCreacion.toMillis() - b.fechaCreacion.toMillis();

  const importantes = avisos
    .filter((a) => a.importante)
    .sort(porFechaCreacion);

  const sinFecha = avisos
    .filter((a) => !a.importante && !a.fecha)
    .sort(porFechaCreacion);

  const conFecha = avisos
    .filter((a) => !a.importante && a.fecha)
    .sort((a, b) => a.fecha!.toMillis() - b.fecha!.toMillis());

  return [...importantes, ...sinFecha, ...conFecha];
}
