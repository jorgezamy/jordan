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

// Última versionCode confirmada (vía `appv`) en este dispositivo. Vive en
// localStorage para sobrevivir entre sesiones, pero solo se *lee* cuando el
// referrer confirma que la carga viene de la app — así nunca marca como "app"
// a quien abre el sitio en Chrome (que comparte almacenamiento con la TWA).
export const APP_VERSION_CONOCIDA_KEY = "app-version-conocida";

// Los links de las notificaciones push llevan `?origen=notificacion`. Al
// tocar una, Android abre la TWA directo en ese link (sin `appv`) y con
// sessionStorage vacío; sin esta marca se confundía con una build vieja y se
// mostraba el bloqueo de actualización aunque la app ya estuviera al día.
export const ORIGEN_PARAM = "origen";
export const ORIGEN_NOTIFICACION = "notificacion";
