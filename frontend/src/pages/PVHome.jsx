import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Archive, Building2, CheckCircle2, ClipboardCheck, Droplets, FileText, SearchCheck, ShieldCheck, Users } from 'lucide-react';
import { TYPES_PRINCIPAUX, TYPES_AUTRES, NAVY, RED } from './pvConfig';

const ICONS = { Droplets, ClipboardCheck, Users, SearchCheck };

const FEATURES = [
  { icon: FileText, title: 'Gestion numérique', text: 'Rédigez vos procès-verbaux en ligne avec numérotation unique et modèles par type.' },
  { icon: Building2, title: 'Suivi des chantiers', text: 'Chaque PV est rattaché à un chantier, avec participants, réserves et observations.' },
  { icon: ShieldCheck, title: 'Validation & signatures', text: 'Circuit de vérification, validation, signature et historique complet des modifications.' },
  { icon: Archive, title: 'Archivage PDF', text: 'Recherche, filtres et téléchargement PDF de tous vos procès-verbaux.' },
];

// Photo de la carte : /public/pv/<code>.jpg  (ex. public/pv/mise-en-eau.jpg). Sans photo : dégradé + icône.
function CardPhoto({ code, Icon }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl">
      {failed ? (
        <div className="flex h-full w-full items-center justify-center" style={{ background: `linear-gradient(135deg, ${NAVY}, #2b5a94)` }}>
          <Icon size={54} className="text-white/80" />
        </div>
      ) : (
        <img src={`/pv/${code}.jpg`} alt="" loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      )}
    </div>
  );
}

export default function PVHome() {
  return (
    <div className="bg-[#f1f6fb]">
      {/* Bandeau titre : prolonge l'en-tête marine */}
      <section style={{ backgroundColor: NAVY }}>
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-8">
          <h1 className="text-3xl font-bold text-white md:text-4xl">Gestion des Procès-Verbaux</h1>
          <p className="mt-3 max-w-2xl text-[17px] text-slate-200">
            Centralisez, rédigez, validez et archivez vos procès-verbaux de chantier.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-500/15 px-3.5 py-1 text-sm font-semibold text-emerald-400">Gestion numérique</span>
            <span className="rounded-full bg-blue-500/20 px-3.5 py-1 text-sm font-semibold text-blue-400">Suivi des chantiers</span>
          </div>
        </div>
      </section>

      {/* Types de PV */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Nos différents types de PV</h2>
          <Link to="/pv/liste" className="hidden text-sm font-semibold sm:inline" style={{ color: RED }}>Voir tous les PV →</Link>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TYPES_PRINCIPAUX.map((t) => {
            const Icon = ICONS[t.icon];
            return (
              <article key={t.code} className="group flex flex-col rounded-[28px] bg-white p-2.5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <CardPhoto code={t.code} Icon={Icon} />
                <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
                  <h3 className="text-lg font-bold text-slate-900">{t.libelle}</h3>
                  <p className="mt-1 flex-1 text-sm text-slate-500">{t.description}</p>
                  <Link to={`/pv/${t.code}`} className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: RED }}>
                    Consulter <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Atouts */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-white p-5 shadow-sm">
              <Icon size={24} style={{ color: NAVY }} />
              <h3 className="mt-3 font-semibold" style={{ color: NAVY }}>{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Autres PV */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="text-2xl font-bold text-slate-900">Autres procès-verbaux</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TYPES_AUTRES.map((t) => (
              <li key={t.code}>
                <Link to={`/pv/${t.code}`} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
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
