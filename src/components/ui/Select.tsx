import { forwardRef, SelectHTMLAttributes } from "react";

// El menú desplegable de un <select> lo pinta el sistema operativo, no la
// página — en Windows siempre con fondo blanco, sin importar el tema oscuro
// del sitio. Sin esto, las <option> heredan el texto claro del tema oscuro,
// casi invisible sobre ese fondo blanco nativo (bug reportado). Pásalo como
// className en cada <option> dentro de un <Select> para que el menú siempre
// sea legible.
export const selectOptionClassName = "bg-white text-gray-900";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = "", ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full outline-none transition-colors border-2 border-primary/40 dark:border-white/40 bg-gray-50 dark:bg-white/5 shadow-sm focus:border-primary focus:dark:border-white focus:ring-2 focus:ring-primary focus:dark:ring-white disabled:opacity-60 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-100 ${className}`}
      {...props}
    />
  ),
);

Select.displayName = "Select";
