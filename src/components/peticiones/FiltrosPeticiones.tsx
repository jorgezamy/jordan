"use client";

import { User } from "firebase/auth";

import { SegmentedControl } from "../ui/SegmentedControl";
import { TextInput } from "../ui/TextInput";
import { ORDEN_OPCIONES } from "./constants";
import { usePeticionesFiltro } from "./usePeticionesFiltro";

interface FiltrosPeticionesProps {
  filtro: ReturnType<typeof usePeticionesFiltro>;
  user: User | null;
}

export function FiltrosPeticiones({ filtro, user }: FiltrosPeticionesProps) {
  const {
    busqueda,
    setBusqueda,
    estadoFiltro,
    setEstadoFiltro,
    ordenAsc,
    setOrdenAsc,
    estadoOpciones,
  } = filtro;

  return (
    <div className="mt-10 mb-6">
      <hr className="border-t border-primary/15 dark:border-white/15 mb-4" />
      <h2 className="text-sm font-semibold text-primary/70 dark:text-white/70 uppercase tracking-wide mb-3">
        Buscar y filtrar
      </h2>

      <div className="relative mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 dark:text-white/50 pointer-events-none"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <TextInput
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, descripción o número."
          className="w-full rounded-full pl-9 pr-9 py-2 text-sm"
        />
        {busqueda && (
          <button
            onClick={() => setBusqueda("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 dark:bg-white/20 hover:bg-primary/40 hover:dark:bg-white/40 text-primary dark:text-white transition"
            aria-label="Limpiar búsqueda"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SegmentedControl
          options={estadoOpciones}
          value={estadoFiltro}
          onChange={setEstadoFiltro}
          className="flex w-full sm:w-auto"
          optionClassName={`flex-1 sm:flex-none py-2 sm:py-1.5 sm:px-3 sm:text-sm ${
            user ? "px-1 text-xs" : "px-2 text-sm"
          }`}
        />

        <SegmentedControl
          options={ORDEN_OPCIONES}
          value={ordenAsc ? "asc" : "desc"}
          onChange={(key) => setOrdenAsc(key === "asc")}
          className="grid grid-cols-2 mx-auto sm:flex sm:mx-0 sm:ml-auto"
          optionClassName="px-4 py-2 sm:px-3 sm:py-1.5 text-sm"
        />
      </div>
    </div>
  );
}
