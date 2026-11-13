import type { Festivo, NombreFestivo } from "./types";

/** Días festivos con ícono en el header (solo ese día, según la fecha del visitante). */
export const FESTIVOS: Festivo[] = [
  { nombre: "anoNuevo", titulo: "Año Nuevo", saludo: "¡Feliz Año Nuevo!", fecha: { tipo: "fija", mes: 1, dia: 1 } },
  { nombre: "diaDelNino", titulo: "Día del Niño", saludo: "¡Feliz Día del Niño!", fecha: { tipo: "fija", mes: 4, dia: 30 } },
  {
    nombre: "diaDeLasMadres",
    titulo: "Día de las Madres",
    saludo: "¡Feliz Día, Mamá!",
    fecha: { tipo: "fija", mes: 5, dia: 10 },
  },
  {
    nombre: "diaDelPadre",
    titulo: "Día del Padre",
    saludo: "¡Feliz Día, Papá!",
    fecha: { tipo: "domingo", mes: 6, numero: 3 },
  },
  {
    nombre: "independencia",
    titulo: "Independencia de México",
    saludo: "¡Viva México!",
    fecha: { tipo: "fija", mes: 9, dia: 16 },
  },
  { nombre: "navidad", titulo: "Navidad", saludo: "¡Feliz Navidad!", fecha: { tipo: "fija", mes: 12, dia: 25 } },
];

/** Vista previa: `?festivo=navidad` muestra el ícono sin importar la fecha. */
export const PARAM_VISTA_PREVIA = "festivo";

export const ORDINALES = ["Primer", "Segundo", "Tercer", "Cuarto"];

export const FESTIVO_POR_NOMBRE = Object.fromEntries(FESTIVOS.map((f) => [f.nombre, f])) as Record<
  NombreFestivo,
  Festivo
>;
