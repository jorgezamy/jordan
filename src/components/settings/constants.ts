import { TOPICS } from "../../lib/fcm";

export const SECCION_PETICIONES = { topic: TOPICS.peticiones, label: "Peticiones de oración" };
export const SECCION_AVISOS = { topic: TOPICS.avisos, label: "Avisos" };
export const SECCION_CITAS = { topic: TOPICS.citas, label: "Citas bíblicas" };

export const TEMA_OPCIONES = [
  { key: "light" as const, label: "Claro" },
  { key: "dark" as const, label: "Oscuro" },
  { key: "system" as const, label: "Sistema" },
];
