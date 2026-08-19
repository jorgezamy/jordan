import { useCallback, useRef, useState } from "react";

export function useMensajeTemporal(duracionMs = 3000) {
  const [mensaje, setMensaje] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const mostrarMensaje = useCallback(
    (texto: string) => {
      clearTimeout(timeoutRef.current);
      setMensaje(texto);
      timeoutRef.current = setTimeout(() => setMensaje(""), duracionMs);
    },
    [duracionMs],
  );

  return { mensaje, mostrarMensaje };
}
