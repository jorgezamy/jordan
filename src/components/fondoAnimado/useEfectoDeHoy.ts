"use client";

import { fechaEfectiva } from "../../lib/fechas";
import { useValorDelCliente } from "../../hooks/useValorDelCliente";
import type { NombreEfecto } from "./types";
import { efectoForzado, efectoParaFecha } from "./utils";

const leerEfecto = () => efectoForzado(window.location.search) ?? efectoParaFecha(fechaEfectiva(window.location.search));

/** Efecto de temporada para la fecha del visitante (o `?fondo=...`). null en el servidor. */
export function useEfectoDeHoy(): NombreEfecto | null {
  return useValorDelCliente(leerEfecto, null);
}
