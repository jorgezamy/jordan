import type { ConfigCaida, Escena, FormaParticula, OpcionesEscena } from "./types";
import { crearParticula, dibujarParticula } from "./dibujo";

const TITILAN: FormaParticula[] = ["estrella"];

/** Partículas que caen (nieve, pétalos, hojas) o suben (destellos) en bucle. */
export function crearEscenaCaida(
  cfg: ConfigCaida,
  numColores: number,
  ancho: number,
  alto: number,
  opciones: OpcionesEscena,
): Escena {
  // Con `colorCentro`, el último color es solo para el centro de las flores.
  const coloresParticula = cfg.colorCentro ? numColores - 1 : numColores;
  const porArea = Math.round((ancho * alto * cfg.densidad * opciones.densidad) / 10000);
  const total = Math.max(opciones.minimo, Math.min(cfg.max, porArea));
  const particulas = Array.from({ length: total }, () => crearParticula(cfg, ancho, alto, coloresParticula));
  const direccion = cfg.sube ? -1 : 1;

  return {
    redimensionar(nuevoAncho, nuevoAlto) {
      // Las que queden fuera reaparecen solas por arriba (o abajo) en el siguiente frame.
      ancho = nuevoAncho;
      alto = nuevoAlto;
    },
    actualizar(paso) {
      for (const p of particulas) {
        p.y += direccion * p.velocidad * paso;
        p.fase += 0.01 * paso;
        p.x += Math.sin(p.fase) * cfg.vaiven * paso;
        p.angulo += p.giro * paso;

        const salio = cfg.sube ? p.y + p.radio * 3 < 0 : p.y - p.radio * 3 > alto;
        if (salio) Object.assign(p, crearParticula(cfg, ancho, alto, coloresParticula, true));
        if (p.x > ancho + p.radio) p.x = -p.radio;
        else if (p.x < -p.radio) p.x = ancho + p.radio;
      }
    },
    dibujar(ctx, colores, contorno) {
      const centro = colores[numColores - 1];
      const conContorno = contorno !== "" && contorno !== "transparent";
      ctx.lineWidth = 1;
      ctx.strokeStyle = contorno;
      for (const p of particulas) {
        const titileo = TITILAN.includes(p.forma) ? 0.6 + 0.4 * Math.sin(p.fase * 6) : 1;
        ctx.globalAlpha = p.opacidad * titileo;
        ctx.fillStyle = colores[p.color];
        dibujarParticula(ctx, p, centro, conContorno);
      }
    },
  };
}
