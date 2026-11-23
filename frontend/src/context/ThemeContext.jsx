import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CLE = "ekajy-theme";
const ThemeContext = createContext(null);

function lireThemeInitial() {
  try {
    const sauvegarde = localStorage.getItem(CLE);
    if (sauvegarde === "light" || sauvegarde === "dark") return sauvegarde;
  } catch {
    /* localStorage indisponible */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function appliquerTheme(theme) {
  const racine = document.documentElement;
  racine.classList.toggle("dark", theme === "dark");
  racine.dataset.theme = theme;
  racine.style.colorScheme = theme;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(lireThemeInitial);

  useEffect(() => {
    appliquerTheme(theme);
    try {
      localStorage.setItem(CLE, theme);
    } catch {
      /* ignoré */
    }
  }, [theme]);

  // Synchronisation entre onglets
  useEffect(() => {
    function surStorage(e) {
      if (e.key === CLE && (e.newValue === "light" || e.newValue === "dark")) {
        setTheme(e.newValue);
      }
    }
    window.addEventListener("storage", surStorage);
    return () => window.removeEventListener("storage", surStorage);
  }, []);

  const basculer = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  const value = useMemo(
    () => ({ theme, estSombre: theme === "dark", basculer, definir: setTheme }),
    [theme, basculer]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme doit être utilisé dans <ThemeProvider>");
  }
  return ctx;
}