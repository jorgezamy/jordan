import { BotonRecarga } from "../vistaPrevia/BotonRecarga";
import { OPCIONES_HEADER, OPCIONES_VISTA_PREVIA, PARAM_VISTA_PREVIA } from "../fondoAnimado/constants";
import { LienzoAnimado } from "../fondoAnimado/LienzoAnimado";
import type { Temporada } from "../fondoAnimado/types";
import { INFO_EFECTOS } from "./constants";
import { describirTemporada } from "./utils";

const etiquetaClassName = "absolute left-3 top-2 text-[10px] font-bold uppercase tracking-widest";

/** Vista previa en vivo de un fondo: cómo se ve en el header y en la página. */
export function TarjetaFondo({ temporada }: { temporada: Temporada }) {
  const { efecto } = temporada;
  const { titulo, descripcion } = INFO_EFECTOS[efecto];

  return (
    <article className="overflow-hidden rounded-2xl border border-primary/15 dark:border-white/10 bg-white dark:bg-surface-dark shadow-sm">
      <div className="relative h-16 bg-primary">
        <LienzoAnimado efecto={efecto} opciones={OPCIONES_HEADER} className="fondo-oscuro absolute inset-0 h-full w-full" />
        <span className={`${etiquetaClassName} text-white/60`}>Header</span>
      </div>
      <div className="relative h-36 bg-background border-b border-primary/10 dark:border-white/10">
        <LienzoAnimado efecto={efecto} opciones={OPCIONES_VISTA_PREVIA} className="absolute inset-0 h-full w-full" />
        <span className={`${etiquetaClassName} text-primary/50 dark:text-white/50`}>Página</span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{titulo}</h3>
        <p className="mt-0.5 text-sm font-semibold text-accent">{describirTemporada(temporada)}</p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{descripcion}</p>
        <BotonRecarga
          href={`/?${PARAM_VISTA_PREVIA}=${efecto}`}
          className="mt-3 inline-block text-sm font-medium text-primary dark:text-primary-accent hover:underline"
        >
          Ver en el inicio →
        </BotonRecarga>
      </div>
    </article>
  );
}
