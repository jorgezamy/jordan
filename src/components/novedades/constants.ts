// Bump esta fecha cada vez que se publique algo nuevo — vuelve a mostrar
// el modal a todos, incluso a quien ya vio una versión anterior.
export const VERSION_NOVEDADES = "2026-08-27";

// Si nadie lo cierra activamente, deja de aparecer después de esta cantidad
// de veces (para no insistir para siempre).
export const NOVEDADES_MAX_VECES = 4;

export const NOVEDADES = [
  {
    titulo: "Nuestra dirección, más fácil de encontrar",
    descripcion:
      "Agregamos la dirección de la iglesia al final de cada página — tócala para abrirla directo en Google Maps.",
  },
  {
    titulo: "Avisos que se repiten cada semana",
    descripcion:
      "Al programar un aviso ahora eliges si se quita después de cierta fecha, si se queda siempre visible, o si se repite ciertos días de la semana.",
  },
  {
    titulo: "Recordatorio antes de cada aviso",
    descripcion:
      "Si tienes activadas las notificaciones de avisos, te avisamos una hora antes de que comience un evento programado.",
  },
  {
    titulo: "Notificaciones más confiables",
    descripcion:
      "Ahora te llegan aunque tengas el teléfono bloqueado o la app cerrada, no solo cuando la abres.",
  },
  {
    titulo: "Actívalas con un solo toque",
    descripcion:
      "Nuevo interruptor \"Activar todo\" en Configuración — prende peticiones, avisos y citas de una vez.",
  },
  {
    titulo: "Te preguntamos una sola vez",
    descripcion:
      "Al abrir la app por primera vez te pedimos permiso de notificaciones automáticamente.",
  },
  {
    titulo: "Ícono correcto en la barra de notificaciones",
    descripcion: "Ya no se ve un cuadro en blanco cuando la notificación aparece colapsada.",
  },
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
