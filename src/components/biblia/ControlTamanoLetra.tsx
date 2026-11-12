interface ControlTamanoLetraProps {
  puedeAumentar: boolean;
  puedeDisminuir: boolean;
  aumentar: () => void;
  disminuir: () => void;
}

const BOTON =
  "w-9 h-9 inline-flex items-center justify-center rounded-full font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 hover:dark:bg-white/15 transition disabled:opacity-40 disabled:cursor-not-allowed";

// "A− / A+" para achicar o agrandar el texto del capítulo.
export function ControlTamanoLetra({ puedeAumentar, puedeDisminuir, aumentar, disminuir }: ControlTamanoLetraProps) {
  return (
    <div
      role="group"
      aria-label="Tamaño de letra"
      className="inline-flex items-center rounded-full bg-gray-100 dark:bg-white/10 p-0.5"
    >
      <button onClick={disminuir} disabled={!puedeDisminuir} aria-label="Letra más pequeña" className={`${BOTON} text-sm`}>
        A−
      </button>
      <button onClick={aumentar} disabled={!puedeAumentar} aria-label="Letra más grande" className={`${BOTON} text-lg`}>
        A+
      </button>
    </div>
  );
}
