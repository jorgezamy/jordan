"use client";

import { DragHandleGestureProps } from "../../hooks/useReordenarLista";
import { Button } from "../ui/Button";
import { DragHandle } from "../ui/DragHandle";
import { Aviso } from "./types";
import { describirProgramacion, formatFecha } from "./utils";

interface AvisoAdminCardProps {
  aviso: Aviso;
  activo: boolean;
  arrastrando: boolean;
  refCallback: (el: HTMLLIElement | null) => void;
  dragHandleProps: DragHandleGestureProps;
  confirmandoEliminar: boolean;
  onEditar: () => void;
  onPedirEliminar: () => void;
  onConfirmarEliminar: () => void;
  onCancelarConfirmacion: () => void;
}

export function AvisoAdminCard({
  aviso,
  activo,
  arrastrando,
  refCallback,
  dragHandleProps,
  confirmandoEliminar,
  onEditar,
  onPedirEliminar,
  onConfirmarEliminar,
  onCancelarConfirmacion,
}: AvisoAdminCardProps) {
  return (
    <li
      ref={refCallback}
      // El transform del arrastre lo escribe useReordenarLista directamente
      // en el DOM (ver ese hook) — aquí solo position/z-index, que sí puede
      // ir por el ciclo normal de React porque no cambia en cada pixel.
      style={arrastrando ? { position: "relative", zIndex: 30 } : undefined}
      className={`p-4 rounded-lg border-t border-r border-b border-t-gray-200 border-r-gray-200 border-b-gray-200 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 border-l-4 shadow-sm bg-white dark:bg-surface-dark ${
        activo ? "border-l-success" : "border-l-gray-300 dark:border-l-gray-600"
      } ${arrastrando ? "shadow-xl ring-2 ring-accent" : ""}`}
    >
      <div className="flex sm:justify-between sm:items-start gap-2">
        <DragHandle {...dragHandleProps} />

        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div className="flex gap-3 min-w-0">
            {aviso.bannerUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={aviso.bannerUrl}
                alt=""
                className="w-16 h-16 shrink-0 rounded-lg object-cover border border-gray-200 dark:border-white/10"
              />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {aviso.importante && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-accent text-white">
                    Importante
                  </span>
                )}
                {!activo && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400">
                    Inactivo
                  </span>
                )}
                <strong className="text-lg text-gray-900 dark:text-white">{aviso.titulo}</strong>
              </div>
              {aviso.descripcion && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{aviso.descripcion}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {describirProgramacion(aviso)}
                {" · "}Publicado: {formatFecha(aviso.fechaCreacion)}
              </p>
            </div>
          </div>

          {confirmandoEliminar ? (
            <div className="flex flex-col items-end gap-2 shrink-0">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">¿Eliminar este aviso?</p>
              <div className="flex gap-2">
                <Button onClick={onConfirmarEliminar} variant="danger" className="px-3 py-1 rounded-md text-sm">
                  Sí, eliminar
                </Button>
                <Button
                  onClick={onCancelarConfirmacion}
                  variant="secondary"
                  className="px-3 py-1 rounded-md text-sm"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 shrink-0">
              <Button onClick={onEditar} variant="secondary" className="px-3 py-1 rounded-md text-sm">
                Editar
              </Button>
              <Button onClick={onPedirEliminar} variant="danger" className="px-3 py-1 rounded-md text-sm">
                Eliminar
              </Button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
