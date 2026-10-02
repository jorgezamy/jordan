import { APP_PACKAGE_ID, APP_VERSION_PARAM, APP_VERSION_SESSION_KEY } from "./constants";

function leerVersionGuardada(): number | null {
  try {
    const raw = window.sessionStorage.getItem(APP_VERSION_SESSION_KEY);
    if (raw === null) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function guardarVersion(version: number) {
  try {
    window.sessionStorage.setItem(APP_VERSION_SESSION_KEY, String(version));
  } catch {}
}

// Devuelve la versionCode de la app Android desde la que se abrió el sitio, o
// `null` si se abrió en el navegador normal. Una app vieja que aún no manda
// `appv` (se reconoce por el referrer `android-app://`) cuenta como versión 0.
//
// Se guarda en sessionStorage y no en localStorage: la TWA comparte el
// almacenamiento con Chrome, así que localStorage marcaría como "app" a quien
// después abra el sitio en el navegador.
export function detectarVersionApp(): number | null {
  const param = new URLSearchParams(window.location.search).get(APP_VERSION_PARAM);
  const desdeApp = document.referrer.startsWith(`android-app://${APP_PACKAGE_ID}`);

  // `appv` solo viaja en la URL del `startUrl` (home). Al refrescar cualquier
  // otra ruta dentro de la TWA, el referrer sigue siendo `android-app://`
  // pero la URL de esa ruta nunca trae `appv` — no es una app vieja, es la
  // misma sesión ya detectada antes. Por eso, sin `param`, se prioriza lo ya
  // guardado en sessionStorage antes de asumir versión 0.
  if (param !== null) {
    const parsed = parseInt(param, 10);
    const version = Number.isFinite(parsed) ? parsed : 0;
    guardarVersion(version);
    return version;
  }

  if (desdeApp) {
    const guardada = leerVersionGuardada();
    if (guardada !== null) return guardada;

    // Nada guardado todavía: el `startUrl` real de la app siempre apunta a
    // `/`, así que si justo aquí tampoco hay `appv` es una build vieja de
    // antes de este sistema. Pero un deep link directo a otra ruta (p. ej.
    // al tocar una notificación con la app recién instalada, sin sesión
    // previa) no trae esa info — ahí no hay forma de saber la versión, así
    // que no se bloquea en vez de asumir lo peor.
    if (window.location.pathname !== "/") return null;

    guardarVersion(0);
    return 0;
  }

  return leerVersionGuardada();
}
