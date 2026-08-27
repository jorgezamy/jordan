import { TipoProgramacion } from "./types";

export const AVISOS_LIMITE = 50;

export const TIPO_PROGRAMACION_OPCIONES: { key: TipoProgramacion; label: string }[] = [
  { key: "expira", label: "Quitar después de esa fecha" },
  { key: "permanente", label: "Mantener activo sin expirar" },
  { key: "recurrente", label: "Se repite cada semana" },
];

// key = índice de Date.getDay() (0 = domingo … 6 = sábado)
export const DIAS_SEMANA_OPCIONES: { key: number; label: string }[] = [
  { key: 0, label: "Dom" },
  { key: 1, label: "Lun" },
  { key: 2, label: "Mar" },
  { key: 3, label: "Mié" },
  { key: 4, label: "Jue" },
  { key: 5, label: "Vie" },
  { key: 6, label: "Sáb" },
];
