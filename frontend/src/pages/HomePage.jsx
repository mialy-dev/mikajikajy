import { Link } from 'react-router-dom';
import {
  Archive, ArrowRight, Building2, CheckCircle2, ClipboardCheck, Droplets, FileSignature,
  FileText, KanbanSquare, SearchCheck, ShieldCheck, Users,
} from 'lucide-react';

// Cette page ne contient NI en-tête NI pied de page : ils viennent de PublicLayout.

const NAVY = '#18304F';
const RED = '#DC2626';

const FEATURES = [
  { icon: KanbanSquare, title: 'Suivi des chantiers', text: 'Visualisez vos chantiers par étape (nouveaux, réception, mise en eau, réserves) et déplacez-les en glisser-déposer.' },
  { icon: FileText, title: 'Procès-verbaux numériques', text: 'Rédigez vos PV en ligne avec numérotation unique, participants, observations et réserves.' },
  { icon: ShieldCheck, title: 'Validation en circuit', text: 'Brouillon, soumis, en vérification, validé, signé, archivé : chaque PV suit un circuit clair et tracé.' },
  { icon: FileSignature, title: 'Signatures électroniques', text: 'Collectez les signatures de l’entreprise et du maître d’œuvre directement sur le PV.' },
  { icon: Archive, title: 'Archivage et PDF', text: 'Recherchez, filtrez, imprimez et téléchargez vos procès-verbaux au format PDF.' },
  { icon: Users, title: 'Rôles et permissions', text: 'Superadmin, éditeur, lecteur ou intervenant : chacun voit et fait uniquement ce qui le concerne.' },
];

const PV_TYPES = [
  { to: '/pv/mise-en-eau', label: 'PV Mise en eau', icon: Droplets },
  { to: '/pv/reception', label: 'PV Réception', icon: ClipboardCheck },
  { to: '/pv/reunion', label: 'PV de réunion', icon: Users },
  { to: '/pv/constat', label: 'PV de constat', icon: SearchCheck },
];

const STEPS = [
  { n: '1', title: 'Créez le PV', text: 'Choisissez le chantier et le type de procès-verbal, puis remplissez le formulaire.' },
  { n: '2', title: 'Faites-le valider', text: 'Soumettez-le : il est vérifié, puis validé ou renvoyé avec un motif.' },
  { n: '3', title: 'Signez et archivez', text: 'Ajoutez les signatures, imprimez ou téléchargez le PDF, puis archivez.' },
];

function PreviewCard() {
  return (
    <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-5 text-slate-800 shadow-2xl">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-slate-500">PV-ME-2026-00012</span>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Validé</span>
      </div>
      <h3 className="mt-3 text-lg font-bold" style={{ color: NAVY }}>PV de mise en eau — Toiture terrasse</h3>
      <p className="text-sm text-slate-500">Bâtiment A (R+1)</p>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Essai 1 : pas d’infiltrations</div>
        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> 2 annotations avec photos</div>
        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Signatures entreprise et MOE</div>
      </div>
      <div className="mt-4 flex gap-2">
        <span className="rounded-lg bg-[#EFF6FF] px-3 py-1.5 text-xs font-semibold" style={{ color: NAVY }}>Imprimer</span>
        <span className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white" style={{ backgroundColor: RED }}>Télécharger PDF</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section style={{ backgroundColor: NAVY }} className="text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:py-20 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
              Gestion de chantiers et procès-verbaux
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              Pilotez vos chantiers et vos <span className="text-red-400">procès-verbaux</span> en toute simplicité
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-200">
              E-KAJY centralise la rédaction, la validation, la signature et l’archivage de vos PV de chantier,
              pour les entreprises, maîtres d’ouvrage, bureaux d’études et responsables de chantier.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/pv" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow transition hover:brightness-110" style={{ backgroundColor: RED }}>
                Découvrir les PV <ArrowRight size={18} />
              </Link>
              <Link to="/activation-licence" className="inline-flex items-center rounded-xl border border-white/30 px-6 py-3 font-semibold hover:bg-white/10">
                Activer ma licence
              </Link>
            </div>
          </div>
          <PreviewCard />
        </div>
      </section>

      {/* Types de PV */}
      <section className="bg-[#f1f6fb]">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PV_TYPES.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF6FF]" style={{ color: NAVY }}><Icon size={22} /></span>
                <span className="font-semibold" style={{ color: NAVY }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalités (ancre #fonctionnalites utilisée par le menu) */}
      <section id="fonctionnalites" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold" style={{ color: NAVY }}>Tout ce qu’il faut pour vos procès-verbaux</h2>
          <p className="mt-3 text-slate-500">Une plateforme simple, pensée pour le terrain et pour le bureau.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-slate-200 p-6 transition hover:shadow-lg">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF6FF]" style={{ color: NAVY }}><Icon size={24} /></span>
              <h3 className="mt-4 text-lg font-bold" style={{ color: NAVY }}>{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-[#f1f6fb]">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-center text-3xl font-bold" style={{ color: NAVY }}>Comment ça marche</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl bg-white p-6 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white" style={{ backgroundColor: RED }}>{s.n}</span>
                <h3 className="mt-4 text-lg font-bold" style={{ color: NAVY }}>{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appel à l'action */}
      <section style={{ backgroundColor: NAVY }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-14 text-center text-white">
          <Building2 size={36} className="text-red-400" />
          <h2 className="text-3xl font-bold">Prêt à numériser vos procès-verbaux ?</h2>
          <p className="max-w-xl text-slate-200">Activez votre licence et gérez vos chantiers depuis un seul endroit.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/activation-licence" className="rounded-xl px-6 py-3 font-semibold text-white hover:brightness-110" style={{ backgroundColor: RED }}>Activer ma licence</Link>
            <Link to="/contact" className="rounded-xl border border-white/30 px-6 py-3 font-semibold hover:bg-white/10">Nous contacter</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
