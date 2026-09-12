"use client";

import { useEffect, useState } from "react";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { ClearableTextInput } from "../ui/ClearableTextInput";
import { FieldLabel } from "../ui/FieldLabel";
import { SegmentedControl } from "../ui/SegmentedControl";
import { TextInput } from "../ui/TextInput";
import { DIAS_SEMANA_OPCIONES, DRIVE_BANNER_BASE_URL, ORIGEN_BANNER_OPCIONES, TIPO_PROGRAMACION_OPCIONES } from "./constants";
import { OrigenBanner } from "./types";
import { useAvisosAdmin } from "./useAvisosAdmin";
import { calcularTextoRecurrente, construirBannerUrlDrive, extraerIdDriveDeBannerUrl } from "./utils";

interface AvisoFormProps {
  admin: ReturnType<typeof useAvisosAdmin>;
  mensajeExito: string;
}

export function AvisoForm({ admin, mensajeExito }: AvisoFormProps) {
  const {
    titulo,
    descripcion,
    bannerUrl,
    importante,
    fecha,
    horaFecha,
    fechaFin,
    horaFechaFin,
    tipoProgramacion,
    diasRecurrentes,
    guardando,
    idEditando,
    confirmando,
    setTitulo,
    setDescripcion,
    setBannerUrl,
    setImportante,
    setFecha,
    setHoraFecha,
    setFechaFin,
    setHoraFechaFin,
    setTipoProgramacion,
    toggleDiaRecurrente,
    cancelarEdicion,
    cancelarConfirmacion,
    guardarAviso,
    confirmarAccion,
  } = admin;

  const [bannerError, setBannerError] = useState(false);
  const [origenBanner, setOrigenBanner] = useState<OrigenBanner>(() =>
    extraerIdDriveDeBannerUrl(bannerUrl) ? "drive" : "publica",
  );

  // Re-sincroniza qué input mostrar cada vez que se entra/sale de editar un
  // aviso (idEditando cambia), ya que bannerUrl pasa a ser el de ese aviso.
  useEffect(() => {
    setOrigenBanner(extraerIdDriveDeBannerUrl(bannerUrl) ? "drive" : "publica");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idEditando]);

  const bannerDriveId = extraerIdDriveDeBannerUrl(bannerUrl);
  const limpiarBanner = () => {
    setBannerUrl("");
    setBannerError(false);
  };

  const confirmandoGuardar = confirmando?.accion === "guardar";

  return (
    <>
      <h2 className="text-sm font-semibold text-primary/70 dark:text-white/70 uppercase tracking-wide mb-3">
        {idEditando ? "Editar aviso" : "Nuevo aviso"}
      </h2>

      <div className="mb-4">
        <FieldLabel>Título</FieldLabel>
        <ClearableTextInput
          type="text"
          value={titulo}
          maxLength={80}
          onChange={(e) => setTitulo(e.target.value)}
          onClear={() => setTitulo("")}
          placeholder="Ej. Ayuno congregacional"
          className="w-full rounded-lg px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <FieldLabel>
          URL del banner{" "}
          <span className="text-gray-400 dark:text-gray-500 font-normal">(opcional)</span>
        </FieldLabel>
        <SegmentedControl
          options={ORIGEN_BANNER_OPCIONES}
          value={origenBanner}
          onChange={setOrigenBanner}
          className="flex w-full sm:w-fit mb-2"
          optionClassName="flex-1 sm:flex-none px-3 py-1.5 text-xs"
        />

        {origenBanner === "drive" ? (
          <div>
            <p
              className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 rounded-md px-2 py-1.5 mb-1.5 truncate"
              title={DRIVE_BANNER_BASE_URL}
            >
              {DRIVE_BANNER_BASE_URL}
            </p>
            <ClearableTextInput
              type="text"
              value={bannerDriveId}
              maxLength={200}
              onChange={(e) => {
                setBannerUrl(construirBannerUrlDrive(e.target.value));
                setBannerError(false);
              }}
              onClear={limpiarBanner}
              placeholder="ID del archivo"
              className="w-full rounded-lg px-3 py-2"
            />
          </div>
        ) : (
          <ClearableTextInput
            type="url"
            value={bannerUrl}
            maxLength={500}
            onChange={(e) => {
              setBannerUrl(e.target.value);
              setBannerError(false);
            }}
            onClear={limpiarBanner}
            placeholder="https://..."
            className="w-full rounded-lg px-3 py-2"
          />
        )}

        {origenBanner === "drive" && (
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            El archivo debe estar compartido como &quot;Cualquier persona con el enlace&quot;. Copia solo el ID
            (la parte entre <span className="font-mono">/d/</span> y <span className="font-mono">/view</span> del
            link para compartir).
          </p>
        )}

        {bannerUrl.trim() && (
          <div className="mt-2 rounded-lg overflow-hidden border border-primary/20 dark:border-white/20 bg-gray-50 dark:bg-white/5 aspect-[16/9] max-w-sm">
            {bannerError ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 text-center px-3">
                No se pudo cargar la imagen. Revisa el enlace.
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bannerUrl}
                alt="Vista previa del banner"
                className="w-full h-full object-cover"
                onError={() => setBannerError(true)}
              />
            )}
          </div>
        )}
      </div>

      <div className="mb-4">
        <FieldLabel>
          Descripción breve{" "}
          {bannerUrl.trim() && (
            <span className="text-gray-400 dark:text-gray-500 font-normal">(opcional)</span>
          )}
        </FieldLabel>
        <textarea
          value={descripcion}
          maxLength={300}
          rows={3}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Ej. Este sábado ayunamos juntos como iglesia, de 9am a 1pm."
          className="w-full outline-none transition-colors border-2 border-primary/40 dark:border-white/40 bg-gray-50 dark:bg-white/5 shadow-sm focus:border-primary focus:dark:border-white focus:ring-2 focus:ring-primary focus:dark:ring-white rounded-lg px-3 py-2 text-gray-800 dark:text-gray-100"
        />
      </div>

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel>
            Fecha de inicio{" "}
            <span className="text-gray-400 dark:text-gray-500 font-normal">(opcional)</span>
          </FieldLabel>
          <TextInput
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full rounded-lg px-3 py-2"
          />
        </div>

        {fecha && (
          <div>
            <FieldLabel>
              Hora{" "}
              <span className="text-gray-400 dark:text-gray-500 font-normal">(opcional)</span>
            </FieldLabel>
            <TextInput
              type="time"
              value={horaFecha}
              onChange={(e) => setHoraFecha(e.target.value)}
              className="w-full rounded-lg px-3 py-2"
            />
          </div>
        )}
      </div>

      {fecha && (
        <div className="mb-4">
          <FieldLabel>¿Qué debe pasar con este aviso después de esa fecha?</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {TIPO_PROGRAMACION_OPCIONES.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setTipoProgramacion(opt.key)}
                className={`text-sm font-medium rounded-lg border-2 px-3 py-2 text-left transition ${
                  tipoProgramacion === opt.key
                    ? "border-primary bg-primary/5 text-primary dark:border-primary-accent dark:bg-primary-accent/10 dark:text-white"
                    : "border-gray-200 dark:border-white/15 text-gray-600 dark:text-gray-300 hover:border-primary/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {fecha && tipoProgramacion === "expira" && (
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Fecha de fin</FieldLabel>
            <TextInput
              type="date"
              value={fechaFin}
              min={fecha}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full rounded-lg px-3 py-2"
            />
          </div>

          {fechaFin && (
            <div>
              <FieldLabel>
                Hora{" "}
                <span className="text-gray-400 dark:text-gray-500 font-normal">(opcional)</span>
              </FieldLabel>
              <TextInput
                type="time"
                value={horaFechaFin}
                onChange={(e) => setHoraFechaFin(e.target.value)}
                className="w-full rounded-lg px-3 py-2"
              />
            </div>
          )}
        </div>
      )}

      {fecha && tipoProgramacion === "recurrente" && (
        <div className="mb-4">
          <FieldLabel>¿Qué días se repite?</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {DIAS_SEMANA_OPCIONES.map((dia) => (
              <button
                key={dia.key}
                type="button"
                onClick={() => toggleDiaRecurrente(dia.key)}
                className={`w-11 h-11 rounded-full text-sm font-semibold transition ${
                  diasRecurrentes.includes(dia.key)
                    ? "bg-primary text-white dark:bg-primary-accent"
                    : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-primary/10"
                }`}
              >
                {dia.label}
              </button>
            ))}
          </div>
          {diasRecurrentes.length > 0 && (
            <p className="mt-2 text-sm text-accent-hover dark:text-accent font-medium">
              {calcularTextoRecurrente(diasRecurrentes, horaFecha)}
            </p>
          )}
        </div>
      )}

      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={importante}
            onChange={(e) => setImportante(e.target.checked)}
          />
          Marcar como importante
        </label>
      </div>

      {confirmandoGuardar ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            ¿Guardar los cambios en este aviso?
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
            onClick={guardarAviso}
            disabled={guardando}
            className="flex-1 py-2 rounded-lg font-medium"
          >
            {guardando ? "GUARDANDO..." : idEditando ? "GUARDAR CAMBIOS" : "PUBLICAR AVISO"}
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
