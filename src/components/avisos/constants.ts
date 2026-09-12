import { OrigenBanner, TipoProgramacion } from "./types";

export const AVISOS_LIMITE = 50;

export const ORIGEN_BANNER_OPCIONES: { key: OrigenBanner; label: string }[] = [
  { key: "publica", label: "URL pública" },
  { key: "drive", label: "Google Drive" },
];

// El link normal de "compartir" de Google Drive no sirve como <img src> (es
// una página HTML, no la imagen); este prefijo sí carga la imagen
// directamente, siempre que el archivo esté compartido como "Cualquier
// persona con el enlace". El admin solo pega el ID del archivo.
export const DRIVE_BANNER_BASE_URL = "https://lh3.googleusercontent.com/d/";

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
