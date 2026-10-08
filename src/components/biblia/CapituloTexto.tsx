import { Alert } from "../ui/Alert";
import { CopyIcon } from "../ui/CopyIcon";
import { Versiculo } from "./types";

interface CapituloTextoProps {
  versiculos: Versiculo[];
  loading: boolean;
  error: boolean;
  versoInicio: number | null;
  versoFin: number | null;
  onCopiarVerso: (numero: number) => void;
}

export function CapituloTexto({
  versiculos,
  loading,
  error,
  versoInicio,
  versoFin,
  onCopiarVerso,
}: CapituloTextoProps) {
  if (loading) {
    return (
      <div className="space-y-2 motion-safe:animate-pulse" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 rounded-full bg-gray-200 dark:bg-white/10" style={{ width: `${85 - i * 6}%` }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="px-4 py-2.5">
        No se pudo cargar el capítulo. Revisa tu conexión e intenta de nuevo.
      </Alert>
    );
  }

  return (
    <div className="text-lg sm:text-xl leading-relaxed text-gray-800 dark:text-gray-100">
      {versiculos.map((v) => {
        const seleccionado =
          versoInicio != null && v.numero >= versoInicio && v.numero <= (versoFin ?? versoInicio);

        return (
          <p
            key={v.numero}
            className={`mb-3 -mx-1.5 rounded px-1.5 py-1 ${
              seleccionado
                ? "bg-accent/25 underline decoration-accent decoration-2 underline-offset-4"
                : ""
            }`}
          >
            <sup className="text-accent font-semibold mr-0.5">{v.numero}</sup>
            {v.texto}{" "}
            <button
              onClick={() => onCopiarVerso(v.numero)}
              aria-label={`Copiar versículo ${v.numero}`}
              className="inline-flex align-middle w-4 h-4 items-center justify-center rounded text-gray-400 dark:text-gray-500 hover:text-primary hover:dark:text-white focus:text-primary focus:dark:text-white transition"
            >
              <CopyIcon className="w-3 h-3" />
            </button>
          </p>
        );
      })}
    </div>
  );
}
