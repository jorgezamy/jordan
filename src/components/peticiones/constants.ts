import { EstadoPeticion } from "./types";

export const ESTADO_ORDEN: Record<EstadoPeticion, number> = {
  pendiente: 1,
  resuelto: 2,
  eliminada: 3,
};

export const ORDEN_OPCIONES = [
  { key: "desc" as const, label: "Más reciente" },
  { key: "asc" as const, label: "Más antigua" },
];
