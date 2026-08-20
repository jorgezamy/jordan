import { Timestamp } from "firebase/firestore";

export interface Cita {
  id: string;
  texto: string;
  referencia: string;
  version: string;
  fechaCreacion: Timestamp;
}

export type AccionCita = "guardar" | "eliminar";

export interface ConfirmacionCita {
  accion: AccionCita;
  id?: string;
}
