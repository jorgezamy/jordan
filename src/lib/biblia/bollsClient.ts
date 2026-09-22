import { Versiculo } from "../../components/biblia/types";

const BASE_URL = "https://bolls.life";
// La Biblia no cambia — cachear agresivamente evita golpear la API externa
// en cada navegación de capítulo (y respeta el pedido del autor de bolls.life
// de no usarla para descargar el texto completo de un jalón).
const REVALIDATE_SEGUNDOS = 60 * 60 * 24 * 30;

interface VersiculoBolls {
  pk: number;
  verse: number;
  text: string;
}

// Algunas versiones traen HTML embebido en el texto. El componente muestra
// v.texto como texto plano, así que sin esto esas etiquetas aparecían
// literalmente en pantalla (y al copiar el versículo).
function limpiarTexto(texto: string): string {
  return texto
    // NVI marca notas al pie con <sup>[N]</sup>, pero la API nunca manda el
    // contenido de la nota — dejar el "[N]" suelto sería un número sin
    // ningún contexto, así que se quita completo (etiqueta y contenido).
    .replace(/<sup>.*?<\/sup>/gi, "")
    // El resto (<br> de saltos de línea poéticos en RV1960/NTV, <b>título
    // del salmo</b> en NVI, etc.) solo se le quita la etiqueta — su
    // contenido, cuando lo tiene, sí es parte del versículo.
    .replace(/<[^>]+>/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function obtenerCapitulo(
  version: string,
  libroId: number,
  capitulo: number,
): Promise<Versiculo[]> {
  const res = await fetch(`${BASE_URL}/get-text/${version}/${libroId}/${capitulo}/`, {
    next: { revalidate: REVALIDATE_SEGUNDOS },
  });

  if (!res.ok) throw new Error(`bolls.life respondió ${res.status}`);

  const datos: VersiculoBolls[] = await res.json();
  return datos.map((v) => ({ numero: v.verse, texto: limpiarTexto(v.text) }));
}
