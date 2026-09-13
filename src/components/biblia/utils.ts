import { LIBROS_BIBLIA, VERSIONES_BIBLIA } from "./constants";
import { Versiculo } from "./types";

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

  const cuerpo = seleccion.map((v) => `${v.numero}. ${v.texto}`).join(" ");
  const referencia = formatearReferencia(libroId, capitulo, versoInicio, versoFin);

  return `${cuerpo}\n— ${referencia} (${version})`;
}
