import { CONFIG_NIEVE, CONFIG_OTONO, CONFIG_PRIMAVERA, CONFIG_VERANO } from "./constants";
import { crearEscenaCaida } from "./escenaCaida";
import { crearEscenaFuegos } from "./escenaFuegos";
import type { ConfigCaida, DefinicionEfecto, NombreEfecto } from "./types";

const caida = (cfg: ConfigCaida, variables: string[]): DefinicionEfecto => ({
  variables,
  crearEscena: (ancho, alto, opciones) => crearEscenaCaida(cfg, variables.length, ancho, alto, opciones),
});

const FUEGOS_VARIABLES = ["--fondo-fuegos-1", "--fondo-fuegos-2", "--fondo-fuegos-3", "--fondo-fuegos-brillo"];

export const EFECTOS: Record<NombreEfecto, DefinicionEfecto> = {
  nieve: caida(CONFIG_NIEVE, ["--fondo-nieve"]),
  anoNuevo: {
    variables: FUEGOS_VARIABLES,
    crearEscena: (ancho, alto, opciones) =>
      crearEscenaFuegos(FUEGOS_VARIABLES.length, ancho, alto, opciones),
  },
  primavera: caida(CONFIG_PRIMAVERA, ["--fondo-petalo-1", "--fondo-petalo-2", "--fondo-flor-centro"]),
  verano: caida(CONFIG_VERANO, ["--fondo-verano-1", "--fondo-verano-2"]),
  otono: caida(CONFIG_OTONO, ["--fondo-hoja-1", "--fondo-hoja-2", "--fondo-hoja-3"]),
};
