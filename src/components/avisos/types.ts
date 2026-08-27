import { Timestamp } from "firebase/firestore";

// Solo aplica cuando `fecha` está definida. "expira" es el valor implícito
// para avisos antiguos que tienen `fecha` pero no `tipoProgramacion`.
export type TipoProgramacion = "expira" | "permanente" | "recurrente";

export interface Aviso {
  id: string;
  titulo: string;
  descripcion: string;
  importante: boolean;
  fecha?: Timestamp;
  fechaFin?: Timestamp;
  tipoProgramacion?: TipoProgramacion;
  diasRecurrentes?: number[]; // 0 = domingo … 6 = sábado; solo si tipoProgramacion === "recurrente"
  bannerUrl?: string;
  fechaCreacion: Timestamp;
}

export type AccionAviso = "guardar" | "eliminar";

export interface ConfirmacionAviso {
  accion: AccionAviso;
  id?: string;
}
