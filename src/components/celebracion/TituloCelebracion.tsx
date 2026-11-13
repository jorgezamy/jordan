"use client";

import { INFO_CELEBRACION } from "./constants";
import { TextoCelebracion } from "./TextoCelebracion";
import { useCelebracionDeHoy } from "./useCelebracionDeHoy";

/** Título de lo que se celebra hoy (festivo o temporada), arriba de "Dios te habla hoy". */
export function TituloCelebracion() {
  const celebracion = useCelebracionDeHoy();
  if (!celebracion) return null;

  return (
    <div className="w-full flex flex-col items-center gap-1 text-center motion-safe:animate-[fade-in_0.6s_ease-out]">
      <div className="flex items-center gap-3 w-full max-w-xs">
        <span className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/30 dark:to-white/30" />
        <span className="shrink-0 text-xs font-bold uppercase tracking-[0.25em] text-primary/60 dark:text-white/60">
          {INFO_CELEBRACION[celebracion].etiqueta}
        </span>
        <span className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/30 dark:to-white/30" />
      </div>
      <h2 className="text-3xl sm:text-5xl leading-tight pb-1">
        <TextoCelebracion celebracion={celebracion} />
      </h2>
    </div>
  );
}
