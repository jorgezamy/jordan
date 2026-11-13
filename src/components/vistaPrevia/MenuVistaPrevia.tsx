"use client";

import { ArrowDownIcon } from "../ui/ArrowDownIcon";
import { SparkleIcon } from "../ui/SparkleIcon";
import { BotonRecarga } from "./BotonRecarga";
import { useMenuVistaPrevia } from "./useMenuVistaPrevia";

/** Opción "Probar decoraciones" del menú de cuenta, con un botón por festivo y temporada. */
export function MenuVistaPrevia() {
  const { abierto, grupos, alternar } = useMenuVistaPrevia();

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={alternar}
        aria-expanded={abierto}
        className="flex items-center gap-2.5 text-white text-sm rounded-lg px-2.5 py-2 hover:bg-white/10 transition"
      >
        <SparkleIcon className="w-4 h-4 text-white/60" />
        <span className="flex-1 text-left">Probar decoraciones</span>
        <ArrowDownIcon className={`w-3.5 h-3.5 text-white/60 transition-transform ${abierto ? "rotate-180" : ""}`} />
      </button>

      {abierto && (
        <div className="mx-1 mt-1 mb-1 max-h-72 overflow-y-auto rounded-lg bg-white/5 p-2 motion-safe:animate-[fade-in_0.2s_ease-out]">
          {grupos.map(({ titulo, opciones }) => (
            <div key={titulo} className="mb-2 last:mb-0">
              <p className="px-1.5 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/50">{titulo}</p>
              {opciones.map(({ etiqueta, cuando, href }) => (
                <BotonRecarga
                  key={href}
                  href={href}
                  className="w-full flex items-center justify-between gap-3 rounded-md px-1.5 py-1.5 text-xs text-white hover:bg-white/10 transition"
                >
                  <span>{etiqueta}</span>
                  <span className="shrink-0 text-white/50">{cuando}</span>
                </BotonRecarga>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
