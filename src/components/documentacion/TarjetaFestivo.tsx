import { BotonRecarga } from "../vistaPrevia/BotonRecarga";
import { PARAM_VISTA_PREVIA } from "../festivos/constants";
import { ILUSTRACIONES } from "../festivos/ilustraciones";
import type { Festivo } from "../festivos/types";
import { describirFecha } from "../festivos/utils";

export function TarjetaFestivo({ festivo }: { festivo: Festivo }) {
  const { nombre, titulo, saludo, fecha } = festivo;
  const Ilustracion = ILUSTRACIONES[nombre];

  return (
    <article className="overflow-hidden rounded-2xl border border-primary/15 dark:border-white/10 bg-white dark:bg-surface-dark shadow-sm">
      <div className="flex h-24 items-center justify-center bg-primary">
        <Ilustracion className="h-16 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] motion-safe:animate-[festivo-flotar_3s_ease-in-out_infinite]" />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{titulo}</h3>
        <p className="mt-0.5 text-xs font-semibold text-accent">{describirFecha(fecha)}</p>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">“{saludo}”</p>
        <BotonRecarga
          href={`/?${PARAM_VISTA_PREVIA}=${nombre}`}
          className="mt-2 inline-block text-xs font-medium text-primary dark:text-primary-accent hover:underline"
        >
          Ver en el header →
        </BotonRecarga>
      </div>
    </article>
  );
}
