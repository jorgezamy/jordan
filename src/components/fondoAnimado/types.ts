export type NombreEfecto = "nieve" | "anoNuevo" | "primavera" | "verano" | "otono";

import type { RangoAnual } from "../../lib/fechas";

export interface Temporada extends RangoAnual {
  efecto: NombreEfecto;
}

/** Una animación en curso: se actualiza y se dibuja en cada frame. */
export interface Escena {
  /** `paso` = frames transcurridos normalizados a 60 fps. */
  actualizar(paso: number): void;
  /**
   * Cambio de tamaño sin recrear la escena (p. ej. la barra del navegador móvil
   * aparece/desaparece al hacer scroll): las partículas siguen donde estaban.
   */
  redimensionar(ancho: number, alto: number): void;
  /**
   * `colores` = valores ya resueltos de las variables CSS del efecto.
   * `contorno` = color del borde fino que da contraste sobre fondo claro ("" = sin borde).
   */
  dibujar(ctx: CanvasRenderingContext2D, colores: string[], contorno: string): void;
}

/** Ajustes según dónde se dibuja el efecto (página completa, header, vista previa). */
export interface OpcionesEscena {
  /** Multiplica la densidad de partículas (zonas chicas como el header necesitan más). */
  densidad: number;
  /** Mínimo de partículas, para que una zona angosta (header en móvil) no quede vacía. */
  minimo: number;
  /** Escala de tamaño de los fuegos artificiales (1 = página completa). */
  escala: number;
}

export interface DefinicionEfecto {
  /** Variables CSS (globals.css) con los colores, para seguir el tema claro/oscuro. */
  variables: string[];
  crearEscena(ancho: number, alto: number, opciones: OpcionesEscena): Escena;
}

export type FormaParticula = "circulo" | "copo" | "petalo" | "flor" | "hoja" | "sol" | "estrella";

/** Parámetros de un efecto de partículas que caen (o suben). */
export interface ConfigCaida {
  /** Se elige una al azar por partícula (repetir una forma la hace más frecuente). */
  formas: FormaParticula[];
  /** Partículas por cada 10 000 px² de pantalla. */
  densidad: number;
  max: number;
  radioMin: number;
  radioMax: number;
  /** px por frame (a 60 fps). */
  velocidadMin: number;
  velocidadMax: number;
  /** Amplitud del vaivén horizontal en px por frame. */
  vaiven: number;
  opacidadMin: number;
  opacidadMax: number;
  /** Velocidad máxima de giro en radianes por frame (0 = no gira). */
  giro: number;
  /** Si es true, las partículas suben en lugar de caer. */
  sube?: boolean;
  /**
   * Si existe, la última variable de color del efecto se reserva para el centro
   * de las flores y no se usa como color de partícula.
   */
  colorCentro?: boolean;
}

export interface Particula {
  forma: FormaParticula;
  x: number;
  y: number;
  radio: number;
  velocidad: number;
  opacidad: number;
  /** Fase del vaivén horizontal / parpadeo. */
  fase: number;
  angulo: number;
  giro: number;
  /** Índice dentro de la lista de colores del efecto. */
  color: number;
}

export interface Cohete {
  x: number;
  y: number;
  vy: number;
  color: number;
}

export interface Chispa {
  x: number;
  y: number;
  vx: number;
  vy: number;
  vida: number;
  vidaMax: number;
  color: number;
}
