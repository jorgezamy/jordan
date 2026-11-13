"use client";

import dynamic from "next/dynamic";
import { FESTIVO_POR_NOMBRE } from "./constants";
import { useFestivoDeHoy } from "./useFestivoDeHoy";

/** Los dibujos solo se descargan el día de un festivo, no en cada visita. */
const IlustracionFestivo = dynamic(() => import("./ilustraciones").then((m) => m.IlustracionFestivo), {
  ssr: false,
  loading: () => <span className="block h-10 w-10" />,
});

/** Ícono colorido junto al logo del header; solo aparece el día del festivo. */
export function IconoFestivo() {
  const festivo = useFestivoDeHoy();
  if (!festivo) return null;

  const { titulo, saludo } = FESTIVO_POR_NOMBRE[festivo];
  return (
    <div
      role="img"
      aria-label={saludo}
      title={titulo}
      className="flex items-center gap-2 rounded-xl bg-white/10 px-1.5 py-0.5 motion-safe:animate-[pop-in_0.5s_ease-out]"
    >
      <IlustracionFestivo
        nombre={festivo}
        className="h-10 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] motion-safe:animate-[festivo-flotar_3s_ease-in-out_infinite]"
      />
      <span className="hidden lg:inline pr-1 text-xs font-bold text-white whitespace-nowrap">{saludo}</span>
    </div>
  );
}
