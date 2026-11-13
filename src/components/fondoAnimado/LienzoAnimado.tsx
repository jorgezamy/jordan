"use client";

import type { NombreEfecto, OpcionesEscena } from "./types";
import { useLienzoAnimado } from "./useLienzoAnimado";

interface LienzoAnimadoProps {
  efecto: NombreEfecto | null;
  opciones?: OpcionesEscena;
  className?: string;
}

/** Canvas decorativo con un efecto de temporada (no recibe clics). */
export function LienzoAnimado({ efecto, opciones, className = "" }: LienzoAnimadoProps) {
  const canvasRef = useLienzoAnimado(efecto, opciones);
  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
