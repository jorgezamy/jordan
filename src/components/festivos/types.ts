export type NombreFestivo =
  | "anoNuevo"
  | "diaDeReyes"
  | "diaDelNino"
  | "diaDeLaMujer"
  | "diaDeLasMadres"
  | "diaDelPadre"
  | "independencia"
  | "diaDelHombre"
  | "navidad"
  | "diaDelAmor"
  | "diaDeLaConstitucion"
  | "diaDeLaBandera"
  | "natalicioJuarez"
  | "diaDeLaFamilia"
  | "diaDelTrabajo"
  | "diaDelMaestro"
  | "diaDelEstudiante"
  | "diaDeLaJuventud"
  | "diaDelAbuelo"
  | "revolucion";

/** Fecha fija (`mes` 1-12) o "n-ésimo domingo del mes" (p. ej. Día del Padre). */
export type FechaFestivo =
  { tipo: "fija"; mes: number; dia: number } | { tipo: "domingo"; mes: number; numero: number };

export interface Festivo {
  nombre: NombreFestivo;
  titulo: string;
  /** Texto que acompaña al ícono en el header (pantallas grandes) y lector de pantalla. */
  saludo: string;
  fecha: FechaFestivo;
}
