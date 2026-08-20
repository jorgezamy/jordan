export const CITAS_LIMITE = 100;

export const VERSIONES_BIBLICAS = [
  "NVI",
  "RVR1960",
  "LBLA",
  "NTV",
  "DHH",
  "RVC",
] as const;

export type VersionBiblica = (typeof VERSIONES_BIBLICAS)[number];
