import { TEMPORADAS_TITULO } from "../celebracion/constants";
import { FESTIVOS } from "../festivos/constants";
import { fechaDelFestivo } from "../festivos/utils";
import { aParamFecha, formatearDiaMes, fechaSimulada, PARAM_FECHA, proximaOcurrencia } from "../../lib/fechas";
import { DIAS_DENTRO_DE_TEMPORADA, ETIQUETAS_TEMPORADA, MESES_CORTOS, PARAMS_VISTA_PREVIA } from "./constants";
import type { GrupoVistaPrevia, OpcionVistaPrevia } from "./types";

const opcion = (etiqueta: string, fecha: Date): OpcionVistaPrevia => ({
  etiqueta,
  cuando: `${fecha.getDate()} ${MESES_CORTOS[fecha.getMonth()]}`,
  href: `/?${PARAM_FECHA}=${aParamFecha(fecha)}`,
});

/**
 * Botones del menú "Probar decoraciones": cada uno simula la próxima vez que cae
 * esa fecha, así se ve todo junto (fondo, ícono del header y título) como ese día.
 */
export function gruposVistaPrevia(hoy: Date): GrupoVistaPrevia[] {
  const festivos = FESTIVOS.map((f) =>
    opcion(f.titulo, proximaOcurrencia((ano) => fechaDelFestivo(f.fecha, ano), hoy)),
  );
  const temporadas = TEMPORADAS_TITULO.map((t) =>
    opcion(
      ETIQUETAS_TEMPORADA[t.nombre],
      proximaOcurrencia((ano) => new Date(ano, t.desde.mes - 1, t.desde.dia + DIAS_DENTRO_DE_TEMPORADA), hoy),
    ),
  );
  const porFecha = (a: OpcionVistaPrevia, b: OpcionVistaPrevia) => a.href.localeCompare(b.href);
  return [
    { titulo: "Días festivos", opciones: festivos.sort(porFecha) },
    { titulo: "Temporadas", opciones: temporadas.sort(porFecha) },
  ];
}

/** Texto de la franja de vista previa, o null si la URL no tiene ninguna. */
export function descripcionVistaPrevia(search: string): string | null {
  const params = new URLSearchParams(search);
  if (!PARAMS_VISTA_PREVIA.some((p) => params.has(p))) return null;
  const fecha = fechaSimulada(search);
  return fecha
    ? `Vista previa del ${formatearDiaMes(fecha.getMonth() + 1, fecha.getDate())} de ${fecha.getFullYear()}`
    : "Vista previa";
}
