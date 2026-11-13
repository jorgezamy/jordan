"use client";

interface BotonRecargaProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Navega con recarga completa. Las decoraciones leen la fecha y la URL una vez
 * al montarse, así que un cambio de `?fecha=` dentro de la misma página (navegación
 * de Next sin recarga) no las actualizaría.
 */
export function BotonRecarga({ href, className = "", children }: BotonRecargaProps) {
  return (
    <button type="button" onClick={() => window.location.assign(href)} className={`text-left ${className}`}>
      {children}
    </button>
  );
}
