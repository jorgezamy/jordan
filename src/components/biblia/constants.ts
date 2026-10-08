import { Libro } from "./types";

// Estructura canónica del canon protestante (66 libros): id, capítulos y el
// código OSIS/USFM de 3 letras son iguales sin importar la versión/
// traducción, por eso se hardcodean aquí en vez de pedirlos a cada API en
// cada visita. codigoApiBible solo lo usa el proveedor api.bible (ver
// PROVEEDOR_POR_VERSION); bolls.life usa el id numérico directamente.
export const LIBROS_BIBLIA: Libro[] = [
  { id: 1, nombre: "Génesis", capitulos: 50, codigoApiBible: "GEN" },
  { id: 2, nombre: "Éxodo", capitulos: 40, codigoApiBible: "EXO" },
  { id: 3, nombre: "Levítico", capitulos: 27, codigoApiBible: "LEV" },
  { id: 4, nombre: "Números", capitulos: 36, codigoApiBible: "NUM" },
  { id: 5, nombre: "Deuteronomio", capitulos: 34, codigoApiBible: "DEU" },
  { id: 6, nombre: "Josué", capitulos: 24, codigoApiBible: "JOS" },
  { id: 7, nombre: "Jueces", capitulos: 21, codigoApiBible: "JDG" },
  { id: 8, nombre: "Rut", capitulos: 4, codigoApiBible: "RUT" },
  { id: 9, nombre: "1 Samuel", capitulos: 31, codigoApiBible: "1SA" },
  { id: 10, nombre: "2 Samuel", capitulos: 24, codigoApiBible: "2SA" },
  { id: 11, nombre: "1 Reyes", capitulos: 22, codigoApiBible: "1KI" },
  { id: 12, nombre: "2 Reyes", capitulos: 25, codigoApiBible: "2KI" },
  { id: 13, nombre: "1 Crónicas", capitulos: 29, codigoApiBible: "1CH" },
  { id: 14, nombre: "2 Crónicas", capitulos: 36, codigoApiBible: "2CH" },
  { id: 15, nombre: "Esdras", capitulos: 10, codigoApiBible: "EZR" },
  { id: 16, nombre: "Nehemías", capitulos: 13, codigoApiBible: "NEH" },
  { id: 17, nombre: "Ester", capitulos: 10, codigoApiBible: "EST" },
  { id: 18, nombre: "Job", capitulos: 42, codigoApiBible: "JOB" },
  { id: 19, nombre: "Salmos", capitulos: 150, codigoApiBible: "PSA" },
  { id: 20, nombre: "Proverbios", capitulos: 31, codigoApiBible: "PRO" },
  { id: 21, nombre: "Eclesiastés", capitulos: 12, codigoApiBible: "ECC" },
  { id: 22, nombre: "Cantares", capitulos: 8, codigoApiBible: "SNG" },
  { id: 23, nombre: "Isaías", capitulos: 66, codigoApiBible: "ISA" },
  { id: 24, nombre: "Jeremías", capitulos: 52, codigoApiBible: "JER" },
  { id: 25, nombre: "Lamentaciones", capitulos: 5, codigoApiBible: "LAM" },
  { id: 26, nombre: "Ezequiel", capitulos: 48, codigoApiBible: "EZK" },
  { id: 27, nombre: "Daniel", capitulos: 12, codigoApiBible: "DAN" },
  { id: 28, nombre: "Oseas", capitulos: 14, codigoApiBible: "HOS" },
  { id: 29, nombre: "Joel", capitulos: 3, codigoApiBible: "JOL" },
  { id: 30, nombre: "Amós", capitulos: 9, codigoApiBible: "AMO" },
  { id: 31, nombre: "Abdías", capitulos: 1, codigoApiBible: "OBA" },
  { id: 32, nombre: "Jonás", capitulos: 4, codigoApiBible: "JON" },
  { id: 33, nombre: "Miqueas", capitulos: 7, codigoApiBible: "MIC" },
  { id: 34, nombre: "Nahúm", capitulos: 3, codigoApiBible: "NAM" },
  { id: 35, nombre: "Habacuc", capitulos: 3, codigoApiBible: "HAB" },
  { id: 36, nombre: "Sofonías", capitulos: 3, codigoApiBible: "ZEP" },
  { id: 37, nombre: "Hageo", capitulos: 2, codigoApiBible: "HAG" },
  { id: 38, nombre: "Zacarías", capitulos: 14, codigoApiBible: "ZEC" },
  { id: 39, nombre: "Malaquías", capitulos: 4, codigoApiBible: "MAL" },
  { id: 40, nombre: "Mateo", capitulos: 28, codigoApiBible: "MAT" },
  { id: 41, nombre: "Marcos", capitulos: 16, codigoApiBible: "MRK" },
  { id: 42, nombre: "Lucas", capitulos: 24, codigoApiBible: "LUK" },
  { id: 43, nombre: "Juan", capitulos: 21, codigoApiBible: "JHN" },
  { id: 44, nombre: "Hechos", capitulos: 28, codigoApiBible: "ACT" },
  { id: 45, nombre: "Romanos", capitulos: 16, codigoApiBible: "ROM" },
  { id: 46, nombre: "1 Corintios", capitulos: 16, codigoApiBible: "1CO" },
  { id: 47, nombre: "2 Corintios", capitulos: 13, codigoApiBible: "2CO" },
  { id: 48, nombre: "Gálatas", capitulos: 6, codigoApiBible: "GAL" },
  { id: 49, nombre: "Efesios", capitulos: 6, codigoApiBible: "EPH" },
  { id: 50, nombre: "Filipenses", capitulos: 4, codigoApiBible: "PHP" },
  { id: 51, nombre: "Colosenses", capitulos: 4, codigoApiBible: "COL" },
  { id: 52, nombre: "1 Tesalonicenses", capitulos: 5, codigoApiBible: "1TH" },
  { id: 53, nombre: "2 Tesalonicenses", capitulos: 3, codigoApiBible: "2TH" },
  { id: 54, nombre: "1 Timoteo", capitulos: 6, codigoApiBible: "1TI" },
  { id: 55, nombre: "2 Timoteo", capitulos: 4, codigoApiBible: "2TI" },
  { id: 56, nombre: "Tito", capitulos: 3, codigoApiBible: "TIT" },
  { id: 57, nombre: "Filemón", capitulos: 1, codigoApiBible: "PHM" },
  { id: 58, nombre: "Hebreos", capitulos: 13, codigoApiBible: "HEB" },
  { id: 59, nombre: "Santiago", capitulos: 5, codigoApiBible: "JAS" },
  { id: 60, nombre: "1 Pedro", capitulos: 5, codigoApiBible: "1PE" },
  { id: 61, nombre: "2 Pedro", capitulos: 3, codigoApiBible: "2PE" },
  { id: 62, nombre: "1 Juan", capitulos: 5, codigoApiBible: "1JN" },
  { id: 63, nombre: "2 Juan", capitulos: 1, codigoApiBible: "2JN" },
  { id: 64, nombre: "3 Juan", capitulos: 1, codigoApiBible: "3JN" },
  { id: 65, nombre: "Judas", capitulos: 1, codigoApiBible: "JUD" },
  { id: 66, nombre: "Apocalipsis", capitulos: 22, codigoApiBible: "REV" },
];

export interface OpcionVersion {
  value: string;
  label: string;
}

// Subconjunto de versiones expuesto en el selector — independiente de
// VERSIONES_BIBLICAS (citaBiblica/constants.ts), que es una lista curada a
// mano para citas escritas por el admin, no atada a ninguna API externa.
//
// RV1909 y NVI salieron de aquí el 2026-10-07: bolls.life eliminó RV1909 por
// completo de su catálogo (devuelve [] para cualquier capítulo), y para NVI
// el dueño del sitio sustituyó el texto por un mensaje explicando que
// Biblica, Inc. le prohibió legalmente seguir distribuyendo esa traducción
// — en ambos casos la API sigue respondiendo 200, así que eso no se podía
// detectar en el cliente, solo evitar ofreciendo versiones que sí funcionan.
// Ambas volvieron a agregarse el mismo día vía api.bible (American Bible
// Society), que sí las tiene licenciadas para uso no comercial — ver
// PROVEEDOR_POR_VERSION.
export const VERSIONES_BIBLIA: OpcionVersion[] = [
  { value: "RV1960", label: "Reina Valera 1960" },
  { value: "RV1909", label: "Reina Valera 1909" },
  { value: "NVI", label: "Nueva Versión Internacional" },
  { value: "LBLA", label: "La Biblia de las Américas" },
  { value: "NTV", label: "Nueva Traducción Viviente" },
  { value: "PDT", label: "Palabra de Dios para Todos" },
];

export const VERSION_POR_DEFECTO = "RV1960";

export type Proveedor = "bolls" | "apibible";

interface InfoProveedorVersion {
  proveedor: Proveedor;
  // Solo aplica (y es requerido) cuando proveedor === "apibible": el bibleId
  // real de api.bible para esta traducción, un hash específico por edición
  // — no hay forma de derivarlo del "value" de arriba, hay que consultar
  // GET /v1/bibles con la API key para obtenerlo. NVI (01c25b87...) es la
  // edición "Nueva Versión Internacional 2025", 66 libros completos y
  // gramática latinoamericana ("ustedes", no "vosotros") — la edición NVI
  // 2015 que dio esa misma key solo trae el Nuevo Testamento (27 libros), y
  // la llamada "Spanish NVI"/"Castilian" sí trae los 66 pero en español de
  // España (vosotros), ninguna de las dos sirve como versión principal aquí.
  apiBibleId?: string;
}

export const PROVEEDOR_POR_VERSION: Record<string, InfoProveedorVersion> = {
  RV1960: { proveedor: "bolls" },
  LBLA: { proveedor: "bolls" },
  NTV: { proveedor: "bolls" },
  PDT: { proveedor: "bolls" },
  NVI: { proveedor: "apibible", apiBibleId: "01c25b8715dbb632-01" },
  RV1909: { proveedor: "apibible", apiBibleId: "592420522e16049f-01" },
};
