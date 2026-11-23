import { useEffect, useState } from "react";

const CLE = "ekajy-theme";

function themeInitial() {
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

export function useTheme() {
  const [theme, setTheme] = useState(themeInitial);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(CLE, theme);
    } catch {
      /* ignoré */
    }
  }, [theme]);

  const basculer = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, basculer };
}