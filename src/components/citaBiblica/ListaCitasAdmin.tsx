"use client";

import { Button } from "../ui/Button";
import { useCitasAdmin } from "./useCitasAdmin";
import { formatFecha } from "./utils";

interface ListaCitasAdminProps {
  admin: ReturnType<typeof useCitasAdmin>;
}

export function ListaCitasAdmin({ admin }: ListaCitasAdminProps) {
  const { citas, loading, confirmando, empezarEdicion, pedirEliminar, cancelarConfirmacion, confirmarAccion } =
    admin;

  return (
    <>
      <hr className="border-t border-primary/15 dark:border-white/15 mb-6" />

      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Historial de citas
      </h2>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Cargando citas...</p>
      ) : citas.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No hay citas todavía.</p>
      ) : (
        <ul className="space-y-4">
          {citas.map((c, i) => {
            const confirmandoEliminar = confirmando?.accion === "eliminar" && confirmando.id === c.id;

            return (
              <li
                key={c.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-surface-dark"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {i === 0 && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-success text-white">
                          Actual
                        </span>
                      )}
                      <strong className="text-sm text-gray-900 dark:text-white">
                        {c.referencia} <span className="font-normal text-gray-500 dark:text-gray-400">({c.version})</span>
                      </strong>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 italic">
                      &ldquo;{c.texto}&rdquo;
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Publicada: {formatFecha(c.fechaCreacion)}
                    </p>
                  </div>

                  {confirmandoEliminar ? (
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        ¿Eliminar esta cita?
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={confirmarAccion}
                          variant="danger"
                          className="px-3 py-1 rounded-md text-sm"
                        >
                          Sí, eliminar
                        </Button>
                        <Button
                          onClick={cancelarConfirmacion}
                          variant="secondary"
                          className="px-3 py-1 rounded-md text-sm"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        onClick={() => empezarEdicion(c)}
                        variant="secondary"
                        className="px-3 py-1 rounded-md text-sm"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => pedirEliminar(c.id)}
                        variant="danger"
                        className="px-3 py-1 rounded-md text-sm"
                      >
                        Eliminar
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
