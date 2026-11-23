import { useEffect } from "react";

// Titre de l'onglet et description de la page (utiles pour le référencement)
export default function usePageTitle(titre, description) {
  useEffect(() => {
    const ancienTitre = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const ancienneDescription = meta?.getAttribute("content");

    document.title = titre ? `${titre} | E-KAJY` : "E-KAJY";
    if (description && meta) meta.setAttribute("content", description);

    return () => {
      document.title = ancienTitre;
      if (meta && ancienneDescription != null) meta.setAttribute("content", ancienneDescription);
    };
  }, [titre, description]);
}