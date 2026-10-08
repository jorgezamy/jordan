"use client";

import { useEffect, useState } from "react";

import { useMensajeTemporal } from "../../hooks/useMensajeTemporal";
import { VERSION_POR_DEFECTO } from "./constants";
import { Versiculo } from "./types";
import { capituloAnterior, capituloSiguiente, construirTextoCopia } from "./utils";

export function useBiblia() {
  const [libroId, setLibroId] = useState(1);
  const [capitulo, setCapitulo] = useState(1);
  const [version, setVersion] = useState(VERSION_POR_DEFECTO);
  const [versiculos, setVersiculos] = useState<Versiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [versoInicio, setVersoInicio] = useState<number | null>(null);
  const [versoFin, setVersoFin] = useState<number | null>(null);
  const { mensaje: mensajeCopiado, mostrarMensaje: mostrarCopiado } = useMensajeTemporal(2000);

  useEffect(() => {
    let cancelado = false;
    setLoading(true);
    setError(false);

    fetch(`/api/biblia/${version}/${libroId}/${capitulo}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API respondió ${res.status}`);
        return res.json();
      })
      .then((data: { versiculos: Versiculo[] }) => {
        if (cancelado) return;
        setVersiculos(data.versiculos);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelado) return;
        console.error("❌ Error cargando capítulo:", err);
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [libroId, capitulo, version]);

  const limpiarSeleccion = () => {
    setVersoInicio(null);
    setVersoFin(null);
  };

  const cambiarLibro = (id: number) => {
    setLibroId(id);
    setCapitulo(1);
    limpiarSeleccion();
  };

  const cambiarCapitulo = (n: number) => {
    setCapitulo(n);
    limpiarSeleccion();
  };

  const cambiarVersion = (v: string) => {
    setVersion(v);
    limpiarSeleccion();
  };

  const irSiguiente = () => {
    const destino = capituloSiguiente({ libroId, capitulo });
    if (!destino) return;
    setLibroId(destino.libroId);
    setCapitulo(destino.capitulo);
    limpiarSeleccion();
  };

  const irAnterior = () => {
    const destino = capituloAnterior({ libroId, capitulo });
    if (!destino) return;
    setLibroId(destino.libroId);
    setCapitulo(destino.capitulo);
    limpiarSeleccion();
  };

  const seleccionarVersoInicio = (n: number | null) => {
    setVersoInicio(n);
    setVersoFin(null);
  };

  const copiar = async (versoInicioForzado?: number) => {
    const texto = construirTextoCopia(
      versiculos,
      libroId,
      capitulo,
      version,
      versoInicioForzado ?? versoInicio,
      versoInicioForzado ? null : versoFin,
    );

    try {
      // navigator.clipboard no existe fuera de un contexto seguro (HTTPS o
      // localhost) — p.ej. al probar desde el celular por IP de LAN en
      // HTTP plano. console.warn en vez de console.error porque Next.js
      // infla hasta los console.error ya atrapados a pantalla completa en
      // dev; esto es un caso esperado, no un bug, y ya se maneja abajo.
      await navigator.clipboard.writeText(texto);
      mostrarCopiado("¡Copiado!");
    } catch (err) {
      console.warn("Error copiando:", err);
      mostrarCopiado("No se pudo copiar");
    }
  };

  return {
    libroId,
    capitulo,
    version,
    versiculos,
    loading,
    error,
    versoInicio,
    versoFin,
    mensajeCopiado,
    cambiarLibro,
    cambiarCapitulo,
    cambiarVersion,
    irSiguiente,
    irAnterior,
    seleccionarVersoInicio,
    seleccionarVersoFin: setVersoFin,
    copiar,
  };
}
