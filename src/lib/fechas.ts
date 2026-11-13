/** Fecha sin año (se repite cada año). `mes` va de 1 a 12. */
export interface FechaDelAno {
  mes: number;
  dia: number;
}

/** Rango anual inclusivo; no cruza fin de año. */
export interface RangoAnual {
  desde: FechaDelAno;
  hasta: FechaDelAno;
}

const clave = ({ mes, dia }: FechaDelAno) => mes * 100 + dia;

/** Primer elemento de `lista` cuyo rango incluye `fecha`. */
export function buscarPorFecha<T extends RangoAnual>(lista: T[], fecha: Date): T | undefined {
  const hoy = clave({ mes: fecha.getMonth() + 1, dia: fecha.getDate() });
  return lista.find((r) => hoy >= clave(r.desde) && hoy <= clave(r.hasta));
}

export const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/** `mes` de 1 a 12 → "10 de noviembre". */
export const formatearDiaMes = (mes: number, dia: number) => `${dia} de ${MESES[mes - 1]}`;

/** Vista previa: `?fecha=2026-12-25` hace que el sitio se comporte como si fuera ese día. */
export const PARAM_FECHA = "fecha";

const dosDigitos = (n: number) => String(n).padStart(2, "0");

export const aParamFecha = (d: Date) =>
  `${d.getFullYear()}-${dosDigitos(d.getMonth() + 1)}-${dosDigitos(d.getDate())}`;

export function fechaSimulada(search: string): Date | null {
  const partes = new URLSearchParams(search).get(PARAM_FECHA)?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!partes) return null;
  const fecha = new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]));
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

/** La fecha simulada por `?fecha=` o, si no hay, la de hoy. */
export const fechaEfectiva = (search: string) => fechaSimulada(search) ?? new Date();

/** Próxima vez (hoy incluido) que cae una fecha anual; `enAno` la calcula para un año dado. */
export function proximaOcurrencia(enAno: (ano: number) => Date, hoy: Date): Date {
  const inicioDeHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const esteAno = enAno(hoy.getFullYear());
  return esteAno < inicioDeHoy ? enAno(hoy.getFullYear() + 1) : esteAno;
}
