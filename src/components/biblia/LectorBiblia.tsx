"use client";

import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { CopyIcon } from "../ui/CopyIcon";
import { FieldLabel } from "../ui/FieldLabel";
import { Select, selectOptionClassName } from "../ui/Select";
import { CapituloTexto } from "./CapituloTexto";
import { LIBROS_BIBLIA, VERSIONES_BIBLIA } from "./constants";
import { useBiblia } from "./useBiblia";
import { obtenerLibro } from "./utils";

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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <div className="col-span-2 sm:col-span-1">
          <FieldLabel>Libro</FieldLabel>
          <Select
            value={libroId}
            onChange={(e) => cambiarLibro(Number(e.target.value))}
            className="text-sm truncate"
          >
            {LIBROS_BIBLIA.map((l) => (
              <option key={l.id} value={l.id} className={selectOptionClassName}>
                {l.nombre}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <FieldLabel>Capítulo</FieldLabel>
          <Select
            value={capitulo}
            onChange={(e) => cambiarCapitulo(Number(e.target.value))}
            className="text-sm truncate"
          >
            {opcionesCapitulo.map((n) => (
              <option key={n} value={n} className={selectOptionClassName}>
                {n}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <FieldLabel>Versión</FieldLabel>
          <Select
            value={version}
            onChange={(e) => cambiarVersion(e.target.value)}
            className="text-sm truncate"
          >
            {VERSIONES_BIBLIA.map((v) => (
              <option key={v.value} value={v.value} className={selectOptionClassName}>
                {v.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Rango de versículos a copiar — opcional, por eso ambos selects
          arrancan en "Todo el capítulo"/"Hasta el final"; nunca bloquean
          nada si no se tocan. Antes vivía en su propia sección hasta abajo
          de la página (lejos de los botones que la usan); se movió aquí,
          junto a Libro/Capítulo/Versión, porque quedaba poco práctico tener
          que bajar hasta el fondo solo para copiar un rango. */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <FieldLabel>Desde (opcional)</FieldLabel>
          <Select
            value={versoInicio ?? ""}
            onChange={(e) => seleccionarVersoInicio(e.target.value ? Number(e.target.value) : null)}
            disabled={loading || opcionesVerso.length === 0}
            className="text-sm truncate"
          >
            <option value="" className={selectOptionClassName}>
              Todo el capítulo
            </option>
            {opcionesVerso.map((n) => (
              <option key={n} value={n} className={selectOptionClassName}>
                Verso {n}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <FieldLabel>Hasta (opcional)</FieldLabel>
          <Select
            value={versoFin ?? ""}
            onChange={(e) => seleccionarVersoFin(e.target.value ? Number(e.target.value) : null)}
            disabled={!versoInicio}
            className="text-sm truncate"
          >
            <option value="" className={selectOptionClassName}>
              Hasta el final
            </option>
            {opcionesVersoFin.map((n) => (
              <option key={n} value={n} className={selectOptionClassName}>
                Verso {n}
              </option>
            ))}
          </Select>
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
          {versoInicio ? "Copiar selección" : "Copiar capítulo"}
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
    </div>
  );
}
