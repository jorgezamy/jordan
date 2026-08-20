export const TOPICS = {
  peticiones: "nuevas-peticiones",
  avisos: "nuevos-avisos",
  citas: "nueva-cita-biblica",
} as const;

export type Topic = (typeof TOPICS)[keyof typeof TOPICS];

export function esTopicValido(topic: unknown): topic is Topic {
  return typeof topic === "string" && (Object.values(TOPICS) as string[]).includes(topic);
}

export const PREF_SONIDO_KEY = "notif-sonido";
export const PREF_VIBRACION_KEY = "notif-vibracion";

export function leerPrefBooleana(key: string, defecto: boolean): boolean {
  if (typeof window === "undefined") return defecto;
  const valor = window.localStorage.getItem(key);
  return valor === null ? defecto : valor === "1";
}

export function guardarPrefBooleana(key: string, valor: boolean) {
  window.localStorage.setItem(key, valor ? "1" : "0");
}
