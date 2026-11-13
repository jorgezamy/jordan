"use client";

import { useState } from "react";
import type { GrupoVistaPrevia } from "./types";
import { gruposVistaPrevia } from "./utils";

export function useMenuVistaPrevia() {
  const [grupos, setGrupos] = useState<GrupoVistaPrevia[] | null>(null);
  // Las fechas se calculan al abrir (no al renderizar), con el día de ese momento.
  const alternar = () => setGrupos((actual) => (actual ? null : gruposVistaPrevia(new Date())));
  return { abierto: grupos !== null, grupos: grupos ?? [], alternar };
}
