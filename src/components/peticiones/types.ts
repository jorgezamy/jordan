import { Timestamp } from "firebase/firestore";

export type EstadoPeticion = "pendiente" | "resuelto" | "eliminada";

export type EstadoFiltro = "todos" | EstadoPeticion;

export type AccionPeticion =
  | "resuelto"
  | "eliminada"
  | "restaurar"
  | "eliminar_permanente";

export interface Peticion {
  id: string;
  nombre: string;
  texto: string;
  estado: EstadoPeticion;
  fechaCreacion: Timestamp;
  fechaResuelta?: Timestamp;
  fechaEliminada?: Timestamp;
  telefono?: string;
  correo?: string;
  numero?: number;
}

export interface Confirmacion {
  id: string;
  accion: AccionPeticion;
}
