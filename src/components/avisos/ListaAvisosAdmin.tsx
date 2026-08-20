"use client";

import { Button } from "../ui/Button";
import { useAvisosAdmin } from "./useAvisosAdmin";
import { formatFecha, formatRangoFecha } from "./utils";

interface ListaAvisosAdminProps {
  admin: ReturnType<typeof useAvisosAdmin>;
}

export function ListaAvisosAdmin({ admin }: ListaAvisosAdminProps) {
  const { avisos, loading, confirmando, empezarEdicion, pedirEliminar, cancelarConfirmacion, confirmarAccion } =
    admin;

  return (
    <>
      <hr className="border-t border-primary/15 dark:border-white/15 mb-6" />

      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Avisos publicados
      </h2>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Cargando avisos...</p>
      ) : avisos.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No hay avisos todavía.</p>
      ) : (
        <ul className="space-y-4">
          {avisos.map((a) => {
            const confirmandoEliminar = confirmando?.accion === "eliminar" && confirmando.id === a.id;

            return (
              <li
                key={a.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-surface-dark"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex gap-3 min-w-0">
                    {a.bannerUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.bannerUrl}
                        alt=""
                        className="w-16 h-16 shrink-0 rounded-lg object-cover border border-gray-200 dark:border-white/10"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {a.importante && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-accent text-white">
                            Importante
                          </span>
                        )}
                        <strong className="text-lg text-gray-900 dark:text-white">{a.titulo}</strong>
                      </div>
                      {a.descripcion && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{a.descripcion}</p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {a.fecha ? `Programado: ${formatRangoFecha(a.fecha, a.fechaFin)}` : "Sin fecha (permanente)"}
                        {" · "}Publicado: {formatFecha(a.fechaCreacion)}
                      </p>
                    </div>
                  </div>

                  {confirmandoEliminar ? (
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        ¿Eliminar este aviso?
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
                        onClick={() => empezarEdicion(a)}
                        variant="secondary"
                        className="px-3 py-1 rounded-md text-sm"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => pedirEliminar(a.id)}
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
