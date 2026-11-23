import { Link } from 'react-router-dom';
import { Droplets, ClipboardCheck, Users, SearchCheck, FileText, ShieldCheck, Archive, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TYPES_PRINCIPAUX, TYPES_AUTRES, NAVY, RED } from './pvConfig';

const ICONS = { Droplets, ClipboardCheck, Users, SearchCheck };

const FEATURES = [
  { icon: FileText, title: 'Gestion numérique', text: 'Rédigez vos procès-verbaux en ligne avec numérotation unique et modèles par type.' },
  { icon: Building2, title: 'Suivi des chantiers', text: 'Chaque PV est rattaché à un chantier, avec participants, réserves et observations.' },
  { icon: ShieldCheck, title: 'Validation & signatures', text: 'Circuit de vérification, validation, signature et historique complet des modifications.' },
  { icon: Archive, title: 'Archivage PDF', text: 'Recherche, filtres et téléchargement PDF de tous vos procès-verbaux.' },
];

export default function PVHome() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${NAVY}, #234a7a)` }} className="text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide">
            Module Procès-Verbaux
          </span>
          <h1 className="mt-4 text-3xl font-bold md:text-5xl">Gestion des Procès-Verbaux</h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Centralisez, rédigez, validez et archivez vos procès-verbaux de chantier.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/pv/liste" className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold text-white shadow"
              style={{ backgroundColor: RED }}>
              Accéder à mes PV <ArrowRight size={18} />
            </Link>
            <Link to="/chantiers" className="inline-flex items-center rounded-lg border border-white/30 px-5 py-3 font-semibold hover:bg-white/10">
              Voir les chantiers
            </Link>
          </div>
        </div>
      </section>

      {/* Atouts */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-[#EFF6FF] p-5">
              <Icon size={24} style={{ color: NAVY }} />
              <h3 className="mt-3 font-semibold" style={{ color: NAVY }}>{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Types principaux */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-2xl font-bold" style={{ color: NAVY }}>Nos différents types de PV</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TYPES_PRINCIPAUX.map((t) => {
            const Icon = ICONS[t.icon];
            return (
              <div key={t.code} className="flex flex-col rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: '#EFF6FF', color: NAVY }}>
                  <Icon size={26} />
                </div>
                <h3 className="mt-4 text-lg font-semibold" style={{ color: NAVY }}>{t.libelle}</h3>
                <p className="mt-1 flex-1 text-sm text-slate-500">{t.description}</p>
                <Link to={`/pv/${t.code}`} className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
                  style={{ backgroundColor: RED }}>
                  Consulter <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Autres PV */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold" style={{ color: NAVY }}>Autres procès-verbaux</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TYPES_AUTRES.map((t) => (
              <li key={t.code}>
                <Link to={`/pv/${t.code}`} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-700 hover:border-slate-400">
                  <CheckCircle2 size={18} style={{ color: RED }} /> {t.libelle}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
