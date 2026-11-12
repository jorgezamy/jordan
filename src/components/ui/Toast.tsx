import { CheckIcon } from "./CheckIcon";
import { CloseIcon } from "./CloseIcon";

type ToastVariant = "success" | "danger";

interface ToastProps {
  mensaje: string;
  variant?: ToastVariant;
}

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  success: "bg-primary-darker text-white",
  danger: "bg-danger text-white",
};

// Mensaje flotante y breve (p. ej. "¡Copiado!") fijo sobre la pantalla, para
// que se vea sin importar el scroll — un Alert dentro del flujo de la página
// quedaba fuera de vista al copiar un versículo de más abajo (reportado).
// Va por encima del BottomNav en móvil (bottom-20) y abajo al centro en
// escritorio. Renderízalo solo mientras haya mensaje (useMensajeTemporal).
export function Toast({ mensaje, variant = "success" }: ToastProps) {
  return (
    <div className="fixed inset-x-0 bottom-20 sm:bottom-8 z-50 flex justify-center px-4 pointer-events-none">
      <div
        key={mensaje}
        role="status"
        aria-live="polite"
        className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-2xl motion-safe:animate-[toast-in_0.3s_ease-out] ${VARIANT_CLASSES[variant]}`}
      >
        {variant === "success" ? (
          <CheckIcon className="w-5 h-5 text-accent" strokeWidth={3} />
        ) : (
          <CloseIcon className="w-5 h-5" strokeWidth={3} />
        )}
        {mensaje}
      </div>
    </div>
  );
}
