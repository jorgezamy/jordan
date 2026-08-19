"use client";

import { useEffect, useMemo, useState } from "react";
import { User } from "firebase/auth";

import { ESTADO_ORDEN } from "./constants";
import { EstadoFiltro, Peticion } from "./types";
import { stripHtml } from "./utils";

export function usePeticionesFiltro(peticiones: Peticion[], user: User | null) {
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>("todos");
  const [ordenAsc, setOrdenAsc] = useState(false);

  useEffect(() => {
    if (!user && estadoFiltro === "eliminada") {
      setEstadoFiltro("todos");
    }
  }, [user, estadoFiltro]);

  const estadoOpciones = useMemo(
    () => [
      { key: "todos" as const, label: "Todas" },
      { key: "pendiente" as const, label: "Pendientes" },
      { key: "resuelto" as const, label: "Resueltas" },
      ...(user ? [{ key: "eliminada" as const, label: "Canceladas" }] : []),
    ],
    [user],
  );

  const peticionesFiltradas = useMemo(() => {
    const term = busqueda.trim().toLowerCase();

    const resultado = peticiones.filter((p) => {
      if (estadoFiltro !== "todos" && p.estado !== estadoFiltro) return false;
      if (!term) return true;
      const textoPlano = stripHtml(p.texto).toLowerCase();
      return (
        p.nombre.toLowerCase().includes(term) ||
        textoPlano.includes(term) ||
        (p.numero !== undefined && String(p.numero).includes(term))
      );
    });

    return [...resultado].sort((a, b) => {
      const ordenEstado = ESTADO_ORDEN[a.estado] - ESTADO_ORDEN[b.estado];
      if (ordenEstado !== 0) return ordenEstado;

      const fechaA = a.fechaCreacion?.toMillis?.() ?? 0;
      const fechaB = b.fechaCreacion?.toMillis?.() ?? 0;
      return ordenAsc ? fechaA - fechaB : fechaB - fechaA;
    });
  }, [peticiones, busqueda, estadoFiltro, ordenAsc]);

  return {
    busqueda,
    setBusqueda,
    estadoFiltro,
    setEstadoFiltro,
    ordenAsc,
    setOrdenAsc,
    estadoOpciones,
    peticionesFiltradas,
  };
}
