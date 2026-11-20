import type { Festivo, NombreFestivo } from "./types";

/**
 * Días festivos con ícono en el header (solo ese día, según la fecha del visitante).
 * Los feriados que se descansan en lunes (Constitución, Juárez, Revolución) usan su
 * fecha histórica, que es el día que se conmemora.
 */
export const FESTIVOS: Festivo[] = [
  {
    nombre: "anoNuevo",
    titulo: "Año Nuevo",
    saludo: "¡Feliz Año Nuevo!",
    fecha: { tipo: "fija", mes: 1, dia: 1 },
  },
  {
    nombre: "diaDeReyes",
    titulo: "Día de Reyes",
    saludo: "¡Feliz Día de Reyes!",
    fecha: { tipo: "fija", mes: 1, dia: 6 },
  },
  {
    nombre: "diaDeLaConstitucion",
    titulo: "Día de la Constitución",
    saludo: "Día de la Constitución",
    fecha: { tipo: "fija", mes: 2, dia: 5 },
  },
  {
    nombre: "diaDelAmor",
    titulo: "Día del Amor y la Amistad",
    saludo: "¡Feliz Día del Amor y la Amistad!",
    fecha: { tipo: "fija", mes: 2, dia: 14 },
  },
  {
    nombre: "diaDeLaBandera",
    titulo: "Día de la Bandera",
    saludo: "¡Feliz Día de la Bandera!",
    fecha: { tipo: "fija", mes: 2, dia: 24 },
  },
  {
    nombre: "diaDeLaFamilia",
    titulo: "Día de la Familia",
    saludo: "¡Feliz Día de la Familia!",
    fecha: { tipo: "domingo", mes: 3, numero: 1 },
  },
  {
    nombre: "diaDeLaMujer",
    titulo: "Día de la Mujer",
    saludo: "¡Feliz Día de la Mujer!",
    fecha: { tipo: "fija", mes: 3, dia: 8 },
  },
  {
    nombre: "natalicioJuarez",
    titulo: "Natalicio de Benito Juárez",
    saludo: "Natalicio de Benito Juárez",
    fecha: { tipo: "fija", mes: 3, dia: 21 },
  },
  {
    nombre: "diaDelNino",
    titulo: "Día del Niño",
    saludo: "¡Feliz Día del Niño!",
    fecha: { tipo: "fija", mes: 4, dia: 30 },
  },
  {
    nombre: "diaDelTrabajo",
    titulo: "Día del Trabajo",
    saludo: "¡Feliz Día del Trabajo!",
    fecha: { tipo: "fija", mes: 5, dia: 1 },
  },
  {
    nombre: "diaDeLasMadres",
    titulo: "Día de las Madres",
    saludo: "¡Feliz Día, Mamá!",
    fecha: { tipo: "fija", mes: 5, dia: 10 },
  },
  {
    nombre: "diaDelMaestro",
    titulo: "Día del Maestro",
    saludo: "¡Feliz Día del Maestro!",
    fecha: { tipo: "fija", mes: 5, dia: 15 },
  },
  {
    nombre: "diaDelEstudiante",
    titulo: "Día del Estudiante",
    saludo: "¡Feliz Día del Estudiante!",
    fecha: { tipo: "fija", mes: 5, dia: 23 },
  },
  {
    nombre: "diaDelPadre",
    titulo: "Día del Padre",
    saludo: "¡Feliz Día, Papá!",
    fecha: { tipo: "domingo", mes: 6, numero: 3 },
  },
  {
    nombre: "diaDeLaJuventud",
    titulo: "Día de la Juventud",
    saludo: "¡Feliz Día de la Juventud!",
    fecha: { tipo: "fija", mes: 8, dia: 12 },
  },
  {
    nombre: "diaDelAbuelo",
    titulo: "Día del Abuelo",
    saludo: "¡Feliz Día del Abuelo!",
    fecha: { tipo: "fija", mes: 8, dia: 28 },
  },
  {
    nombre: "independencia",
    titulo: "Independencia de México",
    saludo: "¡Viva México!",
    fecha: { tipo: "fija", mes: 9, dia: 16 },
  },
  {
    nombre: "diaDelHombre",
    titulo: "Día del Hombre",
    saludo: "¡Feliz Día del Hombre!",
    fecha: { tipo: "fija", mes: 11, dia: 19 },
  },
  {
    nombre: "revolucion",
    titulo: "Revolución Mexicana",
    saludo: "Día de la Revolución Mexicana",
    fecha: { tipo: "fija", mes: 11, dia: 20 },
  },
  {
    nombre: "navidad",
    titulo: "Navidad",
    saludo: "¡Feliz Navidad!",
    fecha: { tipo: "fija", mes: 12, dia: 25 },
  },
];

/** Vista previa: `?festivo=navidad` muestra el ícono sin importar la fecha. */
export const PARAM_VISTA_PREVIA = "festivo";

export const ORDINALES = ["Primer", "Segundo", "Tercer", "Cuarto"];

export const FESTIVO_POR_NOMBRE = Object.fromEntries(FESTIVOS.map((f) => [f.nombre, f])) as Record<
  NombreFestivo,
  Festivo
>;
