"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Un pequeño movimiento del dedo/mouse al soltar el gesto de arrastre no
// cuenta como arrastre real (evita reordenar por accidente con un tap).
const UMBRAL_ARRASTRE_PX = 4;

export interface DragHandleGestureProps {
  onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerCancel: (e: React.PointerEvent<HTMLButtonElement>) => void;
}

// Una fila renderizable de una lista arrastrable: un item, o el hueco que
// marca dónde quedaría el item arrastrado si se soltara en ese punto.
export type FilaArrastre<T> = { tipo: "item"; item: T } | { tipo: "hueco" };

// Arma las filas a renderizar: los items en su orden actual, con un "hueco"
// insertado donde quedaría el item arrastrado si se soltara ahí ahora
// (indicador visual de destino durante el arrastre). Pensada para usarse
// directamente con el `items`/`arrastrandoId`/`indiceDestino` que devuelve
// `useReordenarLista`.
export function construirFilasArrastre<T extends { id: string }>(
  items: T[],
  arrastrandoId: string | null,
  indiceDestino: number | null,
): FilaArrastre<T>[] {
  if (!arrastrandoId || indiceDestino === null) {
    return items.map((item) => ({ tipo: "item", item }));
  }

  const filas: FilaArrastre<T>[] = [];
  let indiceVisible = 0;

  items.forEach((item) => {
    const esArrastrado = item.id === arrastrandoId;
    if (!esArrastrado && indiceVisible === indiceDestino) filas.push({ tipo: "hueco" });
    filas.push({ tipo: "item", item });
    if (!esArrastrado) indiceVisible++;
  });

  if (indiceVisible === indiceDestino) filas.push({ tipo: "hueco" });

  return filas;
}

// Reordenamiento por arrastre (mouse + touch, vía Pointer Events) para
// cualquier lista con filas identificables por `id` — hoy la usa
// "Avisos publicados" (src/components/avisos/ListaAvisosAdmin.tsx), pero no
// depende de nada específico de avisos, para poder reusarla en la próxima
// lista que necesite orden manual.
//
// Mientras se arrastra, la fila activa flota siguiendo al puntero (vía
// `offsetY`, aplicado por quien la use como `translateY`) y `indiceDestino`
// indica dónde quedaría al soltar; el resto de la lista no se reacomoda
// hasta soltar. Al soltar (o cuando `items` cambia por una actualización
// remota), toda la lista anima con la técnica FLIP en vez de saltar de golpe
// a su nueva posición.
export function useReordenarLista<T extends { id: string }>(
  itemsIniciales: T[],
  onReordenar: (nuevoOrden: T[]) => void,
) {
  const [items, setItems] = useState(itemsIniciales);
  const [arrastrandoId, setArrastrandoId] = useState<string | null>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [indiceDestino, setIndiceDestino] = useState<number | null>(null);

  const elementosRef = useRef<Map<string, HTMLLIElement>>(new Map());
  const posicionesRef = useRef<Map<string, number>>(new Map());
  const startYRef = useRef(0);
  const seMovioRef = useRef(false);

  // Sincroniza con la fuente de datos salvo mientras hay un arrastre en
  // curso, para no jalar la lista de vuelta bajo el dedo a media acción.
  useEffect(() => {
    if (!arrastrandoId) setItems(itemsIniciales);
  }, [itemsIniciales, arrastrandoId]);

  useLayoutEffect(() => {
    items.forEach((item) => {
      const el = elementosRef.current.get(item.id);
      if (!el || item.id === arrastrandoId) return;

      const posicionPrevia = posicionesRef.current.get(item.id);
      const posicionActual = el.getBoundingClientRect().top;

      if (posicionPrevia !== undefined && posicionPrevia !== posicionActual) {
        el.style.transition = "none";
        el.style.transform = `translateY(${posicionPrevia - posicionActual}px)`;
        requestAnimationFrame(() => {
          el.style.transition = "transform 220ms ease";
          el.style.transform = "";
        });
      }
      posicionesRef.current.set(item.id, posicionActual);
    });
  }, [items, arrastrandoId]);

  const registrarRef = (id: string) => (el: HTMLLIElement | null) => {
    if (el) elementosRef.current.set(id, el);
    else elementosRef.current.delete(id);
  };

  // Índice (entre los items NO arrastrados) donde quedaría el item
  // arrastrado si se soltara ahora, según la posición vertical del puntero.
  const calcularIndiceDestino = (pointerY: number, idArrastrado: string) => {
    const visibles = items.filter((item) => item.id !== idArrastrado);
    for (let i = 0; i < visibles.length; i++) {
      const rect = elementosRef.current.get(visibles[i].id)?.getBoundingClientRect();
      if (rect && pointerY < rect.top + rect.height / 2) return i;
    }
    return visibles.length;
  };

  const soltar = () => {
    if (arrastrandoId && seMovioRef.current && indiceDestino !== null) {
      const arrastrado = items.find((item) => item.id === arrastrandoId);
      if (arrastrado) {
        // Guarda dónde quedó visualmente (con el transform del arrastre
        // todavía aplicado) para que la animación FLIP que sigue arranque
        // justo ahí, en vez de saltar de vuelta a su posición original.
        const el = elementosRef.current.get(arrastrandoId);
        if (el) posicionesRef.current.set(arrastrandoId, el.getBoundingClientRect().top);

        const nuevo = items.filter((item) => item.id !== arrastrandoId);
        nuevo.splice(indiceDestino, 0, arrastrado);
        setItems(nuevo);
        onReordenar(nuevo);
      }
    }
    setArrastrandoId(null);
    setOffsetY(0);
    setIndiceDestino(null);
  };

  const onPointerDown = (id: string) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setArrastrandoId(id);
    startYRef.current = e.clientY;
    // Insertarlo de vuelta en este mismo índice (dentro de la lista sin él)
    // reconstruye el orden original si se suelta sin mover el puntero.
    setIndiceDestino(items.findIndex((item) => item.id === id));
    setOffsetY(0);
    seMovioRef.current = false;
  };

  const onPointerMove = (id: string) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (arrastrandoId !== id) return;
    const delta = e.clientY - startYRef.current;
    if (Math.abs(delta) > UMBRAL_ARRASTRE_PX) seMovioRef.current = true;
    setOffsetY(delta);
    setIndiceDestino(calcularIndiceDestino(e.clientY, id));
  };

  const cancelar = () => {
    setArrastrandoId(null);
    setOffsetY(0);
    setIndiceDestino(null);
  };

  const dragHandleProps = (id: string): DragHandleGestureProps => ({
    onPointerDown: onPointerDown(id),
    onPointerMove: onPointerMove(id),
    onPointerUp: soltar,
    onPointerCancel: cancelar,
  });

  return { items, arrastrandoId, offsetY, indiceDestino, registrarRef, dragHandleProps };
}
