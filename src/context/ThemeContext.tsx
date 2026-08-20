"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";
type ThemeAplicado = "light" | "dark";

const STORAGE_KEY = "theme";

interface ThemeContextType {
  theme: Theme;
  themeAplicado: ThemeAplicado;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function getInitialTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

function prefiereOscuro() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [themeAplicado, setThemeAplicado] = useState<ThemeAplicado>("light");

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    const aplicar = () => {
      const oscuro = theme === "system" ? prefiereOscuro() : theme === "dark";
      setThemeAplicado(oscuro ? "dark" : "light");
      document.documentElement.classList.toggle("dark", oscuro);
    };

    aplicar();
    window.localStorage.setItem(STORAGE_KEY, theme);

    if (theme !== "system") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", aplicar);
    return () => mql.removeEventListener("change", aplicar);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, themeAplicado, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
