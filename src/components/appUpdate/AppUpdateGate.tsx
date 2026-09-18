"use client";

import { Button } from "../ui/Button";
import { useAppUpdate } from "./useAppUpdate";

export function AppUpdateGate() {
  const { obligatoria, fueALaTienda, abrirTienda } = useAppUpdate();

  if (!obligatoria) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="app-update-title"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-accent-subtle dark:border-white/10 bg-white dark:bg-surface-dark shadow-2xl px-6 sm:px-8 py-8 text-center"
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent/15 dark:bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <span className="relative inline-block text-xs font-bold uppercase tracking-widest text-accent">
          Actualización requerida
        </span>
        <h2
          id="app-update-title"
          className="relative mt-1 text-xl font-bold text-gray-900 dark:text-white"
        >
          Hay una nueva versión de la app
        </h2>
        <p className="relative mt-3 text-sm text-gray-600 dark:text-gray-400">
          Para seguir usando la app necesitas actualizarla desde Google Play.
        </p>

        {fueALaTienda && (
          <p className="relative mt-4 rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
            ¿Ya la actualizaste? Cierra la app por completo (deslízala fuera de las apps recientes) y
            ábrela de nuevo para terminar.
          </p>
        )}

        <Button onClick={abrirTienda} className="relative mt-6 w-full py-2.5 rounded-xl font-medium">
          Actualizar en Google Play
        </Button>
      </div>
    </div>
  );
}
