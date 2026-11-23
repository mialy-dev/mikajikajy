import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";

const LIENS = [
  { label: "Accueil", to: "/" },
  { label: "À propos", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Activer ma licence", to: "/activation-licence" },
];

export default function PublicHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, basculer } = useTheme();
  const [ouvert, setOuvert] = useState(false);
  const [logoErreur, setLogoErreur] = useState(false);

  const classeLien = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-slate-100 text-[#DC2626] dark:bg-slate-800 dark:text-red-400"
        : "text-[#18304F] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
    }`;

  async function seDeconnecter() {
    setOuvert(false);
    await logout();
    navigate("/", { replace: true });
  }

  const boutonTheme = (
    <button
      type="button"
      onClick={basculer}
      aria-label={theme === "dark" ? "Passer au mode clair" : "Passer au mode sombre"}
      title={theme === "dark" ? "Mode clair" : "Mode sombre"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-[#18304F] transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );

  const boutons = user ? (
    <>
      <Link
        to="/dashboard"
        onClick={() => setOuvert(false)}
        className="rounded-lg px-3 py-2 text-sm font-medium text-[#18304F] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Tableau de bord
      </Link>
      <button
        type="button"
        onClick={seDeconnecter}
        className="rounded-lg border border-[#18304F] px-4 py-2 text-sm font-medium text-[#18304F] hover:bg-slate-50 dark:border-slate-500 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        Déconnexion
      </button>
    </>
  ) : (
    <Link
      to="/login"
      onClick={() => setOuvert(false)}
      className="rounded-lg bg-[#18304F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#10233b] dark:bg-[#DC2626] dark:hover:bg-red-700"
    >
      Connexion
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm dark:border-b dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => setOuvert(false)}
        >
          {!logoErreur && (
            <img
              src="/images/logo.png"
              alt="Logo E-KAJY"
              className="h-9 w-auto"
              onError={() => setLogoErreur(true)}
            />
          )}

          <span className="text-xl font-extrabold tracking-wide text-[#18304F] dark:text-white">
            <span className="text-[#DC2626]">E</span>-KAJY
          </span>
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-1 md:flex"
        >
          {LIENS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={classeLien}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {boutonTheme}
          {boutons}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {boutonTheme}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#18304F] dark:text-slate-200"
            aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={ouvert}
            onClick={() => setOuvert(!ouvert)}
          >
            {ouvert ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {ouvert && (
        <div className="space-y-1 border-t border-slate-100 px-4 pb-4 pt-2 dark:border-slate-800 md:hidden">
          {LIENS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOuvert(false)}
              className={(s) => `block ${classeLien(s)}`}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="flex flex-wrap items-center gap-2 pt-2">{boutons}</div>
        </div>
      )}
    </header>
  );
}