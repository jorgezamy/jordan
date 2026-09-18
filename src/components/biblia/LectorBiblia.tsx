"use client";

import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { CopyIcon } from "../ui/CopyIcon";
import { FieldLabel } from "../ui/FieldLabel";
import { CapituloTexto } from "./CapituloTexto";
import { LIBROS_BIBLIA, VERSIONES_BIBLIA } from "./constants";
import { useBiblia } from "./useBiblia";
import { obtenerLibro } from "./utils";

const selectClassName =
  "w-full outline-none transition-colors border-2 border-primary/40 dark:border-white/40 bg-gray-50 dark:bg-white/5 shadow-sm focus:border-primary focus:dark:border-white focus:ring-2 focus:ring-primary focus:dark:ring-white rounded-lg px-3 py-2 text-gray-800 dark:text-gray-100";

export function LectorBiblia() {
  const {
    libroId,
    capitulo,
    version,
    versiculos,
    loading,
    error,
    versoInicio,
    versoFin,
    mensajeCopiado,
    cambiarLibro,
    cambiarCapitulo,
    cambiarVersion,
    irSiguiente,
    irAnterior,
    seleccionarVersoInicio,
    seleccionarVersoFin,
    copiar,
  } = useBiblia();

  const libro = obtenerLibro(libroId);
  const opcionesCapitulo = Array.from({ length: libro.capitulos }, (_, i) => i + 1);
  const opcionesVerso = versiculos.map((v) => v.numero);
  const opcionesVersoFin = versoInicio ? opcionesVerso.filter((n) => n >= versoInicio) : [];

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white dark:bg-surface-dark shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Biblia</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <FieldLabel>Libro</FieldLabel>
          <select
            value={libroId}
            onChange={(e) => cambiarLibro(Number(e.target.value))}
            className={selectClassName}
          >
            {LIBROS_BIBLIA.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel>Capítulo</FieldLabel>
          <select
            value={capitulo}
            onChange={(e) => cambiarCapitulo(Number(e.target.value))}
            className={selectClassName}
          >
            {opcionesCapitulo.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel>Versión</FieldLabel>
          <select
            value={version}
            onChange={(e) => cambiarVersion(e.target.value)}
            className={selectClassName}
          >
            {VERSIONES_BIBLIA.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Button onClick={irAnterior} variant="secondary" className="px-3 py-1.5 rounded-md text-sm font-medium">
          ← Anterior
        </Button>
        <Button
          onClick={() => copiar()}
          variant="secondary"
          className="px-3 py-1.5 rounded-md text-sm font-medium inline-flex items-center gap-1.5"
        >
          <CopyIcon className="w-3.5 h-3.5" />
          Copiar capítulo
        </Button>
        <Button onClick={irSiguiente} variant="secondary" className="px-3 py-1.5 rounded-md text-sm font-medium">
          Siguiente →
        </Button>
      </div>

      {mensajeCopiado && (
        <Alert variant="success" className="mb-4 px-4 py-2.5 text-center">
          {mensajeCopiado}
        </Alert>
      )}

      <hr className="border-t border-primary/15 dark:border-white/15 mb-4" />

      <CapituloTexto
        versiculos={versiculos}
        loading={loading}
        error={error}
        versoInicio={versoInicio}
        versoFin={versoFin}
        onCopiarVerso={(numero) => copiar(numero)}
      />

      {!loading && !error && versiculos.length > 0 && (
        <>
          <hr className="border-t border-primary/15 dark:border-white/15 my-4" />

          <h2 className="text-sm font-semibold text-primary/70 dark:text-white/70 uppercase tracking-wide mb-3">
            Copiar un rango de versículos
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <FieldLabel>Verso inicial</FieldLabel>
              <select
                value={versoInicio ?? ""}
                onChange={(e) => seleccionarVersoInicio(e.target.value ? Number(e.target.value) : null)}
                className={selectClassName}
              >
                <option value="">Selecciona un verso</option>
                {opcionesVerso.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {versoInicio && (
              <div>
                <FieldLabel>Verso final (opcional, para un rango)</FieldLabel>
                <select
                  value={versoFin ?? ""}
                  onChange={(e) => seleccionarVersoFin(e.target.value ? Number(e.target.value) : null)}
                  className={selectClassName}
                >
                  <option value="">Solo este verso</option>
                  {opcionesVersoFin.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {versoInicio && (
            <Button
              onClick={() => copiar()}
              className="py-2 px-4 rounded-lg font-medium inline-flex items-center gap-1.5"
            >
              <CopyIcon className="w-3.5 h-3.5" />
              Copiar selección
            </Button>
          )}
        </>
      )}
    </div>
  );
}
