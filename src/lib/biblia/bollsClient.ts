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
  return datos.map((v) => ({ numero: v.verse, texto: v.text }));
}
