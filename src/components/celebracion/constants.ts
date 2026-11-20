import { FESTIVO_POR_NOMBRE } from "../festivos/constants";
import type { NombreFestivo } from "../festivos/types";
import type { InfoCelebracion, NombreCelebracion, TemporadaTitulo } from "./types";

/**
 * Temporadas con título en el inicio (inclusivas, se repiten cada año).
 * Un festivo de ese día tiene prioridad sobre la temporada.
 */
export const TEMPORADAS_TITULO: TemporadaTitulo[] = [
  { nombre: "bienvenidaAno", desde: { mes: 1, dia: 2 }, hasta: { mes: 1, dia: 10 } },
  { nombre: "primavera", desde: { mes: 3, dia: 20 }, hasta: { mes: 3, dia: 29 } },
  { nombre: "verano", desde: { mes: 6, dia: 21 }, hasta: { mes: 6, dia: 30 } },
  { nombre: "otono", desde: { mes: 9, dia: 22 }, hasta: { mes: 10, dia: 1 } },
  { nombre: "navidena", desde: { mes: 11, dia: 10 }, hasta: { mes: 12, dia: 20 } },
  { nombre: "invierno", desde: { mes: 12, dia: 21 }, hasta: { mes: 12, dia: 31 } },
];

/** Vista previa: `/?celebracion=otono` (los festivos también responden a `?festivo=`). */
export const PARAM_VISTA_PREVIA = "celebracion";

const ETIQUETA_FESTIVO = "Hoy celebramos";
const ETIQUETA_TEMPORADA = "Temporada";

const ROJO = "--celebracion-rojo";
const VERDE = "--celebracion-verde";
const AZUL = "--celebracion-azul";
const MORADO = "--celebracion-morado";

const festivo = (nombre: NombreFestivo, colores: string[]): InfoCelebracion => ({
  etiqueta: ETIQUETA_FESTIVO,
  titulo: FESTIVO_POR_NOMBRE[nombre].saludo,
  colores,
});

const temporada = (titulo: string, colores: string[]): InfoCelebracion => ({
  etiqueta: ETIQUETA_TEMPORADA,
  titulo,
  colores,
});

export const INFO_CELEBRACION: Record<NombreCelebracion, InfoCelebracion> = {
  anoNuevo: festivo("anoNuevo", ["--fondo-fuegos-1", "--fondo-fuegos-2", "--fondo-fuegos-3"]),
  diaDeLaMujer: festivo("diaDeLaMujer", [MORADO, "--fondo-petalo-1"]),
  diaDelNino: festivo("diaDelNino", [ROJO, "--fondo-fuegos-1", AZUL]),
  diaDeLasMadres: festivo("diaDeLasMadres", ["--fondo-petalo-1", "--fondo-fuegos-2"]),
  diaDelPadre: festivo("diaDelPadre", [AZUL, "--fondo-fuegos-3"]),
  independencia: festivo("independencia", [VERDE, ROJO]),
  diaDelHombre: festivo("diaDelHombre", [AZUL, "--fondo-fuegos-3"]),
  navidad: festivo("navidad", [ROJO, VERDE]),
  diaDeReyes: festivo("diaDeReyes", ["--fondo-fuegos-1", ROJO]),
  diaDeLaConstitucion: festivo("diaDeLaConstitucion", [VERDE, ROJO]),
  diaDelAmor: festivo("diaDelAmor", [ROJO, "--fondo-petalo-1"]),
  diaDeLaBandera: festivo("diaDeLaBandera", [VERDE, ROJO]),
  diaDeLaFamilia: festivo("diaDeLaFamilia", ["--fondo-hoja-1", "--fondo-petalo-1"]),
  natalicioJuarez: festivo("natalicioJuarez", [AZUL, VERDE]),
  diaDelTrabajo: festivo("diaDelTrabajo", [AZUL, "--fondo-verano-1"]),
  diaDelMaestro: festivo("diaDelMaestro", [ROJO, VERDE]),
  diaDelEstudiante: festivo("diaDelEstudiante", [AZUL, "--fondo-fuegos-1"]),
  diaDeLaJuventud: festivo("diaDeLaJuventud", [MORADO, "--fondo-fuegos-3"]),
  diaDelAbuelo: festivo("diaDelAbuelo", ["--fondo-hoja-1", "--fondo-petalo-1"]),
  revolucion: festivo("revolucion", [ROJO, VERDE]),
  bienvenidaAno: temporada("¡Bienvenido {año}!", ["--fondo-fuegos-1", "--fondo-fuegos-2", "--fondo-fuegos-3"]),
  primavera: temporada("Entrada de la primavera", ["--fondo-petalo-1", "--fondo-flor-centro"]),
  verano: temporada("Entrada del verano", ["--fondo-verano-1", "--fondo-hoja-1"]),
  otono: temporada("Entrada del otoño", ["--fondo-hoja-1", "--fondo-hoja-3"]),
  navidena: temporada("Temporada navideña", [ROJO, VERDE]),
  invierno: temporada("Entrada del invierno", ["--fondo-nieve", AZUL]),
};
