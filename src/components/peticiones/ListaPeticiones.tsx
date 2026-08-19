"use client";

import { User } from "firebase/auth";

import { PeticionCard } from "./PeticionCard";
import { usePeticionesData } from "./usePeticionesData";
import { usePeticionesFiltro } from "./usePeticionesFiltro";

interface ListaPeticionesProps {
  data: ReturnType<typeof usePeticionesData>;
  filtro: ReturnType<typeof usePeticionesFiltro>;
  user: User | null;
}

export function ListaPeticiones({ data, filtro, user }: ListaPeticionesProps) {
  const {
    peticiones,
    loading,
    confirmando,
    pedirConfirmacion,
    cancelarConfirmacion,
    ejecutarAccion,
  } = data;
  const { busqueda, estadoFiltro, peticionesFiltradas } = filtro;

  return (
    <>
      <hr className="border-t border-primary/15 dark:border-white/15 mb-6" />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 shrink-0">Lista de Peticiones</h2>
        {(busqueda || estadoFiltro !== "todos") && (
          <span className="text-sm font-semibold text-primary dark:text-white bg-primary/10 dark:bg-white/10 px-2 py-0.5 rounded-full whitespace-nowrap">
            {peticionesFiltradas.length} resultado{peticionesFiltradas.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Cargando peticiones...</p>
      ) : peticiones.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No hay peticiones todavía.</p>
      ) : peticionesFiltradas.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          {busqueda ? (
            <>
              No se encontraron peticiones para{" "}
              <span className="font-medium text-primary dark:text-white">"{busqueda}"</span>.
            </>
          ) : (
            "No hay peticiones con este filtro."
          )}
        </p>
      ) : (
        <ul className="space-y-4">
          {peticionesFiltradas.map((p) => (
            <PeticionCard
              key={p.id}
              p={p}
              user={user}
              confirmando={confirmando}
              pedirConfirmacion={pedirConfirmacion}
              cancelarConfirmacion={cancelarConfirmacion}
              ejecutarAccion={ejecutarAccion}
            />
          ))}
        </ul>
      )}
    </>
  );
}
