# setup-ekajy.ps1 : crée tous les fichiers du frontend E-KAJY et installe les paquets.
# Utilisation : à la racine de F:\Projects\frontend, lance :  .\setup-ekajy.ps1
$ErrorActionPreference = "Stop"
if (-not (Test-Path "package.json")) { Write-Host "Lance ce script à la racine du projet (là où est package.json)." -ForegroundColor Red; exit 1 }

function Write-File($path, $content) {
  $dir = Split-Path $path -Parent
  if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $full = Join-Path (Get-Location) $path
  [System.IO.File]::WriteAllText($full, $content, (New-Object System.Text.UTF8Encoding($false)))
  Write-Host "OK  $path" -ForegroundColor Green
}

Write-File "vite.config.js" @'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
'@

Write-File "index.html" @'
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>E-KAJY</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
'@

Write-File "src/main.jsx" @'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
'@

Write-File "src/App.jsx" @'
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlaceholderPage from "./pages/PlaceholderPage";

// ⚠️ Remplace chaque <PlaceholderPage /> par ta vraie page quand tu l'as.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<PlaceholderPage title="Connexion" />} />
      <Route path="/activation-licence" element={<PlaceholderPage title="Activer ma licence" />} />
      <Route path="/tarifs" element={<PlaceholderPage title="Tarifs" />} />
      <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
      <Route path="/pv-mise-en-eau" element={<PlaceholderPage title="PV mise en eau" />} />
      <Route path="/pv-reception" element={<PlaceholderPage title="PV réception" />} />
      <Route path="/pv-autre" element={<PlaceholderPage title="Autre type de PV" />} />
      <Route path="/chantiers" element={<Navigate to="/chantiers" replace />} />
    </Routes>
  );
}
'@

Write-File "src/pages/HomePage.jsx" @'
import { Building2, FileCheck2, Users, Wallet } from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicHero from "../components/PublicHero";

const FEATURES = [
  { icon: Building2, title: "Projets et chantiers", text: "Suivez l'avancement de chaque bâtiment, plan et constat au même endroit." },
  { icon: Users, title: "Équipes", text: "Organisez vos équipes et leurs tâches sur le terrain." },
  { icon: Wallet, title: "Dépenses", text: "Gardez le contrôle du budget et des ressources de chaque projet." },
  { icon: FileCheck2, title: "Procès-verbaux", text: "Générez vos PV de mise en eau et de réception en quelques clics." },
];

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <main>
        <PublicHero />
        <section id="fonctionnalites" className="scroll-mt-20 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#18304F]">Fonctionnalités</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-[#EFF6FF] p-6">
                  <Icon className="h-7 w-7 text-[#DC2626]" />
                  <h3 className="mt-4 font-semibold text-[#18304F]">{title}</h3>
                  <p className="mt-2 text-sm text-[#64748B]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
'@

Write-File "src/pages/PlaceholderPage.jsx" @'
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";

export default function PlaceholderPage({ title }) {
  return (
    <>
      <PublicHeader />
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-[#18304F]">{title}</h1>
        <p className="mt-4 text-[#64748B]">
          Page à brancher sur ta vraie page E-KAJY.
        </p>
        <Link to="/" className="mt-8 inline-block rounded-xl bg-[#DC2626] px-6 py-3 font-semibold text-white hover:bg-[#b91c1c]">
          Retour à l'accueil
        </Link>
      </main>
    </>
  );
}
'@

Write-File "src/components/PublicHeader.tsx" @'
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, FileText, KeyRound, Menu, X } from "lucide-react";

// ⚠️ À ADAPTER avec tes vraies routes
export const PUBLIC_ROUTES = {
  home: "/",
  features: "/#fonctionnalites",
  pvWater: "/pv-mise-en-eau",
  pvReception: "/pv-reception",
  pvOther: "/pv-autre",
  pricing: "/tarifs",
  contact: "/contact",
  login: "/login",
  license: "/activation-licence",
} as const;

type MenuKey = "pv" | "others" | null;
interface MenuItem { label: string; to: string }

const PV_ITEMS: MenuItem[] = [
  { label: "PV mise en eau", to: PUBLIC_ROUTES.pvWater },
  { label: "PV réception", to: PUBLIC_ROUTES.pvReception },
  { label: "Autre type", to: PUBLIC_ROUTES.pvOther },
];
const OTHER_ITEMS: MenuItem[] = [
  { label: "Tarifs", to: PUBLIC_ROUTES.pricing },
  { label: "Contact", to: PUBLIC_ROUTES.contact },
];

const NAV_LINK =
  "rounded-lg px-3 py-2 text-sm font-medium text-[#18304F] transition-colors hover:bg-[#EFF6FF]";

function AppLink({ to, className, children, onClick }: {
  to: string; className?: string; children: React.ReactNode; onClick?: () => void;
}) {
  if (to.includes("#")) {
    return <a href={to} className={className} onClick={onClick}>{children}</a>;
  }
  return <Link to={to} className={className} onClick={onClick}>{children}</Link>;
}

function Logo() {
  return (
    <AppLink to={PUBLIC_ROUTES.home} className="flex items-center gap-3">
      <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true">
        <path d="M2 18 L20 3 L38 18 L38 25 L20 10 L2 25 Z" fill="#111827" />
        <path d="M7 23 L20 12 L33 23 V37 H7 Z" fill="#DC2626" />
        <rect x="16" y="26" width="8" height="11" rx="1" fill="#FFFFFF" />
      </svg>
      <span className="text-xl font-extrabold tracking-tight text-[#18304F]">E-KAJY</span>
    </AppLink>
  );
}

function Dropdown({ label, items, open, onToggle, onNavigate }: {
  label: string; items: MenuItem[]; open: boolean; onToggle: () => void; onNavigate: () => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex items-center gap-1 ${NAV_LINK} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]`}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        role="menu"
        className={`absolute left-0 top-full z-50 mt-2 w-56 origin-top rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg transition-all duration-200 ${
          open ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-1 scale-95 opacity-0"
        }`}
      >
        {items.map((item) => (
          <AppLink
            key={item.label}
            to={item.to}
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#18304F] transition-colors hover:bg-[#EFF6FF] hover:text-[#DC2626]"
          >
            <FileText className="h-4 w-4 text-[#64748B]" />
            {item.label}
          </AppLink>
        ))}
      </div>
    </div>
  );
}

export default function PublicHeader() {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState<MenuKey>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpenMenu(null); setMobileOpen(false); }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const closeAll = () => { setOpenMenu(null); setMobileOpen(false); setMobileSub(null); };
  const toggle = (key: Exclude<MenuKey, null>) =>
    setOpenMenu((current) => (current === key ? null : key));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white shadow-sm">
      <div ref={navRef} className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Navigation bureau : tout à droite, comme sur le modèle */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          <AppLink to={PUBLIC_ROUTES.features} className={NAV_LINK}>Fonctionnalités</AppLink>
          <Dropdown label="PV" items={PV_ITEMS} open={openMenu === "pv"} onToggle={() => toggle("pv")} onNavigate={closeAll} />
          <Dropdown label="Autres" items={OTHER_ITEMS} open={openMenu === "others"} onToggle={() => toggle("others")} onNavigate={closeAll} />
          <AppLink to={PUBLIC_ROUTES.login} className={NAV_LINK}>Connexion</AppLink>
          <AppLink
            to={PUBLIC_ROUTES.license}
            className="ml-2 inline-flex items-center gap-2 rounded-lg bg-[#DC2626] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#b91c1c] hover:shadow-md"
          >
            <KeyRound className="h-4 w-4" />
            Activer ma licence
          </AppLink>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
          className="rounded-lg p-2 text-[#18304F] transition-colors hover:bg-[#EFF6FF] lg:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menu mobile */}
      <div
        className={`grid overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 lg:hidden ${
          mobileOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] border-t-0 opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-1 px-4 py-4">
            <AppLink to={PUBLIC_ROUTES.features} onClick={closeAll} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#18304F] hover:bg-[#EFF6FF]">
              Fonctionnalités
            </AppLink>

            {([["pv", "PV", PV_ITEMS], ["others", "Autres", OTHER_ITEMS]] as const).map(([key, label, items]) => (
              <div key={key}>
                <button
                  type="button"
                  onClick={() => setMobileSub((s) => (s === key ? null : key))}
                  aria-expanded={mobileSub === key}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-[#18304F] hover:bg-[#EFF6FF]"
                >
                  {label}
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileSub === key ? "rotate-180" : ""}`} />
                </button>
                {mobileSub === key && (
                  <div className="ml-3 space-y-1 border-l border-slate-200 pl-3">
                    {items.map((item) => (
                      <AppLink key={item.label} to={item.to} onClick={closeAll} className="block rounded-lg px-3 py-2 text-sm text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#DC2626]">
                        {item.label}
                      </AppLink>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <AppLink to={PUBLIC_ROUTES.login} onClick={closeAll} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#18304F] hover:bg-[#EFF6FF]">
              Connexion
            </AppLink>
            <div className="pt-2">
              <AppLink to={PUBLIC_ROUTES.license} onClick={closeAll} className="flex items-center justify-center gap-2 rounded-lg bg-[#DC2626] px-4 py-2.5 text-sm font-semibold text-white">
                <KeyRound className="h-4 w-4" />
                Activer ma licence
              </AppLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
'@

Write-File "src/components/PublicHero.tsx" @'
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * ⚠️ À ADAPTER : routes réelles de ton application.
 */
const HERO_ROUTES = {
  start: "/login",
  discover: "/#fonctionnalites",
} as const;

interface PublicHeroProps {
  /**
   * Chemin d'une illustration 3D personnalisée (ex: "/images/hero-ekajy.png",
   * placée dans le dossier public/). Si absent, l'illustration SVG intégrée
   * est utilisée : aucun fichier image externe requis.
   */
  imageSrc?: string;
}

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 560 420"
      role="img"
      aria-label="Ordinateur portable affichant un tableau de bord de chantier, avec une grue, un casque et des bâtiments"
      className="h-auto w-full"
    >
      <defs>
        <linearGradient id="ek-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EFF6FF" />
        </linearGradient>
        <linearGradient id="ek-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CBD5E1" />
          <stop offset="1" stopColor="#94A3B8" />
        </linearGradient>
        <filter id="ek-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#18304F" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Sol */}
      <ellipse cx="280" cy="392" rx="240" ry="16" fill="#18304F" opacity="0.08" />

      {/* Bâtiments en arrière-plan */}
      <g>
        <rect x="30" y="200" width="70" height="190" rx="4" fill="#18304F" />
        <rect x="108" y="250" width="56" height="140" rx="4" fill="#64748B" />
        {[215, 240, 265, 290, 315].map((y) => (
          <g key={y}>
            <rect x="42" y={y} width="14" height="12" rx="2" fill="#EFF6FF" opacity="0.85" />
            <rect x="68" y={y} width="14" height="12" rx="2" fill="#EFF6FF" opacity="0.85" />
          </g>
        ))}
      </g>

      {/* Grue */}
      <g stroke="#DC2626" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M470 392 V90" />
        <path d="M470 90 H330" />
        <path d="M470 90 H515" />
        <path d="M470 90 L360 90 M470 60 L470 90" />
        <path d="M470 60 L335 90 M470 60 L515 90" strokeWidth="3" />
        <path d="M345 90 V160" strokeWidth="3" stroke="#18304F" />
      </g>
      <rect x="332" y="160" width="26" height="14" rx="3" fill="#DC2626" />
      <rect x="494" y="82" width="22" height="16" rx="3" fill="#18304F" />

      {/* Ordinateur portable */}
      <g filter="url(#ek-shadow)">
        <rect x="120" y="110" width="320" height="205" rx="14" fill="#18304F" />
        <rect x="132" y="122" width="296" height="181" rx="8" fill="url(#ek-screen)" />
        <path d="M80 330 H480 L455 366 Q452 372 444 372 H116 Q108 372 105 366 Z" fill="url(#ek-base)" />
        <rect x="235" y="330" width="90" height="8" rx="4" fill="#94A3B8" />
      </g>

      {/* Tableau de bord */}
      <g>
        <rect x="132" y="122" width="62" height="181" rx="8" fill="#18304F" />
        <rect x="142" y="136" width="42" height="8" rx="4" fill="#DC2626" />
        {[158, 176, 194, 212].map((y) => (
          <rect key={y} x="142" y={y} width="42" height="6" rx="3" fill="#EFF6FF" opacity="0.55" />
        ))}
        {/* cartes KPI */}
        <rect x="206" y="136" width="64" height="40" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect x="278" y="136" width="64" height="40" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect x="350" y="136" width="64" height="40" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect x="214" y="146" width="24" height="5" rx="2.5" fill="#64748B" />
        <rect x="214" y="158" width="38" height="9" rx="3" fill="#18304F" />
        <rect x="286" y="146" width="24" height="5" rx="2.5" fill="#64748B" />
        <rect x="286" y="158" width="30" height="9" rx="3" fill="#DC2626" />
        <rect x="358" y="146" width="24" height="5" rx="2.5" fill="#64748B" />
        <rect x="358" y="158" width="42" height="9" rx="3" fill="#18304F" />
        {/* graphique */}
        <rect x="206" y="186" width="208" height="104" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
        {[
          [222, 40],
          [246, 60],
          [270, 48],
          [294, 74],
          [318, 56],
          [342, 82],
          [366, 66],
        ].map(([x, h]) => (
          <rect key={x} x={x} y={278 - h} width="14" height={h} rx="3" fill="#18304F" opacity={h > 70 ? 1 : 0.35} />
        ))}
        <path
          d="M222 250 L258 232 L294 240 L330 214 L366 220 L402 200"
          stroke="#DC2626"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Plans enroulés */}
      <g>
        <rect x="52" y="338" width="120" height="26" rx="13" fill="#FFFFFF" stroke="#CBD5E1" />
        <path d="M70 346 H150 M70 354 H130" stroke="#18304F" strokeWidth="2" opacity="0.5" />
        <circle cx="52" cy="351" r="13" fill="#EFF6FF" stroke="#CBD5E1" />
      </g>

      {/* Casque de chantier */}
      <g transform="translate(405 300)">
        <ellipse cx="45" cy="64" rx="52" ry="8" fill="#18304F" opacity="0.15" />
        <path d="M4 58 C4 20 28 0 48 0 C70 0 90 22 90 58 Z" fill="#DC2626" />
        <path d="M44 2 H56 V58 H44 Z" fill="#B91C1C" />
        <rect x="-6" y="56" width="108" height="12" rx="6" fill="#B91C1C" />
        <path d="M18 40 C20 26 30 14 42 10" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.45" fill="none" />
      </g>
    </svg>
  );
}

const DEFAULT_IMAGE = "/images/hero-ekajy.png";

export default function PublicHero({ imageSrc = DEFAULT_IMAGE }: PublicHeroProps) {
  // Si l'image est introuvable, on affiche l'illustration SVG intégrée.
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#F5F9FF] to-[#E4EEFF]">
      <style>{`
        @keyframes ek-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .ek-rise { animation: ek-rise .7s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .ek-rise { animation: none; } }
      `}</style>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-24">
        <div>
          <p className="ek-rise text-sm font-bold uppercase tracking-widest text-[#2563EB]">
            ERP bâtiment &amp; construction
          </p>

          <h1
            className="ek-rise mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#18304F] sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            Gérez vos chantiers intelligemment avec E-KAJY
          </h1>

          <p
            className="ek-rise mt-6 max-w-xl text-base leading-relaxed text-[#64748B] sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            La solution ERP qui simplifie la gestion de vos projets de construction, vos équipes,
            vos dépenses et vos ressources.
          </p>

          <div className="ek-rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
            <Link
              to={HERO_ROUTES.start}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18304F] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#18304F]/20 transition-all hover:-translate-y-0.5 hover:bg-[#10223a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18304F] focus-visible:ring-offset-2"
            >
              Commencer maintenant
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href={HERO_ROUTES.discover}
              className="inline-flex items-center justify-center rounded-xl border border-[#18304F]/25 bg-white px-6 py-3.5 text-base font-semibold text-[#18304F] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#EFF6FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18304F] focus-visible:ring-offset-2"
            >
              Découvrir E-KAJY
            </a>
          </div>
        </div>

        <div className="ek-rise mx-auto w-full max-w-xl lg:max-w-none" style={{ animationDelay: "200ms" }}>
          {imageFailed ? (
            <HeroIllustration />
          ) : (
            <img
              src={imageSrc}
              alt="Tableau de bord E-KAJY sur ordinateur portable, avec grue, casque de chantier et plans"
              className="h-auto w-full rounded-3xl shadow-2xl shadow-[#18304F]/15"
              loading="eager"
              onError={() => setImageFailed(true)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
'@


# index.css : ajoute Tailwind en première ligne s'il manque
New-Item -ItemType Directory -Path "src" -Force | Out-Null
if (Test-Path "src/index.css") { $css = Get-Content "src/index.css" -Raw } else { $css = "" }
if ($css -notmatch '@import\s+["'']tailwindcss["'']') {
  [System.IO.File]::WriteAllText((Join-Path (Get-Location) "src/index.css"), "@import `"tailwindcss`";`nhtml { scroll-behavior: smooth; }`n`n" + $css, (New-Object System.Text.UTF8Encoding($false)))
  Write-Host "OK  src/index.css (Tailwind ajouté)" -ForegroundColor Green
} else { Write-Host "OK  src/index.css (déjà bon)" -ForegroundColor Green }

New-Item -ItemType Directory -Path "public/images" -Force | Out-Null

Write-Host "`nInstallation des paquets..." -ForegroundColor Cyan
npm install react react-dom react-router-dom lucide-react axios
npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite

Write-Host "`nTerminé. Lance maintenant :  npm run dev" -ForegroundColor Cyan
