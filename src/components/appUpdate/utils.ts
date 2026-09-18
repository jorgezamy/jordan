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

  if (param !== null || desdeApp) {
    const parsed = parseInt(param ?? "", 10);
    const version = Number.isFinite(parsed) ? parsed : 0;
    guardarVersion(version);
    return version;
  }

  return leerVersionGuardada();
}
