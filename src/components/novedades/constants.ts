// Bump esta fecha cada vez que se publique algo nuevo — vuelve a mostrar
// el modal a todos, incluso a quien ya vio una versión anterior.
export const VERSION_NOVEDADES = "2026-08-20";

// Si nadie lo cierra activamente, deja de aparecer después de esta cantidad
// de veces (para no insistir para siempre).
export const NOVEDADES_MAX_VECES = 4;

export const NOVEDADES = [
  {
    titulo: "Avisos con estilo",
    descripcion:
      "Los anuncios de la iglesia ahora aparecen en el inicio, con fecha, hora y hasta una imagen destacada cuando aplica.",
  },
  {
    titulo: '"Dios te habla hoy"',
    descripcion:
      "Una cita bíblica en el inicio cada vez que el equipo pastoral publique una, con su versión (NVI, RVR1960 y más).",
  },
  {
    titulo: "Notificaciones a tu gusto",
    descripcion:
      "Elige qué te avisa — peticiones, avisos, citas — y si quieres sonido y vibración, todo desde Configuración.",
  },
  {
    titulo: "Un inicio renovado",
    descripcion: "Rediseñamos la página principal para que se sienta más moderna y fácil de usar.",
  },
];
