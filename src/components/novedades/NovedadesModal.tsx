"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { CloseIcon } from "../ui/CloseIcon";
import { NOVEDADES } from "./constants";
import { useNovedades } from "./useNovedades";

const EXIT_MS = 220;

export function NovedadesModal() {
  const { visible, cerrar } = useNovedades();
  const [cerrando, setCerrando] = useState(false);

  if (!visible) return null;

  const handleCerrar = () => {
    setCerrando(true);
    setTimeout(cerrar, EXIT_MS);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm ${
        cerrando
          ? "motion-safe:animate-[fade-out_0.22s_ease-in_forwards]"
          : "motion-safe:animate-[fade-in_0.25s_ease-out]"
      }`}
      onClick={handleCerrar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-accent-subtle dark:border-white/10 bg-white dark:bg-surface-dark shadow-2xl p-6 sm:p-8 ${
          cerrando
            ? "motion-safe:animate-[modal-out_0.22s_ease-in_forwards]"
            : "motion-safe:animate-[modal-in_0.35s_cubic-bezier(0.34,1.56,0.64,1)_forwards]"
        }`}
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent/15 dark:bg-accent/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <button
            onClick={handleCerrar}
            aria-label="Cerrar"
            className="absolute -top-1 -right-1 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-white/10 dark:hover:text-white transition"
          >
            <CloseIcon />
          </button>

          <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent">
            Novedades
          </span>
          <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">Esto es lo nuevo</h2>

          <ul className="mt-5 space-y-4">
            {NOVEDADES.map((n) => (
              <li key={n.titulo} className="flex gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{n.titulo}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{n.descripcion}</p>
                </div>
              </li>
            ))}
          </ul>

          <Button onClick={handleCerrar} className="w-full mt-6 py-2.5 rounded-xl font-medium">
            Entendido
          </Button>
        </div>
      </div>
    </div>
  );
}
