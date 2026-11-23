import { Link, Navigate } from "react-router-dom";
import { FileText, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PV_TYPES } from "../config/pvTypes";
import usePageTitle from "../hooks/usePageTitle";

export default function PvPage({ slug }) {
  const { user } = useAuth();
  const pv = PV_TYPES.find((p) => p.slug === slug);
  usePageTitle(pv?.titre, pv?.resume);

  if (!pv) return <Navigate to="/" replace />;
  const autres = PV_TYPES.filter((p) => p.slug !== slug);

  return (
    <div className="bg-[#EFF6FF]">
      <section className="bg-[#18304F] px-4 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-5xl">
          <FileText size={36} className="text-[#DC2626]" aria-hidden="true" />
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{pv.titre}</h1>
          <p className="mt-3 max-w-2xl text-slate-200">{pv.resume}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {user ? (
              <Link to="/dashboard" className="rounded-lg bg-[#DC2626] px-5 py-2.5 font-semibold text-white hover:bg-red-700">
                Accéder à mon espace
              </Link>
            ) : (
              <Link to="/login" className="rounded-lg bg-[#DC2626] px-5 py-2.5 font-semibold text-white hover:bg-red-700">
                Se connecter
              </Link>
            )}
            <Link to="/contact" className="rounded-lg border border-white/60 px-5 py-2.5 font-semibold text-white hover:bg-white/10">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        <article className="rounded-2xl bg-white p-6 shadow sm:p-8">
          <h2 className="text-xl font-semibold text-[#18304F]">À quoi sert ce document ?</h2>
          <p className="mt-3 text-[#64748B]">{pv.description}</p>

          {pv.points.length > 0 && (
            <ul className="mt-5 space-y-3">
              {pv.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}
        </article>

        <section aria-labelledby="autres-pv">
          <h2 id="autres-pv" className="mb-4 text-xl font-semibold text-[#18304F]">Autres procès-verbaux</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {autres.map((p) => (
              <Link key={p.slug} to={`/${p.slug}`} className="rounded-xl bg-white p-5 shadow transition hover:shadow-md">
                <h3 className="font-semibold text-[#18304F]">{p.titre}</h3>
                <p className="mt-1 text-sm text-[#64748B]">{p.resume}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}