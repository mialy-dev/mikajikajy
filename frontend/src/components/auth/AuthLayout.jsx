import { FileText, Users, FolderKanban } from "lucide-react";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen bg-[#EFF6FF]">
      {/* Panneau de présentation (ordinateur uniquement) */}
      <aside className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-[#18304F] p-12 text-white lg:flex">
        <div className="text-2xl font-bold tracking-tight">
          {/* Remplacez par votre logo existant : <img src={logo} alt="E-KAJY" className="h-10" /> */}
          E-<span className="text-[#DC2626]">KAJY</span>
        </div>

        <div>
          <h2 className="text-3xl font-semibold leading-tight">
            Gérez vos projets, réunions et procès-verbaux au même endroit.
          </h2>
          <ul className="mt-8 space-y-4 text-sm text-white/80">
            <li className="flex items-center gap-3"><FolderKanban className="h-5 w-5 text-[#DC2626]" /> Suivi des chantiers et des constats</li>
            <li className="flex items-center gap-3"><FileText className="h-5 w-5 text-[#DC2626]" /> Rédaction et archivage des PV</li>
            <li className="flex items-center gap-3"><Users className="h-5 w-5 text-[#DC2626]" /> Collaboration entre intervenants</li>
          </ul>
        </div>

        <p className="text-xs text-white/50">© {new Date().getFullYear()} E-KAJY</p>

        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/5" />
      </aside>

      {/* Formulaire */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md animate-[fadeUp_.4s_ease-out]">
          <div className="mb-6 text-center text-2xl font-bold text-[#18304F] lg:hidden">
            E-<span className="text-[#DC2626]">KAJY</span>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h1 className="text-2xl font-semibold text-[#18304F]">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-[#64748B]">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </main>

      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}