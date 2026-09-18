"use client";

import { useEffect, useState } from "react";
import { MIN_APP_VERSION } from "./constants";
import { detectarVersionApp } from "./utils";

export function useAppUpdate() {
  const [obligatoria, setObligatoria] = useState(false);

  useEffect(() => {
    const version = detectarVersionApp();
    setObligatoria(version !== null && version < MIN_APP_VERSION);
  }, []);

  return { obligatoria };
}
