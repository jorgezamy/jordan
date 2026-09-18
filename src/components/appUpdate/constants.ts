export const APP_PACKAGE_ID = "com.centrocristianojordan.app";

// La app Android (TWA) abre el sitio con `/?appv=<versionCode>` — ver
// `jordan-twa/release.ps1`, que mantiene ese número igual al versionCode del .aab.
export const APP_VERSION_PARAM = "appv";

export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${APP_PACKAGE_ID}`;

// Versión mínima del .aab permitida. Subirla y hacer push a `main` obliga a
// actualizar a todos los que tengan instalada una versión menor. Solo afecta
// a quien abre el sitio desde la app instalada, nunca a quien lo abre en el navegador.
// 0 = nadie es bloqueado.
export const MIN_APP_VERSION = 10;

export const APP_VERSION_SESSION_KEY = "app-version";
