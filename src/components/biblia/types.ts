export interface Libro {
  id: number;
  nombre: string;
  capitulos: number;
  // Código OSIS/USFM de 3 letras (GEN, EXO, ... REV) — lo exige api.bible
  // para armar el chapterId ("GEN.1"); bolls.life usa el id numérico y no
  // lo necesita.
  codigoApiBible: string;
}

export interface Versiculo {
  numero: number;
  texto: string;
}

export interface RangoVersos {
  inicio: number | null;
  fin: number | null;
}
