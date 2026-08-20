"use client";

import { useCitaBiblica } from "./useCitaBiblica";

export function CitaBiblicaCard() {
  const { cita, loading } = useCitaBiblica();

  if (loading || !cita) return null;

  return (
    <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-accent-subtle dark:border-white/10 bg-gradient-to-br from-accent-subtle/60 via-white to-white dark:from-primary-darker dark:via-surface-dark dark:to-surface-dark shadow-[0_10px_40px_rgba(20,184,166,0.12)] px-6 py-7 sm:px-8 sm:py-8 motion-safe:animate-[fade-in_0.4s_ease-out]">
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent/20 dark:bg-accent/10 rounded-full blur-3xl" />

      <span
        aria-hidden
        className="absolute -top-3 left-4 font-serif text-8xl text-accent/10 dark:text-accent/15 select-none leading-none"
      >
        &ldquo;
      </span>

      <div className="relative z-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent">
          Dios te habla hoy
        </span>

        <p className="mt-3 font-serif italic text-lg sm:text-xl text-gray-800 dark:text-gray-100 leading-relaxed">
          &ldquo;{cita.texto}&rdquo;
        </p>

        <p className="mt-3 text-sm font-semibold text-accent-hover dark:text-accent">
          — {cita.referencia} <span className="font-medium opacity-70">({cita.version})</span>
        </p>
      </div>
    </div>
  );
}
