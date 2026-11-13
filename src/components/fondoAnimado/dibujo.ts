import type { ConfigCaida, Particula } from "./types";

export const entre = (min: number, max: number) => min + Math.random() * (max - min);

export function crearParticula(
  cfg: ConfigCaida,
  ancho: number,
  alto: number,
  numColores: number,
  enEntrada = false,
): Particula {
  const radio = entre(cfg.radioMin, cfg.radioMax);
  // Las partículas grandes se mueven más rápido: da sensación de profundidad.
  const t = (radio - cfg.radioMin) / (cfg.radioMax - cfg.radioMin || 1);
  const entrada = cfg.sube ? alto + radio * 3 : -radio * 3;
  return {
    forma: cfg.formas[Math.floor(Math.random() * cfg.formas.length)],
    x: Math.random() * ancho,
    y: enEntrada ? entrada : Math.random() * alto,
    radio,
    velocidad: cfg.velocidadMin + t * (cfg.velocidadMax - cfg.velocidadMin),
    opacidad: entre(cfg.opacidadMin, cfg.opacidadMax),
    fase: Math.random() * Math.PI * 2,
    angulo: Math.random() * Math.PI * 2,
    giro: entre(-cfg.giro, cfg.giro),
    color: Math.floor(Math.random() * numColores),
  };
}

/** Pétalo de cerezo (con muesca en la punta), apuntando hacia arriba desde el origen. */
function trazarPetalo(ctx: CanvasRenderingContext2D, r: number) {
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(r * 0.55, -r * 0.25, r * 0.5, -r * 0.85, r * 0.18, -r);
  ctx.lineTo(0, -r * 0.82);
  ctx.lineTo(-r * 0.18, -r);
  ctx.bezierCurveTo(-r * 0.5, -r * 0.85, -r * 0.55, -r * 0.25, 0, 0);
}

function trazarEstrella(ctx: CanvasRenderingContext2D, r: number) {
  // Destello de 4 puntas con lados curvos.
  const k = r * 0.18;
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(k, -k, r, 0);
  ctx.quadraticCurveTo(k, k, 0, r);
  ctx.quadraticCurveTo(-k, k, -r, 0);
  ctx.quadraticCurveTo(-k, -k, 0, -r);
}

function rellenar(ctx: CanvasRenderingContext2D, conContorno: boolean) {
  ctx.fill();
  if (conContorno) ctx.stroke();
}

/** Traza la ruta actual con el color de relleno, con un borde debajo si `conContorno`. */
function trazoConContorno(ctx: CanvasRenderingContext2D, conContorno: boolean) {
  if (conContorno) {
    ctx.save();
    ctx.lineWidth += 2;
    ctx.stroke();
    ctx.restore();
  }
  ctx.strokeStyle = ctx.fillStyle;
  ctx.stroke();
}

/**
 * Dibuja una partícula con el `fillStyle` actual. `centro` es el color del
 * centro de las flores; `conContorno` agrega el borde fino (`strokeStyle`).
 */
export function dibujarParticula(
  ctx: CanvasRenderingContext2D,
  p: Particula,
  centro: string,
  conContorno: boolean,
) {
  const r = p.radio;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angulo);
  ctx.beginPath();

  switch (p.forma) {
    case "circulo":
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.lineWidth = 0.75;
      rellenar(ctx, conContorno);
      break;

    case "copo": {
      // Cristal de 6 brazos con ramitas; se dibuja más grande que una bolita.
      const largo = r * 2.2;
      for (let i = 0; i < 6; i++) {
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -largo);
        ctx.moveTo(0, -largo * 0.55);
        ctx.lineTo(largo * 0.25, -largo * 0.78);
        ctx.moveTo(0, -largo * 0.55);
        ctx.lineTo(-largo * 0.25, -largo * 0.78);
        ctx.rotate(Math.PI / 3);
      }
      ctx.lineCap = "round";
      ctx.lineWidth = Math.max(1.2, r * 0.4);
      trazoConContorno(ctx, conContorno);
      break;
    }

    case "petalo":
    case "hoja":
      // Achatar con el vaivén simula que la pieza voltea en 3D.
      ctx.scale(1, 0.4 + 0.6 * Math.abs(Math.cos(p.fase * 1.5)));
      if (p.forma === "petalo") {
        ctx.translate(0, r / 2);
        trazarPetalo(ctx, r);
        rellenar(ctx, conContorno);
      } else {
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(r * 0.85, 0, 0, r);
        ctx.quadraticCurveTo(-r * 0.85, 0, 0, -r);
        rellenar(ctx, conContorno);
        // Nervadura central.
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.8);
        ctx.lineTo(0, r * 1.15);
        ctx.globalAlpha *= 0.5;
        ctx.strokeStyle = centro;
        ctx.stroke();
      }
      break;

    case "flor":
      for (let i = 0; i < 5; i++) {
        trazarPetalo(ctx, r);
        ctx.rotate((Math.PI * 2) / 5);
      }
      rellenar(ctx, conContorno);
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = centro;
      ctx.fill();
      break;

    case "sol": {
      const rayos = 8;
      ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
      rellenar(ctx, conContorno);
      ctx.beginPath();
      for (let i = 0; i < rayos; i++) {
        const a = (i / rayos) * Math.PI * 2;
        ctx.moveTo(Math.cos(a) * r * 0.7, Math.sin(a) * r * 0.7);
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.lineWidth = Math.max(1.5, r * 0.16);
      ctx.lineCap = "round";
      trazoConContorno(ctx, conContorno);
      break;
    }

    case "estrella":
      trazarEstrella(ctx, r);
      rellenar(ctx, conContorno);
      break;
  }
  ctx.restore();
}
