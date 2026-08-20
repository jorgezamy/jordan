import { Timestamp } from "firebase/firestore";

export interface Aviso {
  id: string;
  titulo: string;
  descripcion: string;
  importante: boolean;
  fecha?: Timestamp;
  fechaFin?: Timestamp;
  bannerUrl?: string;
  fechaCreacion: Timestamp;
}

export type AccionAviso = "guardar" | "eliminar";

export interface ConfirmacionAviso {
  accion: AccionAviso;
  id?: string;
}
