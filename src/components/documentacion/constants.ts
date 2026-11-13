import type { NombreEfecto } from "../fondoAnimado/types";

export const INFO_EFECTOS: Record<NombreEfecto, { titulo: string; descripcion: string }> = {
  nieve: {
    titulo: "Navidad",
    descripcion: "Nieve cayendo: copos de cristal y bolitas. También cubre la entrada del invierno.",
  },
  anoNuevo: {
    titulo: "Año Nuevo",
    descripcion: "Fuegos artificiales suaves en dorado, rosa y turquesa, con estela.",
  },
  primavera: {
    titulo: "Primavera",
    descripcion: "Flores de cerezo y pétalos rosas cayendo y girando.",
  },
  verano: {
    titulo: "Verano",
    descripcion: "Soles con rayos y estrellitas que destellan.",
  },
  otono: {
    titulo: "Otoño",
    descripcion: "Hojas naranjas y rojizas cayendo y girando.",
  },
};

/** Dónde se cambia cada cosa (para quien mantiene el código). */
export const DONDE_CAMBIAR = [
  { que: "Fechas de los fondos", donde: "src/components/fondoAnimado/constants.ts → CALENDARIO" },
  { que: "Cantidad, tamaño y velocidad", donde: "src/components/fondoAnimado/constants.ts → CONFIG_*" },
  { que: "Densidad en el header", donde: "src/components/fondoAnimado/constants.ts → OPCIONES_HEADER" },
  { que: "Colores de los fondos", donde: "src/app/globals.css → variables --fondo-*" },
  { que: "Fechas y saludos de los festivos", donde: "src/components/festivos/constants.ts → FESTIVOS" },
  { que: "Dibujos de los festivos", donde: "src/components/festivos/ilustraciones.tsx" },
  { que: "Colores de los dibujos", donde: "src/components/festivos/paleta.ts → PALETA" },
  { que: "Títulos del inicio y sus fechas", donde: "src/components/celebracion/constants.ts → TEMPORADAS_TITULO / INFO_CELEBRACION" },
  { que: "Botones de “Probar decoraciones”", donde: "src/components/vistaPrevia/ (se generan solos de FESTIVOS y TEMPORADAS_TITULO)" },
  { que: "Colores de los títulos", donde: "src/app/globals.css → --celebracion-* y --fondo-*" },
];
