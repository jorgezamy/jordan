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

// Reordenamiento por arrastre (mouse + touch, vía Pointer Events) para
// cualquier lista con filas identificables por `id` — hoy la usa
// "Avisos publicados" (src/components/avisos/ListaAvisosAdmin.tsx), pero no
// depende de nada específico de avisos, para poder reusarla en la próxima
// lista que necesite orden manual.
//
// La fila arrastrada sigue al puntero pixel a pixel escribiendo su
// `transform` directamente en el DOM (no vía estado de React) para que sea
// fluido — actualizar estado de React en cada evento de movimiento fuerza un
// re-render de toda la lista por cada pixel, que es lo que se sentía
// "atorado". El resto de la lista sí se reordena en vivo en cuanto el
// puntero cruza a un vecino (para que se aparten de verdad, no solo se
// muestre una línea de destino), animado con la técnica FLIP. Lo único que
// se pospone hasta soltar es `onReordenar`: el guardado real (Firestore vía
// quien use el hook) solo se dispara una vez, al final.
export function useReordenarLista<T extends { id: string }>(
  itemsIniciales: T[],
  onReordenar: (nuevoOrden: T[]) => void,
) {
  const [items, setItems] = useState(itemsIniciales);
  const [arrastrandoId, setArrastrandoId] = useState<string | null>(null);

  const elementosRef = useRef<Map<string, HTMLLIElement>>(new Map());
  // Última posición natural (top, sin transform) conocida de cada fila —
  // usada tanto para animar el FLIP de las filas quietas como para anclar
  // la fila arrastrada al puntero.
  const posicionesRef = useRef<Map<string, number>>(new Map());
  // Dónde debería estar visualmente el top de la fila arrastrada ahora
  // mismo (coordenadas de viewport), actualizado en cada pointermove.
  const desiredTopRef = useRef(0);
  // Distancia entre el puntero y el top de la fila al agarrarla — se resta
  // siempre para que la fila no "salte" a quedar centrada en el puntero.
  const grabOffsetRef = useRef(0);
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
      if (!el) return;

      // Medir la posición "natural" (sin transform) siempre requiere
      // quitar primero cualquier transform que haya quedado puesto a mano
      // (arrastre en curso, o recién soltado) — si no, la medición
      // arrastraría ese offset y el cálculo de abajo saldría mal.
      el.style.transition = "none";
      el.style.transform = "none";
      const posicionNatural = el.getBoundingClientRect().top;

      if (item.id === arrastrandoId) {
        posicionesRef.current.set(item.id, posicionNatural);
        el.style.transform = `translateY(${desiredTopRef.current - posicionNatural}px) scale(1.02)`;
        return;
      }

      const posicionPrevia = posicionesRef.current.get(item.id);
      if (posicionPrevia !== undefined && posicionPrevia !== posicionNatural) {
        el.style.transform = `translateY(${posicionPrevia - posicionNatural}px)`;
        requestAnimationFrame(() => {
          el.style.transition = "transform 200ms ease";
          el.style.transform = "";
        });
      } else {
        el.style.transform = "";
      }
      posicionesRef.current.set(item.id, posicionNatural);
    });
  }, [items, arrastrandoId]);

  const registrarRef = (id: string) => (el: HTMLLIElement | null) => {
    if (el) elementosRef.current.set(id, el);
    else elementosRef.current.delete(id);
  };

  // Índice (entre los items NO arrastrados) donde debería quedar el item
  // arrastrado ahora mismo, según la posición vertical del puntero.
  const calcularIndiceDestino = (pointerY: number, idArrastrado: string) => {
    const visibles = items.filter((item) => item.id !== idArrastrado);
    for (let i = 0; i < visibles.length; i++) {
      const rect = elementosRef.current.get(visibles[i].id)?.getBoundingClientRect();
      if (rect && pointerY < rect.top + rect.height / 2) return i;
    }
    return visibles.length;
  };

  const onPointerDown = (id: string) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);

    const rect = elementosRef.current.get(id)?.getBoundingClientRect();
    const naturalTop = rect ? rect.top : e.clientY;

    grabOffsetRef.current = e.clientY - naturalTop;
    desiredTopRef.current = naturalTop;
    startYRef.current = e.clientY;
    seMovioRef.current = false;

    setArrastrandoId(id);
  };

  const onPointerMove = (id: string) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (arrastrandoId !== id) return;

    if (!seMovioRef.current && Math.abs(e.clientY - startYRef.current) > UMBRAL_ARRASTRE_PX) {
      seMovioRef.current = true;
    }

    desiredTopRef.current = e.clientY - grabOffsetRef.current;

    const el = elementosRef.current.get(id);
    const naturalTop = posicionesRef.current.get(id);
    if (el && naturalTop !== undefined) {
      el.style.transform = `translateY(${desiredTopRef.current - naturalTop}px) scale(1.02)`;
    }

    if (!seMovioRef.current) return;

    const indiceActual = items.findIndex((item) => item.id === id);
    const indiceDestino = calcularIndiceDestino(e.clientY, id);
    if (indiceDestino !== indiceActual) {
      const arrastrado = items[indiceActual];
      const nuevo = items.filter((item) => item.id !== id);
      nuevo.splice(indiceDestino, 0, arrastrado);
      setItems(nuevo);
    }
  };

  const soltar = () => {
    if (arrastrandoId) {
      const el = elementosRef.current.get(arrastrandoId);
      if (el) {
        // Congela dónde quedó visualmente (con el transform del arrastre
        // todavía aplicado) para que la animación FLIP que sigue arranque
        // justo ahí, en vez de saltar de vuelta a su posición natural.
        posicionesRef.current.set(arrastrandoId, el.getBoundingClientRect().top);
      }
      if (seMovioRef.current) onReordenar(items);
    }
    setArrastrandoId(null);
  };

  const cancelar = () => setArrastrandoId(null);

  const dragHandleProps = (id: string): DragHandleGestureProps => ({
    onPointerDown: onPointerDown(id),
    onPointerMove: onPointerMove(id),
    onPointerUp: soltar,
    onPointerCancel: cancelar,
  });

  return { items, arrastrandoId, registrarRef, dragHandleProps };
}
