import { useId, type ComponentType } from "react";
import { PALETA as C } from "./paleta";
import type { NombreFestivo } from "./types";

interface IlustracionProps {
  className?: string;
}

/** Nacimiento del Niño Dios: establo, estrella, María, José y el Niño en el pesebre. */
function Navidad({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 56 48" className={className} aria-hidden="true">
      <circle cx="28" cy="7.5" r="6.5" fill={C.oro} opacity=".3" />
      <path d="M28 1.5l1.6 4.4 4.4 1.6-4.4 1.6L28 13.5l-1.6-4.4-4.4-1.6 4.4-1.6z" fill={C.oro} />
      <path d="M8 21v23M48 21v23" stroke={C.madera} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M4 22 28 12l24 10" fill="none" stroke={C.techo} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="43" width="50" height="3.5" rx="1.75" fill={C.pasto} />
      {/* María */}
      <path d="M11 44q0-15 6-18 6 3 5.5 18z" fill={C.azul} />
      <circle cx="17" cy="23" r="5" fill={C.amarillo} opacity=".55" />
      <path d="M13 28q-.5-9 4-9t4 9z" fill={C.azulClaro} />
      <circle cx="17" cy="23.5" r="3" fill={C.piel} />
      {/* José */}
      <path d="M34 44q-.5-17 5.5-19.5 6 2.5 5.5 19.5z" fill={C.tunica} />
      <circle cx="39.5" cy="20" r="5" fill={C.amarillo} opacity=".55" />
      <path d="M35.5 21.5q0-6.5 4-6.5t4 6.5z" fill={C.mantoJose} />
      <circle cx="39.5" cy="20.5" r="3" fill={C.piel} />
      <path d="M36.8 21.5q2.7 5.5 5.4 0-2.7 2-5.4 0z" fill={C.maderaOscura} />
      {/* Pesebre y Niño */}
      <path d="m24.5 40-1.5 4m8.5-4 1.5 4" stroke={C.maderaOscura} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M22.5 35.5h11l-2 5h-7z" fill={C.madera} />
      <path d="M22 35.5h12" stroke={C.amarillo} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="25.4" cy="32.5" r="3.3" fill={C.amarillo} opacity=".6" />
      <ellipse cx="28.6" cy="33.2" rx="4.6" ry="2.2" fill={C.blanco} />
      <circle cx="25.3" cy="32.6" r="1.9" fill={C.piel} />
    </svg>
  );
}

const RAYOS = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);

function Estallido({ cx, cy, r, colores }: { cx: number; cy: number; r: number; colores: string[] }) {
  return (
    <g strokeLinecap="round" strokeWidth={r > 10 ? 2.4 : 2}>
      {RAYOS.map((a, i) => (
        <line
          key={i}
          x1={cx + Math.cos(a) * r * 0.35}
          y1={cy + Math.sin(a) * r * 0.35}
          x2={cx + Math.cos(a) * r}
          y2={cy + Math.sin(a) * r}
          stroke={colores[i % colores.length]}
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.16} fill={colores[0]} />
    </g>
  );
}

function AnoNuevo({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <Estallido cx={19} cy={19} r={15} colores={[C.oro, C.rosa, C.turquesa]} />
      <Estallido cx={38} cy={12} r={8.5} colores={[C.morado, C.amarillo]} />
      <path d="M38 27.5l1.1 3 3 1.1-3 1.1-1.1 3-1.1-3-3-1.1 3-1.1z" fill={C.oro} />
      <rect x="6" y="39" width="4" height="2.4" rx="1" fill={C.rosa} transform="rotate(-25 8 40)" />
      <rect x="15" y="43" width="4" height="2.4" rx="1" fill={C.turquesa} transform="rotate(20 17 44)" />
      <rect x="26" y="39" width="4" height="2.4" rx="1" fill={C.oro} transform="rotate(-40 28 40)" />
      <rect x="38" y="42" width="4" height="2.4" rx="1" fill={C.morado} transform="rotate(30 40 43)" />
      <circle cx="44" cy="36" r="1.4" fill={C.naranja} />
      <circle cx="3.5" cy="31" r="1.4" fill={C.amarillo} />
    </svg>
  );
}

/** Bandera de México ondeando. */
function Independencia({ className }: IlustracionProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <clipPath id={id}>
        <path d="M9 7q8.5-5 17 0t17 0v24q-8.5 5-17 0t-17 0z" />
      </clipPath>
      <path d="M8 5v40" stroke={C.madera} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="8" cy="4" r="2.2" fill={C.oro} />
      <g clipPath={`url(#${id})`}>
        <rect x="9" y="0" width="11.4" height="40" fill={C.verdeMexico} />
        <rect x="20.3" y="0" width="11.4" height="40" fill={C.blanco} />
        <rect x="31.6" y="0" width="11.4" height="40" fill={C.rojoMexico} />
      </g>
      <circle cx="26" cy="18.5" r="3.2" fill={C.aguila} />
      <path d="M21.8 21q4.2 4.5 8.4 0" fill="none" stroke={C.verde} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="22" cy="42" r="1.6" fill={C.verde} />
      <circle cx="31" cy="44" r="1.6" fill={C.blanco} />
      <circle cx="40" cy="41" r="1.6" fill={C.rojo} />
    </svg>
  );
}

function DiaDeLasMadres({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 43C10 34 5 26 5 18.5 5 12.5 9.5 8 15 8c4 0 7 2.5 9 5.5 2-3 5-5.5 9-5.5 5.5 0 10 4.5 10 10.5C43 26 38 34 24 43z"
        fill={C.rosa}
      />
      <path d="M12 14q2-2.5 5-2" fill="none" stroke={C.rosaClaro} strokeWidth="2" strokeLinecap="round" />
      <path d="M24 27q-5 2-7 7m7-7q5 2 7 7" fill="none" stroke={C.verde} strokeWidth="2" strokeLinecap="round" />
      {[0, 72, 144, 216, 288].map((g) => (
        <circle key={g} cx="24" cy="18.5" r="3.4" fill={C.blanco} transform={`rotate(${g} 24 23)`} />
      ))}
      <circle cx="24" cy="23" r="2.6" fill={C.amarillo} />
      <path d="M41 3.5c-1-1.6-3.5-1-3.3 1 .2 1.5 3.3 3.5 3.3 3.5s3.1-2 3.3-3.5c.2-2-2.3-2.6-3.3-1z" fill={C.rosaClaro} />
    </svg>
  );
}

/** Camisa con corbata. */
function DiaDelPadre({ className }: IlustracionProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <clipPath id={id}>
        <path d="M21.5 16h5l4 20-6.5 7.5-6.5-7.5z" />
      </clipPath>
      <path d="M12 6q12-3 24 0l2 38H10z" fill={C.azulClaro} />
      <path d="M14 5.5l10 6-5.5 5.5zM34 5.5l-10 6 5.5 5.5z" fill={C.blanco} />
      <path d="M21 11h6l-1 5h-4z" fill={C.rojoMexico} />
      <path d="M21.5 16h5l4 20-6.5 7.5-6.5-7.5z" fill={C.rojo} />
      <g clipPath={`url(#${id})`} stroke={C.amarillo} strokeWidth="1.8">
        <path d="M14 24l20-8M14 32l20-8M14 40l20-8" />
      </g>
      <path d="M43 30c-1.2-2-4.4-1.3-4.1 1.2.3 1.9 4.1 4.3 4.1 4.3s3.8-2.4 4.1-4.3c.3-2.5-2.9-3.2-4.1-1.2z" fill={C.rosa} />
      <path d="M5 30l.9 2.4 2.4.9-2.4.9L5 36.6l-.9-2.4-2.4-.9 2.4-.9z" fill={C.oro} />
    </svg>
  );
}

/** Globos de colores. */
function DiaDelNino({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M13 24.5q2 10 11 20M24 20.5q-2 12 0 24M35 25.5q-1 9-11 19" fill="none" stroke={C.gris} strokeWidth="1.2" />
      <ellipse cx="13" cy="16" rx="7" ry="8.5" fill={C.rojo} />
      <ellipse cx="35" cy="17" rx="7" ry="8.5" fill={C.azul} />
      <ellipse cx="24" cy="12" rx="7" ry="8.5" fill={C.amarillo} />
      <path d="M12 24.5h2l-1 1.6zM34 25.5h2l-1 1.6zM23 20.5h2l-1 1.6z" fill={C.blanco} />
      <ellipse cx="10.5" cy="12.5" rx="1.6" ry="2.6" fill={C.blanco} opacity=".5" />
      <ellipse cx="21.5" cy="8.5" rx="1.6" ry="2.6" fill={C.blanco} opacity=".6" />
      <ellipse cx="32.5" cy="13.5" rx="1.6" ry="2.6" fill={C.blanco} opacity=".5" />
      <circle cx="5" cy="34" r="1.6" fill={C.morado} />
      <circle cx="43" cy="33" r="1.6" fill={C.turquesa} />
      <circle cx="40" cy="42" r="1.3" fill={C.rosa} />
    </svg>
  );
}

export const ILUSTRACIONES: Record<NombreFestivo, ComponentType<IlustracionProps>> = {
  anoNuevo: AnoNuevo,
  diaDelNino: DiaDelNino,
  diaDeLasMadres: DiaDeLasMadres,
  diaDelPadre: DiaDelPadre,
  independencia: Independencia,
  navidad: Navidad,
};

/** Ilustración de un festivo por nombre (punto de entrada para la carga diferida). */
export function IlustracionFestivo({ nombre, className }: IlustracionProps & { nombre: NombreFestivo }) {
  const Ilustracion = ILUSTRACIONES[nombre];
  return <Ilustracion className={className} />;
}
