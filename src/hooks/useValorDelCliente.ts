"use client";

import { useSyncExternalStore } from "react";

const sinSuscripcion = () => () => {};

/**
 * Lee un valor que solo existe en el navegador (fecha local, URL…) sin
 * desajustes de hidratación: en el servidor y en el primer render devuelve
 * `enServidor`. `leer` debe devolver un valor primitivo (o el mismo objeto).
 */
export function useValorDelCliente<T>(leer: () => T, enServidor: T): T {
  return useSyncExternalStore(sinSuscripcion, leer, () => enServidor);
}
