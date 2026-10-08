import { NextResponse } from "next/server";
import { obtenerCapitulo } from "../../../../../../lib/biblia/bollsClient";
import { obtenerCapituloApiBible } from "../../../../../../lib/biblia/apiBibleClient";
import { LIBROS_BIBLIA, PROVEEDOR_POR_VERSION } from "../../../../../../components/biblia/constants";
import { esVersionValida } from "../../../../../../components/biblia/utils";

interface Params {
  params: Promise<{ version: string; libro: string; capitulo: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { version, libro, capitulo } = await params;

  if (!esVersionValida(version)) {
    return NextResponse.json({ error: "Versión no soportada" }, { status: 400 });
  }

  const libroId = Number(libro);
  const capituloNum = Number(capitulo);
  const libroInfo = LIBROS_BIBLIA.find((l) => l.id === libroId);

  if (!libroInfo || !Number.isInteger(capituloNum) || capituloNum < 1 || capituloNum > libroInfo.capitulos) {
    return NextResponse.json({ error: "Libro o capítulo inválido" }, { status: 400 });
  }

  try {
    const proveedor = PROVEEDOR_POR_VERSION[version];
    const versiculos =
      proveedor.proveedor === "apibible"
        ? await obtenerCapituloApiBible(proveedor.apiBibleId!, libroInfo.codigoApiBible, capituloNum)
        : await obtenerCapitulo(version, libroId, capituloNum);
    return NextResponse.json({ versiculos });
  } catch (error) {
    console.error("[api/biblia] error:", error);
    return NextResponse.json({ error: "No se pudo cargar el capítulo" }, { status: 502 });
  }
}
