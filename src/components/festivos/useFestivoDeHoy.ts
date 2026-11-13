"use client";

import { fechaEfectiva } from "../../lib/fechas";
import { useValorDelCliente } from "../../hooks/useValorDelCliente";
import type { NombreFestivo } from "./types";
import { festivoForzado, festivoParaFecha } from "./utils";

const leerFestivo = () => festivoForzado(window.location.search) ?? festivoParaFecha(fechaEfectiva(window.location.search));

/** Festivo de hoy según la fecha del visitante (o `?festivo=...`). null en el servidor. */
export function useFestivoDeHoy(): NombreFestivo | null {
  return useValorDelCliente(leerFestivo, null);
}
