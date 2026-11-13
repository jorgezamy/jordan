"use client";

import { useValorDelCliente } from "../../hooks/useValorDelCliente";
import { BotonRecarga } from "./BotonRecarga";
import { descripcionVistaPrevia } from "./utils";

const leer = () => descripcionVistaPrevia(window.location.search);

/** Franja en el inicio mientras se ve una vista previa, con botón para salir. */
export function AvisoVistaPrevia() {
  const descripcion = useValorDelCliente(leer, null);
  if (!descripcion) return null;

  return (
    <div className="flex items-center gap-3 rounded-full border border-accent/40 bg-accent-subtle/70 dark:bg-surface-dark/80 py-1.5 pl-4 pr-1.5 text-xs font-medium text-primary dark:text-white shadow-sm">
      <span>{descripcion}</span>
      <BotonRecarga
        href="/"
        className="rounded-full bg-accent px-3 py-1 font-bold text-white hover:bg-accent-hover transition"
      >
        Salir
      </BotonRecarga>
    </div>
  );
}
