import type { ConfigCaida, NombreEfecto, OpcionesEscena, Temporada } from "./types";

/**
 * Calendario de fondos animados del inicio (fechas inclusivas, se repiten cada año).
 * El invierno no tiene entrada propia: queda cubierto por la nieve de Navidad.
 */
export const CALENDARIO: Temporada[] = [
  { efecto: "anoNuevo", desde: { mes: 1, dia: 1 }, hasta: { mes: 1, dia: 10 } },
  { efecto: "primavera", desde: { mes: 3, dia: 20 }, hasta: { mes: 3, dia: 29 } },
  { efecto: "verano", desde: { mes: 6, dia: 21 }, hasta: { mes: 6, dia: 30 } },
  { efecto: "otono", desde: { mes: 9, dia: 22 }, hasta: { mes: 10, dia: 1 } },
  { efecto: "nieve", desde: { mes: 11, dia: 10 }, hasta: { mes: 12, dia: 31 } },
];

export const NOMBRES_EFECTO: NombreEfecto[] = ["nieve", "anoNuevo", "primavera", "verano", "otono"];

/** Vista previa: `/?fondo=anoNuevo` fuerza un efecto sin importar la fecha. */
export const PARAM_VISTA_PREVIA = "fondo";

/**
 * Tope de densidad de píxeles del canvas. Muchos celulares son 3x: a pantalla
 * completa eso son ~3 millones de píxeles por frame; a 2x es menos de la mitad
 * y en partículas así no se nota la diferencia.
 */
export const MAX_DPR = 2;

export const OPCIONES_PAGINA: OpcionesEscena = { densidad: 1, minimo: 0, escala: 1 };
/** El header mide 64 px de alto: más densidad y fuegos en miniatura para que se note. */
export const OPCIONES_HEADER: OpcionesEscena = { densidad: 4, minimo: 7, escala: 0.35 };
/** Recuadros de vista previa en /documentacion. */
export const OPCIONES_VISTA_PREVIA: OpcionesEscena = { densidad: 2.5, minimo: 8, escala: 0.55 };

/**
 * Variable CSS con el borde fino de las figuras: da contraste sobre fondo blanco.
 * En modo oscuro va vacía (sin borde).
 */
export const VARIABLE_CONTORNO = "--fondo-contorno";

export const CONFIG_NIEVE: ConfigCaida = {
  /** Copos de cristal (6 brazos) mezclados con bolitas, para que se lea como nieve. */
  formas: ["circulo", "circulo", "copo"],
  densidad: 0.9,
  max: 140,
  radioMin: 1.5,
  radioMax: 4,
  velocidadMin: 0.4,
  velocidadMax: 1.4,
  vaiven: 0.6,
  opacidadMin: 0.6,
  opacidadMax: 1,
  giro: 0.01,
};

export const CONFIG_PRIMAVERA: ConfigCaida = {
  formas: ["flor", "flor", "petalo", "petalo", "petalo"],
  densidad: 0.22,
  max: 40,
  radioMin: 6,
  radioMax: 12,
  velocidadMin: 0.5,
  velocidadMax: 1.2,
  vaiven: 1.1,
  opacidadMin: 0.8,
  opacidadMax: 1,
  giro: 0.03,
  colorCentro: true,
};

export const CONFIG_VERANO: ConfigCaida = {
  formas: ["sol", "estrella", "estrella"],
  densidad: 0.18,
  max: 32,
  radioMin: 6,
  radioMax: 11,
  velocidadMin: 0.3,
  velocidadMax: 0.8,
  vaiven: 0.7,
  opacidadMin: 0.8,
  opacidadMax: 1,
  giro: 0.015,
};

export const CONFIG_OTONO: ConfigCaida = {
  formas: ["hoja"],
  densidad: 0.18,
  max: 35,
  radioMin: 6,
  radioMax: 11,
  velocidadMin: 0.6,
  velocidadMax: 1.4,
  vaiven: 1.3,
  opacidadMin: 0.8,
  opacidadMax: 1,
  giro: 0.04,
};

/** Fuegos artificiales de Año Nuevo (unidades en px y frames a 60 fps). */
export const CONFIG_FUEGOS = {
  /** Frames de espera entre cohetes. */
  esperaMin: 50,
  esperaMax: 120,
  maxCohetes: 2,
  gravedad: 0.05,
  /** Altura de la explosión como fracción del alto de pantalla (desde arriba). */
  alturaMin: 0.12,
  alturaMax: 0.45,
  chispasMin: 40,
  chispasMax: 60,
  velocidadChispaMin: 2.2,
  velocidadChispaMax: 3.4,
  friccion: 0.965,
  gravedadChispa: 0.03,
  vidaMin: 55,
  vidaMax: 90,
  /** Probabilidad de que una chispa sea del color "brillo" en lugar del de la explosión. */
  probabilidadBrillo: 0.2,
  /** Largo de la estela de cada chispa (multiplica su velocidad). */
  estela: 3,
  grosorChispa: 2.2,
};
