import { CONFIG_FUEGOS as F } from "./constants";
import type { Chispa, Cohete, Escena, OpcionesEscena } from "./types";
import { entre } from "./dibujo";

/**
 * Fuegos artificiales suaves: un cohete sube, explota en un anillo de chispas
 * que se frenan, caen y se desvanecen. El último color de la lista es el "brillo".
 */
export function crearEscenaFuegos(
  numColores: number,
  ancho: number,
  alto: number,
  { escala }: OpcionesEscena,
): Escena {
  const coloresExplosion = numColores - 1;
  let cohetes: Cohete[] = [];
  let chispas: Chispa[] = [];
  let espera = 20;

  const lanzar = (): Cohete => {
    const destino = alto * entre(F.alturaMin, F.alturaMax);
    // Velocidad justa para llegar al destino y explotar en el punto más alto.
    const vy = -Math.sqrt(2 * F.gravedad * (alto - destino));
    return { x: ancho * entre(0.15, 0.85), y: alto, vy, color: Math.floor(Math.random() * coloresExplosion) };
  };

  const explotar = (c: Cohete) => {
    const n = Math.round(entre(F.chispasMin, F.chispasMax));
    const fuerza = entre(F.velocidadChispaMin, F.velocidadChispaMax) * escala;
    for (let i = 0; i < n; i++) {
      const angulo = (i / n) * Math.PI * 2 + entre(-0.05, 0.05);
      const v = fuerza * entre(0.85, 1.1);
      const vida = entre(F.vidaMin, F.vidaMax);
      chispas.push({
        x: c.x,
        y: c.y,
        vx: Math.cos(angulo) * v,
        vy: Math.sin(angulo) * v,
        vida,
        vidaMax: vida,
        color: Math.random() < F.probabilidadBrillo ? coloresExplosion : c.color,
      });
    }
  };

  return {
    redimensionar(nuevoAncho, nuevoAlto) {
      ancho = nuevoAncho;
      alto = nuevoAlto;
    },
    actualizar(paso) {
      espera -= paso;
      if (espera <= 0 && cohetes.length < F.maxCohetes) {
        cohetes.push(lanzar());
        espera = entre(F.esperaMin, F.esperaMax);
      }

      for (const c of cohetes) {
        c.y += c.vy * paso;
        c.vy += F.gravedad * paso;
        if (c.vy >= 0) explotar(c);
      }
      cohetes = cohetes.filter((c) => c.vy < 0);

      const friccion = Math.pow(F.friccion, paso);
      for (const s of chispas) {
        s.x += s.vx * paso;
        s.y += s.vy * paso;
        s.vx *= friccion;
        s.vy = s.vy * friccion + F.gravedadChispa * escala * paso;
        s.vida -= paso;
      }
      chispas = chispas.filter((s) => s.vida > 0);
    },
    dibujar(ctx, colores) {
      ctx.lineCap = "round";

      for (const c of cohetes) {
        ctx.globalAlpha = 0.7;
        ctx.strokeStyle = colores[c.color];
        ctx.lineWidth = Math.max(1.2, 2 * escala);
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x, c.y - c.vy * 4);
        ctx.stroke();
      }

      ctx.lineWidth = Math.max(1.2, F.grosorChispa * escala);
      for (const s of chispas) {
        const t = s.vida / s.vidaMax;
        ctx.globalAlpha = t * t;
        ctx.strokeStyle = colores[s.color];
        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * F.estela, s.y - s.vy * F.estela);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
    },
  };
}
