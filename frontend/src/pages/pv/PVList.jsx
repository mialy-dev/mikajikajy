import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import PVForm from './PVForm';
import { STATUTS, TYPES_PRINCIPAUX, TYPES_AUTRES, NAVY, RED, canWrite } from './pvConfig';

const ALL_TYPES = [...TYPES_PRINCIPAUX, ...TYPES_AUTRES];

export default function PVList() {
  const { code } = useParams(); // /pv/:code (filtré par type) ou /pv/liste (tous)
  const typeCode = code && code !== 'liste' ? code : '';
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [statut, setStatut] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/pv', { params: { type: typeCode || undefined, statut: statut || undefined, q: q || undefined, page } });
      setItems(data.data);
      setTotal(data.total);
    } finally { setLoading(false); }
  }, [typeCode, statut, q, page]);

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);
  useEffect(() => { setPage(1); }, [typeCode, statut, q]);

  const title = ALL_TYPES.find((t) => t.code === typeCode)?.libelle || 'Tous les procès-verbaux';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/pv" className="text-sm text-slate-500 hover:underline">← Gestion des PV</Link>
          <h1 className="text-2xl font-bold" style={{ color: NAVY }}>{title}</h1>
        </div>
        {canWrite(user?.role) && (
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: RED }}>
            <Plus size={16} /> Nouveau PV
          </button>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher (numéro, titre, lieu)…"
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm" />
        </div>
        <select value={statut} onChange={(e) => setStatut(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">Tous les statuts</option>
          {Object.entries(STATUTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        {!typeCode && (
          <select onChange={(e) => navigate(e.target.value ? `/pv/${e.target.value}` : '/pv/liste')} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" defaultValue="">
            <option value="">Tous les types</option>
            {ALL_TYPES.map((t) => <option key={t.code} value={t.code}>{t.libelle}</option>)}
          </select>
        )}
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">N°</th><th className="px-4 py-3">Titre</th><th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Chantier</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Statut</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Chargement…</td></tr>}
            {!loading && items.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Aucun procès-verbal.</td></tr>}
            {items.map((p) => (
              <tr key={p.id} onClick={() => navigate(`/pv/voir/${p.id}`)} className="cursor-pointer border-t border-slate-100 hover:bg-[#EFF6FF]">
                <td className="px-4 py-3 font-mono text-xs">{p.numero}</td>
                <td className="px-4 py-3 font-medium">{p.titre}</td>
                <td className="px-4 py-3 text-slate-600">{p.type_libelle}</td>
                <td className="px-4 py-3 text-slate-600">{p.projet_nom || `#${p.projet_id}`}</td>
                <td className="px-4 py-3">{new Date(p.date_pv).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUTS[p.statut]?.cls}`}>{STATUTS[p.statut]?.label}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>{total} résultat(s)</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-40">Précédent</button>
          <button disabled={page * 20 >= total} onClick={() => setPage(page + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Suivant</button>
        </div>
      </div>

      {showForm && (
        <PVForm defaultType={typeCode || undefined} onClose={() => setShowForm(false)}
          onSaved={(pv) => { setShowForm(false); navigate(`/pv/voir/${pv.id}`); }} />
      )}
    </div>
  );
}
