import { ReactNode } from "react";

interface BarraCapituloFijaProps {
  titulo: string;
  version: string;
  children?: ReactNode;
}

// Barra fija arriba con "Libro capítulo" que aparece al hacer scroll dentro
// del capítulo, cuando los controles de arriba ya no se ven.
export function BarraCapituloFija({ titulo, version, children }: BarraCapituloFijaProps) {
  return (
    <div className="fixed top-0 inset-x-0 z-30 border-b border-primary/10 dark:border-white/10 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md shadow-sm motion-safe:animate-[slide-down_0.25s_ease-out]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-base font-bold text-gray-900 dark:text-white">
          {titulo}
          <span className="ml-2 text-xs font-semibold text-accent">{version}</span>
        </p>
        {children}
      </div>
    </div>
  );
}
