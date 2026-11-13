"use client";

import { INFO_CELEBRACION } from "./constants";
import type { NombreCelebracion } from "./types";
import { useAnoEfectivo } from "./useCelebracionDeHoy";
import { degradado, textoTitulo } from "./utils";

interface TextoCelebracionProps {
  celebracion: NombreCelebracion;
  className?: string;
}

/** Título con degradado de colores que brilla lentamente. */
export function TextoCelebracion({ celebracion, className = "" }: TextoCelebracionProps) {
  const { titulo, colores } = INFO_CELEBRACION[celebracion];
  const ano = useAnoEfectivo();
  return (
    <span
      className={`inline-block py-1 bg-clip-text text-transparent bg-[length:200%_100%] font-extrabold tracking-tight motion-safe:animate-[celebracion-brillo_6s_linear_infinite] ${className}`}
      style={{ backgroundImage: degradado(colores) }}
    >
      {textoTitulo(titulo, ano)}
    </span>
  );
}
