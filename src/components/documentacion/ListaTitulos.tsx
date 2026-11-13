import { BotonRecarga } from "../vistaPrevia/BotonRecarga";
import { PARAM_VISTA_PREVIA, INFO_CELEBRACION, TEMPORADAS_TITULO } from "../celebracion/constants";
import { TextoCelebracion } from "../celebracion/TextoCelebracion";
import type { NombreCelebracion } from "../celebracion/types";
import { FESTIVOS } from "../festivos/constants";
import { describirFecha } from "../festivos/utils";
import { describirTemporada } from "./utils";

const FILAS: { celebracion: NombreCelebracion; cuando: string }[] = [
  ...FESTIVOS.map((f) => ({ celebracion: f.nombre, cuando: describirFecha(f.fecha) })),
  ...TEMPORADAS_TITULO.map((t) => ({ celebracion: t.nombre, cuando: describirTemporada(t) })),
];

export function ListaTitulos() {
  return (
    <ul className="overflow-hidden rounded-2xl border border-primary/15 dark:border-white/10 bg-white dark:bg-surface-dark divide-y divide-primary/10 dark:divide-white/10">
      {FILAS.map(({ celebracion, cuando }) => (
        <li key={celebracion} className="p-3 sm:px-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 dark:text-white/50">
              {INFO_CELEBRACION[celebracion].etiqueta}
            </p>
            <TextoCelebracion celebracion={celebracion} className="text-xl" />
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-accent">{cuando}</p>
            <BotonRecarga
              href={`/?${PARAM_VISTA_PREVIA}=${celebracion}`}
              className="text-xs font-medium text-primary dark:text-primary-accent hover:underline"
            >
              Ver en el inicio →
            </BotonRecarga>
          </div>
        </li>
      ))}
    </ul>
  );
}
