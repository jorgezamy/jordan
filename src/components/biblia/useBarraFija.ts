"use client";

import { useEffect, useRef, useState } from "react";

// `mostrar` se vuelve true cuando el elemento referenciado (los controles de
// arriba del lector) ya salió por arriba de la pantalla al hacer scroll —
// ahí es cuando se muestra la barra fija con el libro y capítulo.
export function useBarraFija<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entrada]) => {
      setMostrar(!entrada.isIntersecting && entrada.boundingClientRect.top < 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, mostrar };
}
