import { Link } from "react-router-dom";
import { siteInfo } from "../config/siteInfo";

const LIENS = [
  { label: "Accueil", to: "/" },
  { label: "À propos", to: "/about" },
  { label: "Services", to: "/#services" }, // ⚠ à adapter
  { label: "Contact", to: "/contact" },
];
const LIENS_LEGAUX = [
  { label: "Mentions légales", to: "/legal" },
  { label: "Confidentialité", to: "/privacy" },
  { label: "Conditions", to: "/terms" },
];

export default function Footer() {
  const { nom, logo, presentation, telephone, email, adresse, horaires, reseaux } = siteInfo;
  return (
    <footer className="bg-[#18304F] text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="inline-block">
            {logo ? <img src={logo} alt={nom} className="h-10 w-auto" /> : <span className="text-2xl font-bold text-white">{nom}</span>}
          </Link>
          {presentation && <p className="mt-3 text-sm text-slate-300">{presentation}</p>}
        </div>

        <nav aria-label="Liens utiles">
          <h3 className="mb-3 font-semibold text-white">Liens utiles</h3>
          <ul className="space-y-2 text-sm">
            {LIENS.map((l) => (
              <li key={l.label}><Link to={l.to} className="hover:text-white hover:underline">{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        {(telephone || email || adresse || horaires) && (
          <div>
            <h3 className="mb-3 font-semibold text-white">Contact</h3>
            <ul className="space-y-2 text-sm">
              {telephone && <li><a href={`tel:${telephone.replace(/[^\d+]/g, "")}`} className="hover:underline">{telephone}</a></li>}
              {email && <li><a href={`mailto:${email}`} className="break-all hover:underline">{email}</a></li>}
              {adresse && (
                <li>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresse)}`}
                    target="_blank" rel="noopener noreferrer" className="hover:underline">{adresse}</a>
                </li>
              )}
              {horaires && <li className="whitespace-pre-line">{horaires}</li>}
            </ul>
          </div>
        )}

        {reseaux.length > 0 && (
          <div>
            <h3 className="mb-3 font-semibold text-white">Suivez-nous</h3>
            <ul className="space-y-2 text-sm">
              {reseaux.map((r) => (
                <li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{r.nom}</a></li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-400 sm:flex-row">
          <p>© 2026 {nom}. Tous droits réservés.</p>
          <ul className="flex flex-wrap gap-4">
            {LIENS_LEGAUX.map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-white hover:underline">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}