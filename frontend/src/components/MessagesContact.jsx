import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, X, Mail, Phone } from "lucide-react";
import { api } from "../lib/api";
import { CATEGORIES_CONTACT, STATUTS_CONTACT } from "../config/siteInfo";

const COULEURS = {
  "Nouveau": "bg-red-100 text-red-700",
  "En cours": "bg-amber-100 text-amber-800",
  "Traité": "bg-green-100 text-green-800",
};
const fmt = (d) => new Date(d).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
const selectCls = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

// Pastille « nouveaux messages » à placer dans le menu du tableau de bord (administrateurs uniquement)
export function BadgeMessagesContact() {
  const [n, setN] = useState(0);
  useEffect(() => {
    let actif = true;
    api.get("/contact/stats").then((r) => { if (actif) setN(r.data.nouveaux); }).catch(() => {});
    return () => { actif = false; };
  }, []);
  if (!n) return null;
  return <span className="ml-2 rounded-full bg-[#DC2626] px-2 py-0.5 text-xs font-semibold text-white">{n}</span>;
}

function Etiquette({ statut }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${COULEURS[statut] ?? ""}`}>{statut}</span>;
}

export default function MessagesContact() {
  const [filtres, setFiltres] = useState({ statut: "", categorie: "", q: "" });
  const [qSaisie, setQSaisie] = useState("");
  const [page, setPage] = useState(1);
  const [donnees, setDonnees] = useState({ items: [], total: 0, limit: 20, nouveaux: 0 });
  const [etat, setEtat] = useState("chargement");
  const [ouvert, setOuvert] = useState(null);
  const [aSupprimer, setASupprimer] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const t = setTimeout(() => { setFiltres((f) => ({ ...f, q: qSaisie })); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [qSaisie]);

  const charger = useCallback(async () => {
    setEtat("chargement");
    try {
      const params = { page, limit: 20 };
      if (filtres.statut) params.statut = filtres.statut;
      if (filtres.categorie) params.categorie = filtres.categorie;
      if (filtres.q) params.q = filtres.q;
      const { data } = await api.get("/contact", { params });
      setDonnees(data);
      setEtat("ok");
    } catch (e) {
      setEtat(e.response?.status === 403 ? "interdit" : "erreur");
    }
  }, [filtres, page]);

  useEffect(() => { charger(); }, [charger]);

  async function changerStatut(id, statut) {
    setErreur("");
    try {
      const { data: maj } = await api.put(`/contact/${id}/statut`, { statut });
      setOuvert(maj);
      charger();
    } catch (e) { setErreur(e.response?.data?.message || "Modification impossible."); }
  }

  async function supprimer() {
    const m = aSupprimer;
    setASupprimer(null);
    setErreur("");
    try {
      await api.delete(`/contact/${m.id}`);
      setOuvert(null);
      charger();
    } catch (e) { setErreur(e.response?.data?.message || "Suppression impossible."); }
  }

  const pages = Math.max(1, Math.ceil(donnees.total / donnees.limit));

  if (etat === "interdit") {
    return <div className="p-10 text-center text-[#64748B]">Cette rubrique est réservée aux administrateurs.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-[#18304F]">
          Messages de contact
          {donnees.nouveaux > 0 && (
            <span className="ml-3 rounded-full bg-[#DC2626] px-2.5 py-0.5 text-sm font-semibold text-white">
              {donnees.nouveaux} nouveau{donnees.nouveaux > 1 ? "x" : ""}
            </span>
          )}
        </h1>
        <Link to="/dashboard" className="text-sm text-[#18304F] underline">Retour au tableau de bord</Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <select aria-label="Filtrer par statut" className={selectCls} value={filtres.statut}
          onChange={(e) => { setFiltres({ ...filtres, statut: e.target.value }); setPage(1); }}>
          <option value="">Tous les statuts</option>
          {STATUTS_CONTACT.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select aria-label="Filtrer par catégorie" className={selectCls} value={filtres.categorie}
          onChange={(e) => { setFiltres({ ...filtres, categorie: e.target.value }); setPage(1); }}>
          <option value="">Toutes les catégories</option>
          {CATEGORIES_CONTACT.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input type="search" placeholder="Rechercher (nom, e-mail, sujet, message)" className={`${selectCls} min-w-[16rem] flex-1`}
          value={qSaisie} onChange={(e) => setQSaisie(e.target.value)} />
      </div>

      {erreur && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-[#DC2626]">{erreur}</p>}

      {etat === "chargement" && <p className="p-6 text-center text-[#64748B]">Chargement…</p>}
      {etat === "erreur" && (
        <p className="p-6 text-center text-[#64748B]">
          Impossible de charger les messages.{" "}
          <button className="underline" onClick={charger}>Réessayer</button>
        </p>
      )}
      {etat === "ok" && donnees.items.length === 0 && (
        <p className="rounded-xl bg-white p-8 text-center text-[#64748B] shadow">Aucun message.</p>
      )}

      {etat === "ok" && donnees.items.length > 0 && (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl bg-white shadow">
          {donnees.items.map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => setOuvert(m)}
                className="flex w-full flex-col gap-1 px-4 py-3 text-left hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
                <span className="min-w-0">
                  <span className={`block truncate text-[#18304F] ${m.statut === "Nouveau" ? "font-bold" : "font-medium"}`}>{m.sujet}</span>
                  <span className="block truncate text-sm text-[#64748B]">{m.nom_complet} · {m.categorie}</span>
                </span>
                <span className="flex items-center gap-3 text-xs text-[#64748B]">
                  <span>{fmt(m.date_creation)}</span>
                  <Etiquette statut={m.statut} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {etat === "ok" && pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <button className={selectCls} disabled={page <= 1} onClick={() => setPage(page - 1)}>Précédent</button>
          <span className="text-[#64748B]">Page {page} sur {pages}</span>
          <button className={selectCls} disabled={page >= pages} onClick={() => setPage(page + 1)}>Suivant</button>
        </div>
      )}

      {/* Lecture d'un message */}
      {ouvert && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          onClick={() => setOuvert(null)}>
          <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold text-[#18304F]">{ouvert.sujet}</h2>
              <button type="button" aria-label="Fermer" onClick={() => setOuvert(null)}><X size={20} /></button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#64748B]">
              <Etiquette statut={ouvert.statut} />
              <span>{ouvert.categorie}</span>
              <span>· {fmt(ouvert.date_creation)}</span>
            </div>
            <p className="mt-4 text-sm font-medium text-[#18304F]">{ouvert.nom_complet}</p>
            <div className="mt-1 flex flex-wrap gap-4 text-sm">
              <a href={`mailto:${ouvert.email}?subject=${encodeURIComponent("Re: " + ouvert.sujet)}`}
                className="inline-flex items-center gap-1 text-[#18304F] underline"><Mail size={14} />{ouvert.email}</a>
              {ouvert.telephone && (
                <a href={`tel:${ouvert.telephone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-center gap-1 text-[#18304F] underline"><Phone size={14} />{ouvert.telephone}</a>
              )}
            </div>
            <p className="mt-4 whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-4 text-sm text-slate-700">{ouvert.message}</p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-sm text-[#64748B]">Statut :</span>
              {STATUTS_CONTACT.map((s) => (
                <button key={s} type="button" disabled={ouvert.statut === s} onClick={() => changerStatut(ouvert.id, s)}
                  className={`rounded-lg border px-3 py-1.5 text-sm ${ouvert.statut === s ? "border-[#18304F] bg-[#18304F] text-white" : "border-slate-300 hover:bg-slate-50"}`}>
                  {s}
                </button>
              ))}
              <button type="button" onClick={() => setASupprimer(ouvert)}
                className="ml-auto inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-[#DC2626] hover:bg-red-50">
                <Trash2 size={14} /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation de suppression */}
      {aSupprimer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div role="alertdialog" aria-modal="true" className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="font-semibold text-[#18304F]">Supprimer ce message ?</h3>
            <p className="mt-2 text-sm text-[#64748B]">« {aSupprimer.sujet} » sera définitivement supprimé.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className={selectCls} onClick={() => setASupprimer(null)}>Annuler</button>
              <button type="button" onClick={supprimer} className="rounded-lg bg-[#DC2626] px-4 py-2 text-sm text-white">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}