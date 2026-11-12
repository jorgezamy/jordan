import {
  BIBLIA_ESTADO_KEY,
  BIBLIA_TAMANO_LETRA_KEY,
  LIBROS_BIBLIA,
  TAMANO_LETRA_POR_DEFECTO,
  TAMANOS_LETRA,
  VERSIONES_BIBLIA,
} from "./constants";
import { EstadoLectura, Versiculo } from "./types";

export function obtenerLibro(libroId: number) {
  return LIBROS_BIBLIA.find((l) => l.id === libroId) ?? LIBROS_BIBLIA[0];
}

export function esVersionValida(version: string): boolean {
  return VERSIONES_BIBLIA.some((v) => v.value === version);
}

interface Ubicacion {
  libroId: number;
  capitulo: number;
}

// null cuando ya no hay más (antes de Génesis 1 o después de Apocalipsis 22).
export function capituloSiguiente({ libroId, capitulo }: Ubicacion): Ubicacion | null {
  const libro = obtenerLibro(libroId);
  if (capitulo < libro.capitulos) return { libroId, capitulo: capitulo + 1 };

  const siguienteLibro = LIBROS_BIBLIA.find((l) => l.id === libroId + 1);
  return siguienteLibro ? { libroId: siguienteLibro.id, capitulo: 1 } : null;
}

export function capituloAnterior({ libroId, capitulo }: Ubicacion): Ubicacion | null {
  if (capitulo > 1) return { libroId, capitulo: capitulo - 1 };

  const libroAnterior = LIBROS_BIBLIA.find((l) => l.id === libroId - 1);
  return libroAnterior ? { libroId: libroAnterior.id, capitulo: libroAnterior.capitulos } : null;
}

export function formatearReferencia(
  libroId: number,
  capitulo: number,
  versoInicio: number | null,
  versoFin: number | null,
): string {
  const libro = obtenerLibro(libroId);
  if (!versoInicio) return `${libro.nombre} ${capitulo}`;
  if (!versoFin || versoFin === versoInicio) return `${libro.nombre} ${capitulo}:${versoInicio}`;
  return `${libro.nombre} ${capitulo}:${versoInicio}-${versoFin}`;
}

export function construirTextoCopia(
  versiculos: Versiculo[],
  libroId: number,
  capitulo: number,
  version: string,
  versoInicio: number | null,
  versoFin: number | null,
): string {
  const seleccion = versoInicio
    ? versiculos.filter((v) => v.numero >= versoInicio && v.numero <= (versoFin ?? versoInicio))
    : versiculos;

  // Un verso por línea (no todo junto separado por espacios) para que se
  // lea bien al pegarlo en WhatsApp/notas — un bloque de texto corrido era
  // difícil de leer con varios versos seleccionados (reportado).
  const cuerpo = seleccion.map((v) => `${v.numero}. ${v.texto}`).join("\n");
  const referencia = formatearReferencia(libroId, capitulo, versoInicio, versoFin);

  return `${cuerpo}\n\n— ${referencia} (${version})`;
}

// id del <p> de cada versículo, para poder hacer scroll hasta él.
export function idVerso(numero: number): string {
  return `verso-${numero}`;
}

export function desplazarAVerso(numero: number) {
  const el = document.getElementById(idVerso(numero));
  if (!el) return;
  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reducirMovimiento ? "auto" : "smooth", block: "start" });
}

function esVersoValido(n: unknown): n is number | null {
  return n === null || (typeof n === "number" && Number.isInteger(n) && n > 0);
}

// Devuelve null si no hay nada guardado o si lo guardado ya no es válido
// (p. ej. una versión que se quitó del catálogo).
export function leerEstadoLectura(): EstadoLectura | null {
  try {
    const raw = window.localStorage.getItem(BIBLIA_ESTADO_KEY);
    if (!raw) return null;
    const e = JSON.parse(raw) as Partial<EstadoLectura>;
    const libro = LIBROS_BIBLIA.find((l) => l.id === e.libroId);
    if (!libro) return null;
    if (typeof e.capitulo !== "number" || e.capitulo < 1 || e.capitulo > libro.capitulos) return null;
    if (typeof e.version !== "string" || !esVersionValida(e.version)) return null;
    const versoInicio = e.versoInicio ?? null;
    const versoFin = e.versoFin ?? null;
    if (!esVersoValido(versoInicio) || !esVersoValido(versoFin)) return null;
    return {
      libroId: libro.id,
      capitulo: e.capitulo,
      version: e.version,
      versoInicio,
      versoFin: versoInicio ? versoFin : null,
    };
  } catch {
    return null;
  }
}

export function guardarEstadoLectura(estado: EstadoLectura) {
  try {
    window.localStorage.setItem(BIBLIA_ESTADO_KEY, JSON.stringify(estado));
  } catch {}
}

export function leerTamanoLetra(): number {
  try {
    const raw = window.localStorage.getItem(BIBLIA_TAMANO_LETRA_KEY);
    const n = Number(raw);
    if (raw !== null && Number.isInteger(n) && n >= 0 && n < TAMANOS_LETRA.length) return n;
  } catch {}
  return TAMANO_LETRA_POR_DEFECTO;
}

export function guardarTamanoLetra(indice: number) {
  try {
    window.localStorage.setItem(BIBLIA_TAMANO_LETRA_KEY, String(indice));
  } catch {}
}
