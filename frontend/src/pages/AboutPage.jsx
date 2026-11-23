import { Link } from "react-router-dom";
import {
  HardHat,
  FileText,
  Users,
  Wallet,
  ClipboardList,
  MessageSquareText,
  Target,
  Eye,
  LayoutGrid,
  ShieldCheck,
  Zap,
  Accessibility,
} from "lucide-react";

const features = [
  { icon: HardHat, title: "Gestion et suivi des chantiers" },
  { icon: FileText, title: "Gestion des plans et documents techniques" },
  { icon: Users, title: "Suivi des équipes et des intervenants" },
  { icon: Wallet, title: "Gestion des dépenses et des ressources" },
  { icon: ClipboardList, title: "Création et consultation des procès-verbaux" },
  { icon: MessageSquareText, title: "Suivi des constats et annotations" },
];

const values = [
  {
    icon: LayoutGrid,
    title: "Organisation",
    text: "Centraliser les informations et faciliter le travail quotidien.",
  },
  {
    icon: ShieldCheck,
    title: "Transparence",
    text: "Favoriser un meilleur suivi des activités et des projets.",
  },
  {
    icon: Zap,
    title: "Efficacité",
    text: "Gagner du temps grâce à des outils numériques simples et rapides.",
  },
  {
    icon: Accessibility,
    title: "Accessibilité",
    text: "Offrir une plateforme facile à prendre en main pour tous.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-700">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#EFF6FF] to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 md:py-24">
          <span className="inline-block rounded-full bg-red-50 px-4 py-1 text-sm font-semibold text-[#DC2626]">
            À propos d'E-KAJY
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#18304F] sm:text-4xl md:text-5xl">
            Votre plateforme dédiée à la gestion et au suivi des bâtiments et
            des projets de construction
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-[#64748B] sm:text-lg">
            E-KAJY est une solution numérique conçue pour faciliter
            l'organisation, la coordination et le suivi des activités liées aux
            projets de construction.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/activation-licence"
              className="rounded-lg bg-[#DC2626] px-6 py-3 font-semibold text-white shadow transition hover:bg-red-700"
            >
              Activer ma licence
            </Link>
            <Link
              to="/contact"
              className="rounded-lg border border-[#18304F] px-6 py-3 font-semibold text-[#18304F] transition hover:bg-[#18304F] hover:text-white"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#18304F]">
              <Target size={26} />
            </div>
            <h2 className="text-2xl font-bold text-[#18304F]">Notre mission</h2>
            <p className="mt-3 leading-relaxed text-[#64748B]">
              Simplifier la gestion des projets de construction en centralisant
              les informations, les documents et les activités dans un espace de
              travail unique.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#DC2626]">
              <Eye size={26} />
            </div>
            <h2 className="text-2xl font-bold text-[#18304F]">Notre vision</h2>
            <p className="mt-3 leading-relaxed text-[#64748B]">
              Rendre la gestion des projets de construction plus accessible,
              organisée et efficace grâce aux outils numériques.
            </p>
          </article>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="bg-[#EFF6FF] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-[#18304F]">
            Nos fonctionnalités
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#18304F] text-white">
                  <Icon size={22} />
                </div>
                <p className="pt-2 font-semibold text-[#18304F]">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-[#18304F]">
          Nos valeurs
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 p-6 text-center transition hover:border-[#DC2626] hover:shadow-md"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-[#DC2626]">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#18304F]">{title}</h3>
              <p className="mt-2 text-sm text-[#64748B]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="bg-[#18304F]">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Prêt à mieux organiser vos chantiers ?
          </h2>
          <p className="mt-3 text-slate-300">
            Rejoignez E-KAJY et centralisez tout votre suivi de construction.
          </p>
          <Link
            to="/activation-licence"
            className="mt-6 inline-block rounded-lg bg-[#DC2626] px-8 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Commencer maintenant
          </Link>
        </div>
      </section>
    </main>
  );
}


