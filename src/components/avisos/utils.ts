import { Timestamp } from "firebase/firestore";

import { Aviso } from "./types";

const DIAS_SEMANA_NOMBRE = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

function esMismoDia(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatHora12(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return new Intl.DateTimeFormat("es-MX", { hour: "numeric", minute: "2-digit" }).format(
    new Date(2000, 0, 1, h, m),
  );
}

function formatHora(date: Date) {
  return new Intl.DateTimeFormat("es-MX", { hour: "numeric", minute: "2-digit" }).format(date);
}

function formatFechaSola(date: Date) {
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" }).format(
    date,
  );
}

function tieneHora(date: Date) {
  return date.getHours() !== 0 || date.getMinutes() !== 0;
}

// Si `timestamp` cae en el mismo día calendario que `ahora`, se muestra "Hoy"
// (con hora si tiene) en vez de la fecha completa.
function formatFechaODia(timestamp: Timestamp, ahora: Date) {
  const date = timestamp.toDate();
  if (!esMismoDia(date, ahora)) return formatFecha(timestamp);
  if (!tieneHora(date)) return "Hoy";

  return `Hoy, ${formatHora(date)}`;
}

// Calcula el texto relativo para un aviso recurrente: "Hoy" si hoy es uno de
// los días seleccionados, o "Próximo <día>" con el más cercano hacia adelante.
export function calcularTextoRecurrente(
  dias: number[],
  hora: string,
  ahora: Date = new Date(),
): string {
  if (dias.length === 0) return "";

  const hoy = ahora.getDay();
  const sufijo = hora ? `, ${formatHora12(hora)}` : "";

  if (dias.includes(hoy)) return `Hoy${sufijo}`;

  const proximo = [1, 2, 3, 4, 5, 6]
    .map((offset) => (hoy + offset) % 7)
    .find((dia) => dias.includes(dia));

  if (proximo === undefined) return "";
  return `Próximo ${DIAS_SEMANA_NOMBRE[proximo]}${sufijo}`;
}

export function formatDiasRecurrentes(dias: number[]): string {
  const nombres = [...dias].sort((a, b) => a - b).map((d) => DIAS_SEMANA_NOMBRE[d]);
  if (nombres.length <= 1) return nombres.join("");
  return `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1]}`;
}

// Calcula el fin por defecto al elegir "Quitar después de esa fecha": mismo
// día, y si hay hora de inicio, 1 hora más tarde (puede cruzar a medianoche
// del día siguiente, lo cual es correcto). Sin hora de inicio, se deja el
// mismo día sin hora (evento de todo el día).
export function calcularFinPorDefecto(
  fecha: string,
  horaFecha: string,
): { fecha: string; hora: string } {
  const inicio = inputValueAFechaHora(fecha, horaFecha);
  const fin = new Date(inicio);
  if (horaFecha) fin.setHours(fin.getHours() + 1);
  return { fecha: fechaAInputValue(fin), hora: horaAInputValue(fin) };
}

export function formatFecha(timestamp?: Timestamp) {
  if (!timestamp) return "";

  const date = timestamp.toDate();

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(tieneHora(date) ? { hour: "numeric" as const, minute: "2-digit" as const } : {}),
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

function noExpira(aviso: Aviso) {
  return aviso.tipoProgramacion === "permanente" || aviso.tipoProgramacion === "recurrente";
}

export function esVisible(aviso: Aviso, ahora: Date) {
  if (!aviso.fecha || noExpira(aviso)) return true;

  const fechaBase = aviso.fechaFin ?? aviso.fecha;
  return ahora <= fechaBase.toDate();
}

export function formatRangoFecha(fecha?: Timestamp, fechaFin?: Timestamp, ahora: Date = new Date()) {
  if (!fecha) return "";
  if (!fechaFin) return formatFechaODia(fecha, ahora);

  const inicio = fecha.toDate();
  const fin = fechaFin.toDate();

  // Mismo día: "Hoy de 8:00 p. m. a 9:00 p. m." en vez de repetir la fecha
  // completa en ambos extremos ("Del hoy, 8pm al 8 de septiembre, 9pm").
  if (esMismoDia(inicio, fin)) {
    const dia = esMismoDia(inicio, ahora) ? "Hoy" : formatFechaSola(inicio);
    if (tieneHora(inicio) && tieneHora(fin)) {
      return `${dia} de ${formatHora(inicio)} a ${formatHora(fin)}`;
    }
    return dia;
  }

  return `Del ${formatFechaODia(fecha, ahora)} al ${formatFecha(fechaFin)}`;
}

// Texto de fecha/programación a mostrar en las vistas públicas (carrusel):
// "Hoy"/"Próximo <día>" para recurrentes, o el rango normal para el resto.
export function formatProgramacion(aviso: Aviso, ahora: Date = new Date()): string {
  if (aviso.tipoProgramacion === "recurrente" && aviso.diasRecurrentes?.length) {
    const hora = aviso.fecha ? horaAInputValue(aviso.fecha.toDate()) : "";
    return calcularTextoRecurrente(aviso.diasRecurrentes, hora, ahora);
  }
  if (!aviso.fecha) return "";
  return formatRangoFecha(aviso.fecha, aviso.fechaFin, ahora);
}

// Descripción de la programación para la lista de administración.
export function describirProgramacion(aviso: Aviso, ahora: Date = new Date()): string {
  if (!aviso.fecha) return "Sin fecha (permanente)";

  if (aviso.tipoProgramacion === "recurrente" && aviso.diasRecurrentes?.length) {
    return `Se repite los ${formatDiasRecurrentes(aviso.diasRecurrentes)} · ${formatProgramacion(aviso, ahora)}`;
  }

  if (aviso.tipoProgramacion === "permanente") {
    return `Activo desde ${formatFechaODia(aviso.fecha, ahora)} (sin expiración)`;
  }

  return `Programado: ${formatRangoFecha(aviso.fecha, aviso.fechaFin, ahora)}`;
}

export function ordenarAvisos(avisos: Aviso[]) {
  const porFechaCreacion = (a: Aviso, b: Aviso) =>
    a.fechaCreacion.toMillis() - b.fechaCreacion.toMillis();

  const importantes = avisos
    .filter((a) => a.importante)
    .sort(porFechaCreacion);

  const sinExpiracion = avisos
    .filter((a) => !a.importante && (!a.fecha || noExpira(a)))
    .sort(porFechaCreacion);

  const conFecha = avisos
    .filter((a) => !a.importante && a.fecha && !noExpira(a))
    .sort((a, b) => a.fecha!.toMillis() - b.fecha!.toMillis());

  return [...importantes, ...sinExpiracion, ...conFecha];
}
