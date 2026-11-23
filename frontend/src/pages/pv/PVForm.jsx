import { useEffect, useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import api from '../../lib/api';
import { NAVY, RED, TYPES_PRINCIPAUX, TYPES_AUTRES } from './pvConfig';
import { PVSpecificEdit } from './PVSpecific';

const ALL_TYPES = [...TYPES_PRINCIPAUX, ...TYPES_AUTRES];
const input = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#18304F] focus:outline-none';

export default function PVForm({ initial, defaultType, onClose, onSaved }) {
  const editing = !!initial?.id;
  const [projets, setProjets] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [f, setF] = useState({
    type_code: initial?.type_code || defaultType || 'reunion',
    projet_id: initial?.projet_id || '',
    titre: initial?.titre || '',
    date_pv: initial?.date_pv?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    lieu: initial?.lieu || '',
    objet: initial?.objet || '',
    observations: initial?.observations || '',
    avancement: initial?.avancement ?? '',
    participants: initial?.participants?.length ? initial.participants : [{ nom: '', fonction: '', entreprise: '' }],
    reserves: initial?.reserves || [],
    details: initial?.details || {},
  });

  useEffect(() => {
    api.get('/chantiers').then((r) => setProjets(Array.isArray(r.data) ? r.data : r.data?.data || r.data?.chantiers || [])).catch(() => {});
  }, []);

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const setRow = (key, i, patch) => set(key, f[key].map((x, j) => (j === i ? { ...x, ...patch } : x)));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!f.projet_id || !f.titre.trim()) return setError('Le chantier et le titre sont obligatoires.');
    setSaving(true);
    try {
      const body = { ...f, avancement: f.avancement === '' ? null : Number(f.avancement) };
      const r = editing ? await api.put(`/pv/${initial.id}`, body) : await api.post('/pv', body);
      onSaved(r.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement.');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <form onSubmit={submit} className="my-8 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ color: NAVY }}>{editing ? `Modifier ${initial.numero}` : 'Nouveau procès-verbal'}</h2>
          <button type="button" onClick={onClose} className="rounded p-1 hover:bg-slate-100"><X size={20} /></button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm">Type de PV
            <select className={input} value={f.type_code} disabled={editing} onChange={(e) => set('type_code', e.target.value)}>
              {ALL_TYPES.map((t) => <option key={t.code} value={t.code}>{t.libelle}</option>)}
            </select>
          </label>
          <label className="text-sm">Chantier *
            <select className={input} value={f.projet_id} onChange={(e) => set('projet_id', e.target.value)}>
              <option value="">— Choisir —</option>
              {projets.map((p) => <option key={p.id} value={p.id}>{p.nom || p.titre || p.name || p.intitule || `Chantier #${p.id}`}</option>)}
            </select>
          </label>
          <label className="text-sm md:col-span-2">Titre *
            <input className={input} value={f.titre} onChange={(e) => set('titre', e.target.value)} />
          </label>
          <label className="text-sm">Date
            <input type="date" className={input} value={f.date_pv} onChange={(e) => set('date_pv', e.target.value)} />
          </label>
          <label className="text-sm">Lieu
            <input className={input} value={f.lieu} onChange={(e) => set('lieu', e.target.value)} />
          </label>
          {f.type_code === 'avancement' && (
            <label className="text-sm">Avancement des travaux (%)
              <input type="number" min="0" max="100" className={input} value={f.avancement} onChange={(e) => set('avancement', e.target.value)} />
            </label>
          )}
          <label className="text-sm md:col-span-2">Objet
            <textarea rows={2} className={input} value={f.objet} onChange={(e) => set('objet', e.target.value)} />
          </label>
          <label className="text-sm md:col-span-2">Observations
            <textarea rows={4} className={input} value={f.observations} onChange={(e) => set('observations', e.target.value)} />
          </label>
        </div>

        <PVSpecificEdit typeCode={f.type_code} pvId={initial?.id} details={f.details} onChange={(d) => set('details', d)} />

        {f.type_code !== 'mise-en-eau' && (<>
        {/* Participants */}
        <h3 className="mt-6 font-semibold" style={{ color: NAVY }}>Participants</h3>
        {f.participants.map((p, i) => (
          <div key={i} className="mt-2 grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
            <input placeholder="Nom" className={input} value={p.nom} onChange={(e) => setRow('participants', i, { nom: e.target.value })} />
            <input placeholder="Fonction" className={input} value={p.fonction || ''} onChange={(e) => setRow('participants', i, { fonction: e.target.value })} />
            <input placeholder="Entreprise" className={input} value={p.entreprise || ''} onChange={(e) => setRow('participants', i, { entreprise: e.target.value })} />
            <button type="button" onClick={() => set('participants', f.participants.filter((_, j) => j !== i))} className="px-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
          </div>
        ))}
        <button type="button" onClick={() => set('participants', [...f.participants, { nom: '', fonction: '', entreprise: '' }])}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium" style={{ color: NAVY }}><Plus size={14} /> Ajouter un participant</button>

        </>)}

        {/* Réserves */}
        <h3 className="mt-6 font-semibold" style={{ color: NAVY }}>Réserves éventuelles</h3>
        {f.reserves.map((r, i) => (
          <div key={i} className="mt-2 grid grid-cols-[2fr_1fr_1fr_auto_auto] items-center gap-2">
            <input placeholder="Description" className={input} value={r.description} onChange={(e) => setRow('reserves', i, { description: e.target.value })} />
            <input placeholder="Responsable" className={input} value={r.responsable || ''} onChange={(e) => setRow('reserves', i, { responsable: e.target.value })} />
            <input type="date" className={input} value={r.echeance?.slice(0, 10) || ''} onChange={(e) => setRow('reserves', i, { echeance: e.target.value })} />
            <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!!r.levee} onChange={(e) => setRow('reserves', i, { levee: e.target.checked })} /> Levée</label>
            <button type="button" onClick={() => set('reserves', f.reserves.filter((_, j) => j !== i))} className="px-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
          </div>
        ))}
        <button type="button" onClick={() => set('reserves', [...f.reserves, { description: '', responsable: '', echeance: '', levee: false }])}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium" style={{ color: NAVY }}><Plus size={14} /> Ajouter une réserve</button>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Annuler</button>
          <button disabled={saving} className="rounded-lg px-5 py-2 text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundColor: RED }}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
