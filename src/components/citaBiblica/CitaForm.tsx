"use client";

import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { FieldLabel } from "../ui/FieldLabel";
import { TextInput } from "../ui/TextInput";
import { VERSIONES_BIBLICAS } from "./constants";
import { useCitasAdmin } from "./useCitasAdmin";

interface CitaFormProps {
  admin: ReturnType<typeof useCitasAdmin>;
  mensajeExito: string;
}

export function CitaForm({ admin, mensajeExito }: CitaFormProps) {
  const {
    texto,
    referencia,
    version,
    guardando,
    idEditando,
    confirmando,
    setTexto,
    setReferencia,
    setVersion,
    cancelarEdicion,
    cancelarConfirmacion,
    guardarCita,
    confirmarAccion,
  } = admin;

  const confirmandoGuardar = confirmando?.accion === "guardar";

  return (
    <>
      <h2 className="text-sm font-semibold text-primary/70 dark:text-white/70 uppercase tracking-wide mb-3">
        {idEditando ? "Editar cita bíblica" : "Nueva cita bíblica"}
      </h2>

      <div className="mb-4">
        <FieldLabel>Texto</FieldLabel>
        <textarea
          value={texto}
          maxLength={2000}
          rows={4}
          onChange={(e) => setTexto(e.target.value)}
          placeholder='Ej. "Porque de tal manera amó Dios al mundo..."'
          className="w-full outline-none transition-colors border-2 border-primary/40 dark:border-white/40 bg-gray-50 dark:bg-white/5 shadow-sm focus:border-primary focus:dark:border-white focus:ring-2 focus:ring-primary focus:dark:ring-white rounded-lg px-3 py-2 text-gray-800 dark:text-gray-100"
        />
      </div>

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel>Referencia</FieldLabel>
          <TextInput
            type="text"
            value={referencia}
            maxLength={80}
            onChange={(e) => setReferencia(e.target.value)}
            placeholder="Ej. Juan 3:16"
            className="w-full rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <FieldLabel>Versión</FieldLabel>
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="w-full outline-none transition-colors border-2 border-primary/40 dark:border-white/40 bg-gray-50 dark:bg-white/5 shadow-sm focus:border-primary focus:dark:border-white focus:ring-2 focus:ring-primary focus:dark:ring-white rounded-lg px-3 py-2 text-gray-800 dark:text-gray-100"
          >
            {VERSIONES_BIBLICAS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {confirmandoGuardar ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            ¿Guardar los cambios en esta cita?
          </p>
          <div className="flex gap-2">
            <Button
              onClick={confirmarAccion}
              variant="success"
              className="px-4 py-1.5 rounded-md text-sm font-medium"
            >
              Sí, guardar
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
        <div className="flex gap-2">
          <Button
            onClick={guardarCita}
            disabled={guardando}
            className="flex-1 py-2 rounded-lg font-medium"
          >
            {guardando ? "GUARDANDO..." : idEditando ? "GUARDAR CAMBIOS" : "PUBLICAR CITA"}
          </Button>

          {idEditando && (
            <Button
              onClick={cancelarEdicion}
              variant="secondary"
              className="px-4 py-2 rounded-lg font-medium"
            >
              Cancelar
            </Button>
          )}
        </div>
      )}

      {mensajeExito && (
        <Alert variant="success" className="mt-4 px-4 py-3 text-center animate-pulse">
          {mensajeExito}
        </Alert>
      )}
    </>
  );
}
