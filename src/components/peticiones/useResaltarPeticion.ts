"use client";

import { useEffect, useState } from "react";

const DURACION_MS = 4000;

// Al tocar la notificación de una petición, el link trae `?id=<peticionId>`
// para resaltar esa tarjeta en la lista una vez cargue (ver PeticionCard).
export function useResaltarPeticion() {
  const [resaltada, setResaltada] = useState<string | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) return;

    setResaltada(id);
    const timeout = setTimeout(() => setResaltada(null), DURACION_MS);
    return () => clearTimeout(timeout);
  }, []);

  return resaltada;
}
