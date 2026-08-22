"use client";

import { useTheme } from "../../context/ThemeContext";
import { SegmentedControl } from "../ui/SegmentedControl";
import { Switch } from "../ui/Switch";
import { TEMA_OPCIONES } from "./constants";
import { useNotificationSettings } from "./useNotificationSettings";

export default function Configuracion() {
  const { theme, setTheme } = useTheme();
  const {
    sonido,
    setSonido,
    vibracion,
    setVibracion,
    secciones,
    alternarSeccion,
    todoActivo,
    todoDeshabilitado,
    alternarTodo,
  } = useNotificationSettings();

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Configuración
      </h1>

      <div className="bg-white dark:bg-surface-dark shadow-lg rounded-xl p-5 sm:p-6 mb-4">
        <h2 className="text-sm font-semibold text-primary/70 dark:text-white/70 uppercase tracking-wide mb-3">
          Tema
        </h2>
        <SegmentedControl
          options={TEMA_OPCIONES}
          value={theme}
          onChange={setTheme}
          className="flex w-full sm:w-fit"
          optionClassName="flex-1 sm:flex-none px-4 py-2 text-sm"
        />
      </div>

      <div className="bg-white dark:bg-surface-dark shadow-lg rounded-xl p-5 sm:p-6 mb-4">
        <h2 className="text-sm font-semibold text-primary/70 dark:text-white/70 uppercase tracking-wide mb-3">
          Notificaciones
        </h2>
        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/10">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Activar todo</span>
          <Switch
            checked={todoActivo}
            disabled={todoDeshabilitado}
            onChange={alternarTodo}
            label="Activar todas las notificaciones"
          />
        </div>
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/10">
          {secciones.map((s) => (
            <div
              key={s.topic}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{s.label}</span>
              <Switch
                checked={s.fcm.status === "subscribed"}
                disabled={s.fcm.status === "subscribing" || s.fcm.status === "unsupported"}
                onChange={() => alternarSeccion(s.fcm)}
                label={`Notificaciones de ${s.label}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark shadow-lg rounded-xl p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-primary/70 dark:text-white/70 uppercase tracking-wide mb-3">
          Alertas
        </h2>
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/10">
          <div className="flex items-center justify-between py-3 first:pt-0">
            <span className="text-sm text-gray-700 dark:text-gray-300">Sonido</span>
            <Switch checked={sonido} onChange={setSonido} label="Sonido" />
          </div>
          <div className="flex items-center justify-between py-3 last:pb-0">
            <span className="text-sm text-gray-700 dark:text-gray-300">Vibración</span>
            <Switch checked={vibracion} onChange={setVibracion} label="Vibración" />
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Sonido y vibración solo aplican con la app abierta. Cuando llega en segundo plano, el
          sistema decide.
        </p>
      </div>
    </div>
  );
}
