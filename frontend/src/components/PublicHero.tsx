import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * ⚠️ À ADAPTER : routes réelles de ton application.
 */
const HERO_ROUTES = {
  start: "/login",
  discover: "/#fonctionnalites",
};

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

export default function PublicHero({ imageSrc = DEFAULT_IMAGE }) {
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
