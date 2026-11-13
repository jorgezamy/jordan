export interface OpcionVistaPrevia {
  etiqueta: string;
  /** Fecha que se simula, ya como texto ("25 dic"). */
  cuando: string;
  href: string;
}

export interface GrupoVistaPrevia {
  titulo: string;
  opciones: OpcionVistaPrevia[];
}
