"use client";

import { useEffect, useRef } from "react";
import { MAX_DPR, OPCIONES_PAGINA, VARIABLE_CONTORNO } from "./constants";
import { EFECTOS } from "./efectos";
import type { Escena, NombreEfecto, OpcionesEscena } from "./types";

/**
 * Anima `efecto` sobre el canvas devuelto, ajustándose a su tamaño en pantalla.
 * Con `efecto` null o "reducir movimiento" activado no dibuja nada, y se pausa
 * mientras el canvas no es visible.
 */
export function useLienzoAnimado(efecto: NombreEfecto | null, opciones: OpcionesEscena = OPCIONES_PAGINA) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { densidad, minimo, escala } = opciones;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !efecto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const definicion = EFECTOS[efecto];
    let escena: Escena | null = null;
    let ancho = 0;
    let alto = 0;
    let frame = 0;
    let ultimo = performance.now();
    let visible = true;
    let colores: string[] = [];
    let contorno = "";

    // Los colores salen de variables CSS del propio canvas (respeta `fondo-oscuro`
    // del header). Solo cambian con el tema, así que se leen al iniciar y cuando
    // cambia la clase de <html>, no en cada frame.
    const leerColores = () => {
      const estilos = getComputedStyle(canvas);
      colores = definicion.variables.map((v) => estilos.getPropertyValue(v).trim());
      contorno = estilos.getPropertyValue(VARIABLE_CONTORNO).trim();
    };

    const ajustarTamano = () => {
      const caja = canvas.getBoundingClientRect();
      const nuevoAncho = Math.round(caja.width);
      const nuevoAlto = Math.round(caja.height);
      if (nuevoAncho === ancho && nuevoAlto === alto) return;
      if (!nuevoAncho || !nuevoAlto) {
        ancho = alto = 0;
        escena = null;
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = nuevoAncho * dpr;
      canvas.height = nuevoAlto * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Solo el alto cambió (barra del navegador móvil al hacer scroll): se
      // conserva la escena para que las partículas no "brinquen".
      if (escena && nuevoAncho === ancho) escena.redimensionar(nuevoAncho, nuevoAlto);
      else escena = definicion.crearEscena(nuevoAncho, nuevoAlto, { densidad, minimo, escala });
      ancho = nuevoAncho;
      alto = nuevoAlto;
    };

    const dibujar = (ahora: number) => {
      frame = requestAnimationFrame(dibujar);
      // Normaliza a 60 fps para que la velocidad no dependa de la pantalla.
      const paso = Math.min((ahora - ultimo) / (1000 / 60), 3);
      ultimo = ahora;
      if (!visible || !escena) return;

      ctx.clearRect(0, 0, ancho, alto);
      escena.actualizar(paso);
      escena.dibujar(ctx, colores, contorno);
      ctx.globalAlpha = 1;
    };

    const alCambiarTamano = new ResizeObserver(ajustarTamano);
    alCambiarTamano.observe(canvas);
    const alCambiarVisibilidad = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    alCambiarVisibilidad.observe(canvas);
    const alCambiarTema = new MutationObserver(leerColores);
    alCambiarTema.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    leerColores();
    ajustarTamano();
    frame = requestAnimationFrame(dibujar);

    return () => {
      cancelAnimationFrame(frame);
      alCambiarTamano.disconnect();
      alCambiarVisibilidad.disconnect();
      alCambiarTema.disconnect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [efecto, densidad, minimo, escala]);

  return canvasRef;
}
