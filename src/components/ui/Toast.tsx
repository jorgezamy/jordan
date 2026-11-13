import { CheckIcon } from "./CheckIcon";
import { CloseIcon } from "./CloseIcon";

type ToastVariant = "success" | "danger";

interface ToastProps {
  mensaje: string;
  variant?: ToastVariant;
}

const VARIANT_CLASSES: Record<ToastVariant, { pill: string; icono: string }> = {
  success: {
    pill: "bg-accent text-primary-darker shadow-accent/40 ring-white/40",
    icono: "bg-primary-darker text-accent",
  },
  danger: {
    pill: "bg-danger text-white shadow-danger/40 ring-white/30",
    icono: "bg-white text-danger",
  },
};

// Mensaje flotante y breve (p. ej. "¡Copiado!") fijo sobre la pantalla, para
// que se vea sin importar el scroll — un Alert dentro del flujo de la página
// quedaba fuera de vista al copiar un versículo de más abajo (reportado).
// Va ARRIBA (debajo de la barra fija del capítulo, top-20): abajo quedaba
// tapado por el aviso nativo de Android/Chrome "Copied." (reportado). Color
// de acento sólido para que destaque sobre el tema oscuro.
// Renderízalo solo mientras haya mensaje (useMensajeTemporal).
export function Toast({ mensaje, variant = "success" }: ToastProps) {
  return (
    <div className="fixed inset-x-0 top-20 z-50 flex justify-center px-4 pointer-events-none">
      <div
        key={mensaje}
        role="status"
        aria-live="polite"
        className={`inline-flex items-center gap-3 rounded-full py-2.5 pl-2.5 pr-6 text-base font-bold tracking-wide shadow-2xl ring-1 motion-safe:animate-[toast-in_0.35s_cubic-bezier(0.34,1.56,0.64,1)] ${VARIANT_CLASSES[variant].pill}`}
      >
        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${VARIANT_CLASSES[variant].icono}`}>
          {variant === "success" ? (
            <CheckIcon className="w-5 h-5" strokeWidth={3} />
          ) : (
            <CloseIcon className="w-5 h-5" strokeWidth={3} />
          )}
        </span>
        {mensaje}
      </div>
    </div>
  );
}
