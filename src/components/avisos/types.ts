import { Timestamp } from "firebase/firestore";

// Solo aplica cuando `fecha` está definida. "expira" es el valor implícito
// para avisos antiguos que tienen `fecha` pero no `tipoProgramacion`.
export type TipoProgramacion = "expira" | "permanente" | "recurrente";

// Solo controla qué input muestra AvisoForm para capturar bannerUrl — no se
// persiste en Firestore, el documento solo guarda la URL final resultante.
export type OrigenBanner = "publica" | "drive";

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
  // Posición manual (menor = primero) asignada por el admin al arrastrar en
  // "Avisos publicados"; determina el orden en el carrusel de inicio. Avisos
  // previos a esta funcionalidad no lo tienen hasta correr la migración —
  // ver ordenarPorPosicion en utils.ts.
  orden?: number;
}

export type AccionAviso = "guardar" | "eliminar";

export interface ConfirmacionAviso {
  accion: AccionAviso;
  id?: string;
}
