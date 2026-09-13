export interface Libro {
  id: number;
  nombre: string;
  capitulos: number;
}

export interface Versiculo {
  numero: number;
  texto: string;
}

export interface RangoVersos {
  inicio: number | null;
  fin: number | null;
}
