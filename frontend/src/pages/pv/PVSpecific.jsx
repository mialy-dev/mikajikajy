import { Plus, Trash2 } from 'lucide-react';
import { NAVY } from './pvConfig';
import { MiseEauEdit } from './PVMiseEau';

const input = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#18304F] focus:outline-none';

// Définition des sections propres à chaque type (stockées dans proces_verbaux.details)
const LISTS = {
  reunion: [
    { key: 'decisions', title: 'Décisions', addLabel: 'Ajouter une décision', empty: { texte: '' },
      fields: [{ k: 'texte', ph: 'Décision prise' }] },
    { key: 'actions', title: 'Actions à mener', addLabel: 'Ajouter une action', empty: { action: '', responsable: '', echeance: '' },
      fields: [{ k: 'action', ph: 'Action' }, { k: 'responsable', ph: 'Responsable' }, { k: 'echeance', type: 'date' }] },
  ],
  constat: [{
    key: 'anomalies', title: 'Anomalies constatées', addLabel: 'Ajouter une anomalie', empty: { description: '', localisation: '', gravite: 'mineure' },
    fields: [
      { k: 'description', ph: 'Description' }, { k: 'localisation', ph: 'Localisation' },
      { k: 'gravite', select: [['mineure', 'Mineure'], ['majeure', 'Majeure'], ['critique', 'Critique']] },
    ],
  }],
  'non-conformite': [{
    key: 'anomalies', title: 'Non-conformités', addLabel: 'Ajouter une non-conformité', empty: { description: '', localisation: '', gravite: 'majeure' },
    fields: [
      { k: 'description', ph: 'Description' }, { k: 'localisation', ph: 'Localisation' },
      { k: 'gravite', select: [['mineure', 'Mineure'], ['majeure', 'Majeure'], ['critique', 'Critique']] },
    ],
  }],
};

const RECEPTION_TYPES = [['provisoire', 'Réception provisoire'], ['definitive', 'Réception définitive'], ['avec_reserves', 'Réception avec réserves']];

export function PVSpecificEdit({ typeCode, details, onChange, pvId }) {
  if (typeCode === 'mise-en-eau') return <MiseEauEdit details={details} onChange={onChange} pvId={pvId} />;
  const set = (k, v) => onChange({ ...details, [k]: v });
  const lists = LISTS[typeCode] || [];

  return (
    <>
      {typeCode === 'reception' && (
        <label className="mt-6 block text-sm font-semibold" style={{ color: NAVY }}>Type de réception
          <select className={`${input} mt-1 font-normal`} value={details.type_reception || 'provisoire'} onChange={(e) => set('type_reception', e.target.value)}>
            {RECEPTION_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
      )}
      {typeCode === 'arret-reprise' && (
        <label className="mt-6 block text-sm font-semibold" style={{ color: NAVY }}>Nature
          <select className={`${input} mt-1 font-normal`} value={details.nature || 'arret'} onChange={(e) => set('nature', e.target.value)}>
            <option value="arret">Arrêt des travaux</option><option value="reprise">Reprise des travaux</option>
          </select>
          <input className={`${input} mt-2 font-normal`} placeholder="Motif" value={details.motif || ''} onChange={(e) => set('motif', e.target.value)} />
        </label>
      )}
      {typeCode === 'avancement' && (
        <>
          <h3 className="mt-6 font-semibold" style={{ color: NAVY }}>Travaux réalisés</h3>
          <textarea rows={3} className={`${input} mt-1`} value={details.travaux_realises || ''} onChange={(e) => set('travaux_realises', e.target.value)} />
        </>
      )}
      {typeCode === 'reunion' && (
        <label className="mt-6 block text-sm font-semibold" style={{ color: NAVY }}>Prochaine réunion
          <input type="date" className={`${input} mt-1 font-normal`} value={details.prochaine_reunion || ''} onChange={(e) => set('prochaine_reunion', e.target.value)} />
        </label>
      )}

      {lists.map((L) => {
        const rows = details[L.key] || [];
        const setRow = (i, patch) => set(L.key, rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
        return (
          <div key={L.key}>
            <h3 className="mt-6 font-semibold" style={{ color: NAVY }}>{L.title}</h3>
            {rows.map((r, i) => (
              <div key={i} className="mt-2 flex gap-2">
                {L.fields.map((f) => f.select ? (
                  <select key={f.k} className={input} value={r[f.k]} onChange={(e) => setRow(i, { [f.k]: e.target.value })}>
                    {f.select.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                ) : (
                  <input key={f.k} type={f.type || 'text'} placeholder={f.ph} className={input} value={r[f.k] || ''} onChange={(e) => setRow(i, { [f.k]: e.target.value })} />
                ))}
                <button type="button" onClick={() => set(L.key, rows.filter((_, j) => j !== i))} className="px-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={() => set(L.key, [...rows, { ...L.empty }])} className="mt-2 inline-flex items-center gap-1 text-sm font-medium" style={{ color: NAVY }}>
              <Plus size={14} /> {L.addLabel}
            </button>
          </div>
        );
      })}
    </>
  );
}

export function PVSpecificView({ typeCode, details = {} }) {
  if (typeCode === 'mise-en-eau') return null; // rendu par MiseEauPrint
  const lists = LISTS[typeCode] || [];
  const label = (L, f, v) => f.select?.find(([k]) => k === v)?.[1] || v;
  return (
    <>
      {typeCode === 'reception' && <p className="mt-5"><b>Type de réception :</b> {RECEPTION_TYPES.find(([v]) => v === details.type_reception)?.[1] || 'Réception provisoire'}</p>}
      {typeCode === 'arret-reprise' && details.nature && <p className="mt-5"><b>{details.nature === 'reprise' ? 'Reprise' : 'Arrêt'} des travaux</b>{details.motif && ` — ${details.motif}`}</p>}
      {typeCode === 'avancement' && details.travaux_realises && <><h3 className="mt-5 font-semibold">Travaux réalisés</h3><p className="whitespace-pre-wrap">{details.travaux_realises}</p></>}
      {typeCode === 'reunion' && details.prochaine_reunion && <p className="mt-5"><b>Prochaine réunion :</b> {new Date(details.prochaine_reunion).toLocaleDateString('fr-FR')}</p>}
      {lists.map((L) => (details[L.key]?.length > 0) && (
        <div key={L.key}>
          <h3 className="mt-5 font-semibold">{L.title}</h3>
          <table className="mt-1 w-full text-left"><tbody>
            {details[L.key].map((r, i) => (
              <tr key={i} className="border-t">{L.fields.map((f) => <td key={f.k} className="py-1 pr-2">{label(L, f, r[f.k]) || '—'}</td>)}</tr>
            ))}
          </tbody></table>
        </div>
      ))}
    </>
  );
}
