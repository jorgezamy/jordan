"use client";

import { construirFilasArrastre, useReordenarLista } from "../../hooks/useReordenarLista";
import { GripIcon } from "../ui/GripIcon";
import { AvisoAdminCard } from "./AvisoAdminCard";
import { useAvisosAdmin } from "./useAvisosAdmin";
import { esVisible } from "./utils";

interface ListaAvisosAdminProps {
  admin: ReturnType<typeof useAvisosAdmin>;
}

export function ListaAvisosAdmin({ admin }: ListaAvisosAdminProps) {
  const { avisos, loading, confirmando, empezarEdicion, pedirEliminar, cancelarConfirmacion, confirmarAccion, guardarOrden } =
    admin;

  const { items, arrastrandoId, offsetY, indiceDestino, registrarRef, dragHandleProps } = useReordenarLista(
    avisos,
    guardarOrden,
  );

  const ahora = new Date();
  const filas = construirFilasArrastre(items, arrastrandoId, indiceDestino);

  return (
    <>
      <hr className="border-t border-primary/15 dark:border-white/15 mb-6" />

      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-1">
        Avisos publicados
      </h2>

      {!loading && avisos.length > 1 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Arrastra <GripIcon className="w-3.5 h-3.5 inline -mt-0.5" /> para ordenarlos — ese orden es el
          que se muestra en el carrusel de inicio.
        </p>
      )}

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Cargando avisos...</p>
      ) : avisos.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No hay avisos todavía.</p>
      ) : (
        <ul className="space-y-4">
          {filas.map((fila) => {
            if (fila.tipo === "hueco") {
              return (
                <li
                  key="hueco"
                  className="h-1.5 -my-2.5 rounded-full bg-accent motion-safe:animate-[fade-in_0.15s_ease-out]"
                />
              );
            }

            const a = fila.item;

            return (
              <AvisoAdminCard
                key={a.id}
                aviso={a}
                activo={esVisible(a, ahora)}
                arrastrando={a.id === arrastrandoId}
                offsetY={offsetY}
                refCallback={registrarRef(a.id)}
                dragHandleProps={dragHandleProps(a.id)}
                confirmandoEliminar={confirmando?.accion === "eliminar" && confirmando.id === a.id}
                onEditar={() => empezarEdicion(a)}
                onPedirEliminar={() => pedirEliminar(a.id)}
                onConfirmarEliminar={confirmarAccion}
                onCancelarConfirmacion={cancelarConfirmacion}
              />
            );
          })}
        </ul>
      )}
    </>
  );
}
