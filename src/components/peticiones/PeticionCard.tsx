"use client";

import { User } from "firebase/auth";

import { Button } from "../ui/Button";
import { AccionPeticion, Confirmacion, Peticion } from "./types";
import { formatFecha } from "./utils";

interface PeticionCardProps {
  p: Peticion;
  user: User | null;
  confirmando: Confirmacion | null;
  pedirConfirmacion: (id: string, accion: AccionPeticion) => void;
  cancelarConfirmacion: () => void;
  ejecutarAccion: (id: string, accion: AccionPeticion) => void;
}

export function PeticionCard({
  p,
  user,
  confirmando,
  pedirConfirmacion,
  cancelarConfirmacion,
  ejecutarAccion,
}: PeticionCardProps) {
  return (
    <li className="p-4 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-surface-dark">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {p.numero !== undefined && (
            <span className="shrink-0 text-xs font-mono font-semibold text-primary/70 dark:text-white/70 bg-primary/10 dark:bg-white/10 px-2 py-0.5 rounded-full border border-primary/20 dark:border-white/20">
              #{p.numero}
            </span>
          )}
          <strong className="text-lg text-gray-900 dark:text-white">{p.nombre}</strong>
        </div>

        <span
          className={`self-start sm:self-auto px-3 py-1 text-sm font-semibold rounded-full whitespace-nowrap ${p.estado === "resuelto"
            ? "bg-success text-white"
            : p.estado === "pendiente"
              ? "bg-yellow-400 text-gray-900"
              : "bg-danger text-white"
            }`}
        >
          {p.estado === "resuelto"
            ? "✅ Resuelto"
            : p.estado === "pendiente"
              ? "⏳ Pendiente"
              : "🚫 Cancelada"}
        </span>
      </div>

      <div
        className="text-gray-700 dark:text-gray-300 text-sm mt-3 prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: p.texto }}
      />

      <div className="text-sm text-gray-500 dark:text-gray-400 mt-3">
        {p.estado === "pendiente" && (
          <span>Creada: {formatFecha(p.fechaCreacion)}</span>
        )}
        {p.estado === "resuelto" && (
          <span>Resuelta: {formatFecha(p.fechaResuelta)}</span>
        )}
        {p.estado === "eliminada" && (
          <span>Cancelada: {formatFecha(p.fechaEliminada)}</span>
        )}
      </div>

      {user && (p.telefono || p.correo) && (
        <div className="mt-3 flex flex-wrap gap-3 rounded-lg bg-primary/5 dark:bg-white/5 border border-primary/15 dark:border-white/15 px-3 py-2">
          <span className="flex items-center gap-1 text-sm text-primary/60 dark:text-white/60 font-medium shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3 h-3"
            >
              <path
                fillRule="evenodd"
                d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                clipRule="evenodd"
              />
            </svg>
            Contacto:
          </span>
          {p.telefono && (
            <a
              href={`tel:${p.telefono}`}
              className="flex items-center gap-1 text-sm text-primary dark:text-white font-medium hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                  clipRule="evenodd"
                />
              </svg>
              {p.telefono}
            </a>
          )}
          {p.correo && (
            <a
              href={`mailto:${p.correo}`}
              className="flex items-center gap-1 text-sm text-primary dark:text-white font-medium hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
              </svg>
              {p.correo}
            </a>
          )}
        </div>
      )}

      {user && (
        <div className="mt-4">
          {confirmando?.id === p.id ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {confirmando.accion === "resuelto"
                  ? "¿Marcar esta petición como resuelta?"
                  : confirmando.accion === "eliminada"
                    ? "¿Cancelar esta petición?"
                    : confirmando.accion === "restaurar"
                      ? "¿Devolver esta petición a pendientes?"
                      : "¿Eliminar esta petición de forma permanente? Esta acción no se puede deshacer."}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => ejecutarAccion(p.id, confirmando.accion)}
                  variant={
                    confirmando.accion === "resuelto" ||
                      confirmando.accion === "restaurar"
                      ? "success"
                      : "danger"
                  }
                  className="px-4 py-1.5 rounded-md text-sm font-medium"
                >
                  Sí, confirmar
                </Button>
                <Button
                  onClick={cancelarConfirmacion}
                  variant="secondary"
                  className="px-4 py-1.5 rounded-md text-sm"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 justify-center">
              {p.estado === "pendiente" && (
                <>
                  <Button
                    onClick={() => pedirConfirmacion(p.id, "resuelto")}
                    variant="success"
                    className="px-3 py-1 rounded-md text-sm"
                    title="Marcar como resuelta"
                  >
                    ✔
                  </Button>
                  <Button
                    onClick={() => pedirConfirmacion(p.id, "eliminada")}
                    variant="danger"
                    className="flex items-center justify-center px-3 py-1 rounded-md text-sm"
                    title="Cancelar petición"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3.5}
                      strokeLinecap="round"
                      className="w-4 h-4"
                    >
                      <path d="M6 6l12 12M18 6 6 18" />
                    </svg>
                  </Button>
                </>
              )}
              {p.estado === "resuelto" && (
                <Button
                  onClick={() => pedirConfirmacion(p.id, "restaurar")}
                  className="px-3 py-1 rounded-md text-sm"
                  title="Devolver a pendientes"
                >
                  ↺ Devolver a pendientes
                </Button>
              )}
              {p.estado === "eliminada" && (
                <>
                  <Button
                    onClick={() => pedirConfirmacion(p.id, "restaurar")}
                    className="px-3 py-1 rounded-md text-sm"
                    title="Devolver a pendientes"
                  >
                    ↺ Devolver a pendientes
                  </Button>
                  <Button
                    onClick={() => pedirConfirmacion(p.id, "eliminar_permanente")}
                    variant="danger"
                    className="px-3 py-1 rounded-md text-sm"
                    title="Eliminar permanentemente"
                  >
                    🗑 Eliminar permanentemente
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
