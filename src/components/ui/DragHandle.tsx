import { DragHandleGestureProps } from "../../hooks/useReordenarLista";
import { GripIcon } from "./GripIcon";

interface DragHandleProps extends DragHandleGestureProps {
  className?: string;
}

// Handle de arrastre reusable para cualquier lista ordenada con
// useReordenarLista: recibe directamente el `dragHandleProps(id)` que
// devuelve ese hook. `touch-none` evita que arrastrar también haga scroll
// en móvil — ver useReordenarLista para el porqué de Pointer Events en vez
// de la API nativa de Drag and Drop.
export function DragHandle({ className = "", ...gestureProps }: DragHandleProps) {
  return (
    <button
      type="button"
      aria-label="Arrastrar para reordenar"
      className={`shrink-0 self-stretch px-1 -ml-1 flex items-center text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 touch-none cursor-grab active:cursor-grabbing ${className}`}
      {...gestureProps}
    >
      <GripIcon className="w-4 h-4" />
    </button>
  );
}
