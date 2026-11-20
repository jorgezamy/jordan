import { useId, type ComponentType } from "react";
import { PALETA as C } from "./paleta";
import type { NombreFestivo } from "./types";

interface IlustracionProps {
  className?: string;
}

/** Estrellita de 4 puntas; (x, y) es su punta superior. */
function Destello({ x, y, color, grande = false }: { x: number; y: number; color: string; grande?: boolean }) {
  const d = grande
    ? "l1.1 3 3 1.1-3 1.1-1.1 3-1.1-3-3-1.1 3-1.1z"
    : "l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z";
  return <path d={`M${x} ${y}${d}`} fill={color} />;
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
      <Destello x={38} y={27.5} grande color={C.oro} />
      <rect x="6" y="39" width="4" height="2.4" rx="1" fill={C.rosa} transform="rotate(-25 8 40)" />
      <rect x="15" y="43" width="4" height="2.4" rx="1" fill={C.turquesa} transform="rotate(20 17 44)" />
      <rect x="26" y="39" width="4" height="2.4" rx="1" fill={C.oro} transform="rotate(-40 28 40)" />
      <rect x="38" y="42" width="4" height="2.4" rx="1" fill={C.morado} transform="rotate(30 40 43)" />
      <circle cx="44" cy="36" r="1.4" fill={C.naranja} />
      <circle cx="3.5" cy="31" r="1.4" fill={C.amarillo} />
    </svg>
  );
}

/** Asta y bandera de México ondeando (compartida por Independencia y Día de la Bandera). */
function BanderaMexico() {
  const id = useId();
  return (
    <>
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
    </>
  );
}

function Independencia({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <BanderaMexico />
      <circle cx="22" cy="42" r="1.6" fill={C.verde} />
      <circle cx="31" cy="44" r="1.6" fill={C.blanco} />
      <circle cx="40" cy="41" r="1.6" fill={C.rojo} />
    </svg>
  );
}

/** Bandera con ramas de laurel. */
function DiaDeLaBandera({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <BanderaMexico />
      <path d="M15 40q10 7 22 0" fill="none" stroke={C.verdeMexico} strokeWidth="1.5" strokeLinecap="round" />
      {[17.5, 21.5, 30.5, 34.5].map((x, i) => (
        <ellipse
          key={x}
          cx={x}
          cy={i === 0 || i === 3 ? 40.5 : 42.6}
          rx="2.4"
          ry="1.2"
          fill={C.verde}
          transform={`rotate(${i < 2 ? -30 : 30} ${x} 41)`}
        />
      ))}
      <Destello x={42} y={38} color={C.oro} />
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

/** Ramo de tulipanes morados con moño (el morado es el color del 8 de marzo). */
function DiaDeLaMujer({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 44V22M24 44q-1-12-9-19M24 44q1-12 9-19"
        fill="none"
        stroke={C.verde}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M24 34q-7-1-9-7 6 0 9 5zM24 36q7-1 9-7-6 0-9 5z" fill={C.pasto} />
      <path d="M8.5 11q0 9 6.5 12 6.5-3 6.5-12l-3.2 3-3.3-5-3.3 5z" fill={C.morado} />
      <path d="M26.5 11q0 9 6.5 12 6.5-3 6.5-12l-3.2 3-3.3-5-3.3 5z" fill={C.morado} />
      <path d="M17.5 5q0 10 6.5 13 6.5-3 6.5-13l-3.2 3.2L24 3l-3.3 5.2z" fill={C.moradoOscuro} />
      <path d="M21 10q0 4 1.5 6" fill="none" stroke={C.lila} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 37.5l-6-3.5v7zM24 37.5l6-3.5v7z" fill={C.rosa} />
      <circle cx="24" cy="37.5" r="1.8" fill={C.rosaClaro} />
      <Destello x={43} y={30} color={C.oro} />
      <circle cx="5" cy="31" r="1.5" fill={C.lila} />
    </svg>
  );
}

/** Sombrero y bigote. */
function DiaDelHombre({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M14 22q-1-12 3-14 4-1 7 1.5Q27 7 31 8q4 2 3 14z" fill={C.azulOscuro} />
      <path d="M14.2 18.5h19.6v3.7H14.2z" fill={C.rojo} />
      <ellipse cx="24" cy="23" rx="18" ry="3.6" fill={C.azul} />
      <path
        d="M24 33.5q-3-3.5-7.5-2.5-4 1-6.5 4.5 4 1.5 8 .5 4-1 6-2.5 2 1.5 6 2.5t8-.5q-2.5-3.5-6.5-4.5-4.5-1-7.5 2.5z"
        fill={C.maderaOscura}
      />
      <Destello x={41} y={6} grande color={C.oro} />
      <circle cx="6" cy="9" r="1.6" fill={C.turquesa} />
      <circle cx="42" cy="40" r="1.5" fill={C.azulClaro} />
      <circle cx="7" cy="42" r="1.3" fill={C.oro} />
    </svg>
  );
}

const CORAZON =
  "M0 9C-8 4-10 0-10-3.5-10-6.5-7.8-9-5-9-2.8-9-1-7.6 0-5.8 1-7.6 2.8-9 5-9c2.8 0 5 2.5 5 5.5C10 0 8 4 0 9z";

/** Corona y rosca de reyes. */
function DiaDeReyes({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M13 22l-1.5-11 6.5 5.5L24 6l6 10.5 6.5-5.5L35 22z" fill={C.oro} />
      <rect x="13" y="21" width="22" height="4" rx="1" fill={C.amarillo} />
      <circle cx="18" cy="23" r="1.2" fill={C.rojo} />
      <circle cx="24" cy="23" r="1.2" fill={C.verde} />
      <circle cx="30" cy="23" r="1.2" fill={C.azul} />
      <path
        fillRule="evenodd"
        d="M5 37a19 8.5 0 1 0 38 0a19 8.5 0 1 0-38 0zM16 37a8 3 0 1 0 16 0a8 3 0 1 0-16 0z"
        fill={C.pan}
      />
      <rect x="8" y="34" width="5" height="2.2" rx="1" fill={C.rojo} transform="rotate(-25 10.5 35)" />
      <rect x="21" y="29.6" width="6" height="2.2" rx="1" fill={C.verde} />
      <rect x="35" y="34" width="5" height="2.2" rx="1" fill={C.amarillo} transform="rotate(25 37.5 35)" />
      <rect x="27" y="42" width="5" height="2.2" rx="1" fill={C.rojo} transform="rotate(-8 29.5 43)" />
      <rect x="14" y="41.6" width="5" height="2.2" rx="1" fill={C.verde} transform="rotate(10 16.5 42.7)" />
    </svg>
  );
}

/** Pergamino con sello tricolor. */
function DiaDeLaConstitucion({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="11" y="8" width="24" height="32" fill={C.blanco} stroke={C.gris} strokeWidth="1.2" />
      <rect x="8.5" y="4.5" width="29" height="5.5" rx="2.75" fill={C.pan} />
      <rect x="8.5" y="38" width="29" height="5.5" rx="2.75" fill={C.pan} />
      <path d="M15 15h16M15 19.5h16M15 24h12M15 28.5h9" stroke={C.grisOscuro} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M29 33l-2.5 8 3-1.5 1.5 2.5 1-7zM33 33l2.5 8-3-1.5-1.5 2.5-1-7z" fill={C.verdeMexico} />
      <circle cx="31" cy="31.5" r="4" fill={C.rojoMexico} />
      <circle cx="31" cy="31.5" r="1.8" fill={C.oro} />
      <path d="M44 6q-6 5-9.5 14l-1 2.5" fill="none" stroke={C.grisOscuro} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M44 6q1 7-7.5 12.5Q39 10 44 6z" fill={C.azulClaro} />
    </svg>
  );
}

/** Dos corazones. */
function DiaDelAmor({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d={CORAZON} fill={C.rosa} transform="translate(18 22) scale(1.45)" />
      <path d={CORAZON} fill={C.rojo} transform="translate(32 31) scale(1.15)" />
      <path d="M11 13q2-2.5 5-2.2" fill="none" stroke={C.rosaClaro} strokeWidth="2" strokeLinecap="round" />
      <Destello x={41} y={6} color={C.oro} />
      <circle cx="6" cy="38" r="1.6" fill={C.rosaClaro} />
    </svg>
  );
}

/** Casa con corazón. */
function DiaDeLaFamilia({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="10" y="20" width="28" height="23" fill={C.pan} />
      <path
        d="M5 23L24 6l19 17"
        fill="none"
        stroke={C.techo}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="31" y="8" width="4" height="8" fill={C.techo} />
      <rect x="20" y="33" width="8" height="10" rx="1" fill={C.maderaOscura} />
      <path d={CORAZON} fill={C.rojo} transform="translate(24 25) scale(.55)" />
      <rect x="3" y="43" width="42" height="3" rx="1.5" fill={C.pasto} />
    </svg>
  );
}

/** Balanza de la justicia. */
function NatalicioJuarez({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M24 9v31M9 14h30" stroke={C.madera} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="7.5" r="2.6" fill={C.oro} />
      <path d="M15 43q9-5 18 0z" fill={C.madera} />
      <path d="M9 14l-5 13M9 14l5 13M39 14l-5 13M39 14l5 13" stroke={C.grisOscuro} strokeWidth="1" />
      <path d="M3 27h12a6 4 0 0 1-12 0zM33 27h12a6 4 0 0 1-12 0z" fill={C.oro} />
      <Destello x={42} y={2} color={C.amarillo} />
    </svg>
  );
}

const DIENTES = [0, 45, 90, 135, 180, 225, 270, 315];

/** Engrane y martillo. */
function DiaDelTrabajo({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g fill={C.gris}>
        {DIENTES.map((g) => (
          <rect key={g} x="16.5" y="5" width="7" height="6" rx="1" transform={`rotate(${g} 20 20)`} />
        ))}
        <circle cx="20" cy="20" r="11" />
      </g>
      <circle cx="20" cy="20" r="4.5" fill={C.grisOscuro} />
      <path d="M24 44l15-19" stroke={C.madera} strokeWidth="4" strokeLinecap="round" />
      <rect x="31" y="19" width="15" height="7" rx="1.5" fill={C.azul} transform="rotate(-52 38.5 22.5)" />
      <Destello x={6} y={38} color={C.oro} />
    </svg>
  );
}

/** Libros y manzana. */
function DiaDelMaestro({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="7" y="36" width="34" height="7" rx="1.5" fill={C.azul} />
      <path d="M10 39.5h26" stroke={C.blanco} strokeWidth="1.2" />
      <rect x="10" y="29" width="29" height="7" rx="1.5" fill={C.verde} />
      <path d="M13 32.5h22" stroke={C.blanco} strokeWidth="1.2" />
      <path d="M24 13.5q-4-3-8 0t-1 11 8 4.5h2q5 0 8-4.5t-1-11-8 0z" fill={C.rojo} />
      <path d="M24 14q0-4 2-6" fill="none" stroke={C.maderaOscura} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M25.5 10q3-4 7.5-2.5-3 4.5-7.5 2.5z" fill={C.verde} />
      <ellipse cx="19" cy="18" rx="1.5" ry="2.6" fill={C.blanco} opacity=".5" />
      <Destello x={41} y={6} color={C.oro} />
    </svg>
  );
}

/** Birrete y diploma. */
function DiaDelEstudiante({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M13 20v8q11 6 22 0v-8z" fill={C.azulOscuro} />
      <path d="M24 6l20 9-20 9-20-9z" fill={C.azul} />
      <path d="M24 15l13 4v10" fill="none" stroke={C.oro} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M35.5 29h3l1 5h-5z" fill={C.oro} />
      <circle cx="24" cy="15" r="1.6" fill={C.oro} />
      <rect x="8" y="37" width="28" height="7" rx="3.5" fill={C.blanco} stroke={C.gris} strokeWidth="1.2" />
      <path d="M22 37v7" stroke={C.rojo} strokeWidth="2.5" />
      <Destello x={42} y={38} color={C.amarillo} />
    </svg>
  );
}

/** Notas musicales y estrellas. */
function DiaDeLaJuventud({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M19 37V13l18-5v24" fill="none" stroke={C.moradoOscuro} strokeWidth="2.5" />
      <path d="M19 13l18-5v5.5l-18 5z" fill={C.moradoOscuro} />
      <ellipse cx="14.5" cy="37.5" rx="5.5" ry="4.2" fill={C.morado} transform="rotate(-20 14.5 37.5)" />
      <ellipse cx="32.5" cy="32.5" rx="5.5" ry="4.2" fill={C.turquesa} transform="rotate(-20 32.5 32.5)" />
      <Destello x={8} y={6} grande color={C.oro} />
      <Destello x={42} y={38} color={C.rosa} />
      <circle cx="44" cy="18" r="1.5" fill={C.amarillo} />
      <circle cx="6" cy="24" r="1.4" fill={C.turquesa} />
    </svg>
  );
}

/** Lentes y corazón. */
function DiaDelAbuelo({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d={CORAZON} fill={C.rosa} transform="translate(24 14) scale(.9)" />
      <circle cx="14" cy="32" r="7.5" fill={C.azulClaro} opacity=".45" />
      <circle cx="34" cy="32" r="7.5" fill={C.azulClaro} opacity=".45" />
      <g fill="none" stroke={C.madera} strokeWidth="2.2" strokeLinecap="round">
        <circle cx="14" cy="32" r="7.5" />
        <circle cx="34" cy="32" r="7.5" />
        <path d="M21.5 31q2.5-2.5 5 0M6.5 30.5 2 27M41.5 30.5 46 27" />
      </g>
      <path
        d="M10 28q2-2 4.5-2M30 28q2-2 4.5-2"
        fill="none"
        stroke={C.blanco}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Locomotora (símbolo de la Revolución). */
function Revolucion({ className }: IlustracionProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="14" cy="7" r="3" fill={C.gris} />
      <circle cx="8.5" cy="4.5" r="2.2" fill={C.gris} opacity=".7" />
      <rect x="11.5" y="11" width="5.5" height="9" fill={C.grisOscuro} />
      <rect x="9" y="19" width="22" height="15" rx="2" fill={C.grisOscuro} />
      <rect x="27" y="11" width="14" height="23" rx="1.5" fill={C.rojoMexico} />
      <rect x="25" y="9" width="18" height="3.5" rx="1" fill={C.pizarra} />
      <rect x="30" y="15" width="8" height="7" rx="1" fill={C.azulClaro} />
      <path d="M9 27l-5 9h5z" fill={C.oro} />
      <circle cx="15" cy="37" r="5" fill={C.gris} />
      <circle cx="33" cy="37" r="5" fill={C.gris} />
      <circle cx="15" cy="37" r="1.8" fill={C.oro} />
      <circle cx="33" cy="37" r="1.8" fill={C.oro} />
      <path d="M2 44.5h44" stroke={C.madera} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export const ILUSTRACIONES: Record<NombreFestivo, ComponentType<IlustracionProps>> = {
  anoNuevo: AnoNuevo,
  diaDeLaMujer: DiaDeLaMujer,
  diaDelNino: DiaDelNino,
  diaDeLasMadres: DiaDeLasMadres,
  diaDelPadre: DiaDelPadre,
  independencia: Independencia,
  diaDelHombre: DiaDelHombre,
  navidad: Navidad,
  diaDeReyes: DiaDeReyes,
  diaDeLaConstitucion: DiaDeLaConstitucion,
  diaDelAmor: DiaDelAmor,
  diaDeLaBandera: DiaDeLaBandera,
  diaDeLaFamilia: DiaDeLaFamilia,
  natalicioJuarez: NatalicioJuarez,
  diaDelTrabajo: DiaDelTrabajo,
  diaDelMaestro: DiaDelMaestro,
  diaDelEstudiante: DiaDelEstudiante,
  diaDeLaJuventud: DiaDeLaJuventud,
  diaDelAbuelo: DiaDelAbuelo,
  revolucion: Revolucion,
};

/** Ilustración de un festivo por nombre (punto de entrada para la carga diferida). */
export function IlustracionFestivo({ nombre, className }: IlustracionProps & { nombre: NombreFestivo }) {
  const Ilustracion = ILUSTRACIONES[nombre];
  return <Ilustracion className={className} />;
}
