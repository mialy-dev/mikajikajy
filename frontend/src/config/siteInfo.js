export const siteInfo = {
  nom: "E-KAJY",
  logo: "/logo.png",          // ex. "/logo.png" si le fichier est dans public/ ; sinon le nom s'affiche en texte
  presentation: "Application web de gestion et de suivi des chantiers.",
  telephone: "030 00 000 00",     // ex. copiez le numéro officiel déjà utilisé sur le site
  email: "ekajy@gmail.com",
  adresse: "Lot AAAA Manakambahiny",
  horaires: "24h/24h",
  // ✅ Correct
reseaux: [
  { nom: "Facebook", url: "https://www.facebook.com/" },
]
};

// ⚠ Ces deux listes doivent rester identiques à celles de contact.controller.js
export const CATEGORIES_CONTACT = [
  "Demande d'information",
  "Support technique",
  "Licence et abonnement",
  "Partenariat",
  "Autre",
];
export const STATUTS_CONTACT = ["Nouveau", "En cours", "Traité"];