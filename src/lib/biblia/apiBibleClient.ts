import { Versiculo } from "../../components/biblia/types";

const BASE_URL = "https://api.scripture.api.bible/v1";
// La Biblia no cambia — cachear agresivamente evita golpear la API externa
// en cada navegación de capítulo y respetar la cuota mensual (5,000
// llamadas/mes en el plan gratuito de api.bible).
const REVALIDATE_SEGUNDOS = 60 * 60 * 24 * 30;

// api.bible no devuelve versículos como array (a diferencia de bolls.life) —
// con content-type=text&include-verse-numbers=true regresa el capítulo
// entero como un solo string con cada versículo precedido de "[N]", p.ej.
// "[1] En el principio... [2] Y la tierra estaba...". Se separa con esa
// marca en vez de pedir un endpoint por versículo (eso costaría ~20-30
// llamadas por capítulo en vez de 1, agotando la cuota gratuita rápido).
function parsearVersiculos(texto: string): Versiculo[] {
  const partes = texto.split(/\[(\d+)\]/);
  const versiculos: Versiculo[] = [];

  for (let i = 1; i < partes.length; i += 2) {
    const numero = Number(partes[i]);
    const cuerpo = partes[i + 1].replace(/\s+/g, " ").trim();
    if (cuerpo) versiculos.push({ numero, texto: cuerpo });
  }

  return versiculos;
}

export async function obtenerCapituloApiBible(
  bibleId: string,
  codigoLibro: string,
  capitulo: number,
): Promise<Versiculo[]> {
  const apiKey = process.env.BIBLE_API_KEY;
  if (!apiKey) throw new Error("Falta la variable de entorno BIBLE_API_KEY");

  const url =
    `${BASE_URL}/bibles/${bibleId}/chapters/${codigoLibro}.${capitulo}` +
    "?content-type=text&include-verse-numbers=true&include-verse-spans=false" +
    "&include-titles=false&include-chapter-numbers=false&include-notes=false";

  const res = await fetch(url, {
    headers: { "api-key": apiKey },
    next: { revalidate: REVALIDATE_SEGUNDOS },
  });

  if (!res.ok) throw new Error(`api.bible respondió ${res.status}`);

  const datos = await res.json();
  const contenido: string | undefined = datos?.data?.content;
  if (typeof contenido !== "string") throw new Error("api.bible no devolvió contenido de capítulo");

  return parsearVersiculos(contenido);
}
