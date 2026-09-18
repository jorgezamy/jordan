import { Libro } from "./types";

// Estructura canónica del canon protestante (66 libros): id y número de
// capítulos son iguales sin importar la versión/traducción, por eso se
// hardcodean aquí en vez de pedirlos a la API en cada visita.
export const LIBROS_BIBLIA: Libro[] = [
  { id: 1, nombre: "Génesis", capitulos: 50 },
  { id: 2, nombre: "Éxodo", capitulos: 40 },
  { id: 3, nombre: "Levítico", capitulos: 27 },
  { id: 4, nombre: "Números", capitulos: 36 },
  { id: 5, nombre: "Deuteronomio", capitulos: 34 },
  { id: 6, nombre: "Josué", capitulos: 24 },
  { id: 7, nombre: "Jueces", capitulos: 21 },
  { id: 8, nombre: "Rut", capitulos: 4 },
  { id: 9, nombre: "1 Samuel", capitulos: 31 },
  { id: 10, nombre: "2 Samuel", capitulos: 24 },
  { id: 11, nombre: "1 Reyes", capitulos: 22 },
  { id: 12, nombre: "2 Reyes", capitulos: 25 },
  { id: 13, nombre: "1 Crónicas", capitulos: 29 },
  { id: 14, nombre: "2 Crónicas", capitulos: 36 },
  { id: 15, nombre: "Esdras", capitulos: 10 },
  { id: 16, nombre: "Nehemías", capitulos: 13 },
  { id: 17, nombre: "Ester", capitulos: 10 },
  { id: 18, nombre: "Job", capitulos: 42 },
  { id: 19, nombre: "Salmos", capitulos: 150 },
  { id: 20, nombre: "Proverbios", capitulos: 31 },
  { id: 21, nombre: "Eclesiastés", capitulos: 12 },
  { id: 22, nombre: "Cantares", capitulos: 8 },
  { id: 23, nombre: "Isaías", capitulos: 66 },
  { id: 24, nombre: "Jeremías", capitulos: 52 },
  { id: 25, nombre: "Lamentaciones", capitulos: 5 },
  { id: 26, nombre: "Ezequiel", capitulos: 48 },
  { id: 27, nombre: "Daniel", capitulos: 12 },
  { id: 28, nombre: "Oseas", capitulos: 14 },
  { id: 29, nombre: "Joel", capitulos: 3 },
  { id: 30, nombre: "Amós", capitulos: 9 },
  { id: 31, nombre: "Abdías", capitulos: 1 },
  { id: 32, nombre: "Jonás", capitulos: 4 },
  { id: 33, nombre: "Miqueas", capitulos: 7 },
  { id: 34, nombre: "Nahúm", capitulos: 3 },
  { id: 35, nombre: "Habacuc", capitulos: 3 },
  { id: 36, nombre: "Sofonías", capitulos: 3 },
  { id: 37, nombre: "Hageo", capitulos: 2 },
  { id: 38, nombre: "Zacarías", capitulos: 14 },
  { id: 39, nombre: "Malaquías", capitulos: 4 },
  { id: 40, nombre: "Mateo", capitulos: 28 },
  { id: 41, nombre: "Marcos", capitulos: 16 },
  { id: 42, nombre: "Lucas", capitulos: 24 },
  { id: 43, nombre: "Juan", capitulos: 21 },
  { id: 44, nombre: "Hechos", capitulos: 28 },
  { id: 45, nombre: "Romanos", capitulos: 16 },
  { id: 46, nombre: "1 Corintios", capitulos: 16 },
  { id: 47, nombre: "2 Corintios", capitulos: 13 },
  { id: 48, nombre: "Gálatas", capitulos: 6 },
  { id: 49, nombre: "Efesios", capitulos: 6 },
  { id: 50, nombre: "Filipenses", capitulos: 4 },
  { id: 51, nombre: "Colosenses", capitulos: 4 },
  { id: 52, nombre: "1 Tesalonicenses", capitulos: 5 },
  { id: 53, nombre: "2 Tesalonicenses", capitulos: 3 },
  { id: 54, nombre: "1 Timoteo", capitulos: 6 },
  { id: 55, nombre: "2 Timoteo", capitulos: 4 },
  { id: 56, nombre: "Tito", capitulos: 3 },
  { id: 57, nombre: "Filemón", capitulos: 1 },
  { id: 58, nombre: "Hebreos", capitulos: 13 },
  { id: 59, nombre: "Santiago", capitulos: 5 },
  { id: 60, nombre: "1 Pedro", capitulos: 5 },
  { id: 61, nombre: "2 Pedro", capitulos: 3 },
  { id: 62, nombre: "1 Juan", capitulos: 5 },
  { id: 63, nombre: "2 Juan", capitulos: 1 },
  { id: 64, nombre: "3 Juan", capitulos: 1 },
  { id: 65, nombre: "Judas", capitulos: 1 },
  { id: 66, nombre: "Apocalipsis", capitulos: 22 },
];

export interface OpcionVersion {
  value: string;
  label: string;
}

// Subconjunto de versiones que expone bolls.life — independiente de
// VERSIONES_BIBLICAS (citaBiblica/constants.ts), que es una lista curada a
// mano para citas escritas por el admin, no atada a ninguna API externa.
export const VERSIONES_BIBLIA: OpcionVersion[] = [
  { value: "RV1960", label: "Reina Valera 1960" },
  { value: "RV1909", label: "Reina Valera 1909" },
  { value: "NVI", label: "Nueva Versión Internacional" },
  { value: "NTV", label: "Nueva Traducción Viviente" },
];

export const VERSION_POR_DEFECTO = "RV1960";
