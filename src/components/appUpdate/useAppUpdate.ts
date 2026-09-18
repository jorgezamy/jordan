"use client";

import { useEffect, useState } from "react";
import { MIN_APP_VERSION, PLAY_STORE_URL } from "./constants";
import { detectarVersionApp } from "./utils";

export function useAppUpdate() {
  const [obligatoria, setObligatoria] = useState(false);
  const [fueALaTienda, setFueALaTienda] = useState(false);

  useEffect(() => {
    const version = detectarVersionApp();
    setObligatoria(version !== null && version < MIN_APP_VERSION);
  }, []);

  // La página que ya está cargada no puede saber que la app se actualizó: la
  // versión solo se lee cuando la app arranca de cero. Por eso, tras ir a la
  // tienda, el aviso pide reiniciar la app en vez de seguir mostrando lo mismo.
  const abrirTienda = () => {
    setFueALaTienda(true);
    window.location.assign(PLAY_STORE_URL);
  };

  return { obligatoria, fueALaTienda, abrirTienda };
}
