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

// Lo que se guarda en localStorage para que, al salir de /biblia y volver,
// el lector siga en la misma cita con los mismos versos seleccionados.
export interface EstadoLectura {
  libroId: number;
  capitulo: number;
  version: string;
  versoInicio: number | null;
  versoFin: number | null;
}
