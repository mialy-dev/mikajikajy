import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { api } from '../../lib/api';
import { NAVY, RED } from './pvConfig';

const input = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#18304F] focus:outline-none';
const DEFAULT_NOTES = "La MOE nommera un représentant pour assister aux essais\nLa SHLMR est représenté par le Chargé de travaux";
const DEFAULT_ESSAI =
  "Mise en eau de la toiture-terrasse pendant 48h avec de l'eau colorée avec au moins 5 cm de hauteur d'eau au-dessus du point le plus haut de l'évacuation.";

const newEssai = () => ({ niveau: '', essai_realise: DEFAULT_ESSAI, debut: '', fin: '', pente: '', infiltrations: false, infiltrations_par: '', plan: null, annotations: [] });
const newAnnot = () => ({ lot: '', remarque: '', statut: 'conforme', photos: [] });

const fmtDT = (v) => (v ? new Date(v).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '');
const fmtD = (v) => (v ? new Date(v).toLocaleDateString('fr-FR') : '');

/* ---------- image protégée (chargée via l'API avec le cookie) ---------- */
export function DocImage({ id, className = '' }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    let url;
    api.get(`/pv/documents/${id}/download`, { responseType: 'blob' })
      .then((r) => { url = URL.createObjectURL(r.data); setSrc(url); }).catch(() => {});
    return () => url && URL.revokeObjectURL(url);
  }, [id]);
  return src ? <img src={src} alt="" className={className} /> : <div className={`animate-pulse bg-slate-100 ${className}`} style={{ minHeight: 60 }} />;
}

async function uploadFiles(pvId, files) {
  const fd = new FormData();
  [...files].forEach((f) => fd.append('fichiers', f));
  const r = await api.post(`/pv/${pvId}/fichiers`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return r.data; // [{ id, nom, ... }]
}

function UploadButton({ pvId, multiple, label, onDone }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  if (!pvId) return <span className="text-xs text-slate-400">Enregistrez le PV d'abord pour ajouter des photos.</span>;
  return (
    <>
      <input ref={ref} type="file" multiple={multiple} accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={async (e) => {
          if (!e.target.files.length) return;
          setBusy(true); setErr('');
          try { onDone(await uploadFiles(pvId, e.target.files)); } catch (x) { setErr(x.response?.data?.message || 'Envoi impossible'); }
          finally { setBusy(false); e.target.value = ''; }
        }} />
      <button type="button" disabled={busy} onClick={() => ref.current.click()} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2 py-1 text-xs disabled:opacity-50">
        <Upload size={12} /> {busy ? 'Envoi…' : label}
      </button>
      {err && <span className="ml-2 text-xs text-red-600">{err}</span>}
    </>
  );
}

/* =====================================================================
   FORMULAIRE
   ===================================================================== */
export function MiseEauEdit({ details, onChange, pvId }) {
  const set = (k, v) => onChange({ ...details, [k]: v });
  const essais = details.essais || [];
  const setEssai = (i, patch) => set('essais', essais.map((e, j) => (j === i ? { ...e, ...patch } : e)));
  const setAnnot = (i, a, patch) => setEssai(i, { annotations: essais[i].annotations.map((x, k) => (k === a ? { ...x, ...patch } : x)) });

  const presents = (key, title) => {
    const rows = details[key] || [{ nom: '' }];
    return (
      <div className="mt-4">
        <h4 className="text-sm font-semibold">{title}</h4>
        {rows.map((r, i) => (
          <div key={i} className="mt-1 flex gap-2">
            <input className={input} placeholder="Nom / Prénom / Organisme (ex. ETC Kevin NATIVEL)" value={r.nom}
              onChange={(e) => set(key, rows.map((x, j) => (j === i ? { nom: e.target.value } : x)))} />
            <button type="button" onClick={() => set(key, rows.filter((_, j) => j !== i))} className="px-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
          </div>
        ))}
        <button type="button" onClick={() => set(key, [...rows, { nom: '' }])} className="mt-1 inline-flex items-center gap-1 text-sm font-medium" style={{ color: NAVY }}><Plus size={14} /> Ajouter une personne</button>
      </div>
    );
  };

  return (
    <div className="mt-6 rounded-xl border-2 border-dashed border-slate-300 p-4">
      <h3 className="text-base font-bold" style={{ color: NAVY }}>PV de mise en eau — informations</h3>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className="text-sm">Nom de l'opération
          <input className={input} value={details.operation || ''} onChange={(e) => set('operation', e.target.value)} placeholder="LACOUTURE" /></label>
        <label className="text-sm">Entreprise titulaire du lot
          <input className={input} value={details.entreprise_lot || ''} onChange={(e) => set('entreprise_lot', e.target.value)} placeholder="ÉTANCHÉITÉ" /></label>
        <label className="text-sm">Bâtiment (sous-titre)
          <input className={input} value={details.batiment || ''} onChange={(e) => set('batiment', e.target.value)} placeholder="Bâtiment A (R+1)" /></label>
        <label className="text-sm">Maître d'ouvrage (en haut à droite)
          <input className={input} value={details.maitre_ouvrage || ''} onChange={(e) => set('maitre_ouvrage', e.target.value)} placeholder="SEMAC" /></label>
      </div>

      {presents('presents_debut', 'Personnes présentes lors de la mise en eau')}
      {presents('presents_fin', 'Personnes présentes lors de la fin de la mise en eau')}
      <label className="mt-3 block text-sm">Notes sous les tableaux de présence
        <textarea rows={2} className={input} value={details.notes_presence ?? DEFAULT_NOTES} onChange={(e) => set('notes_presence', e.target.value)} /></label>

      {/* ESSAIS */}
      {essais.map((e, i) => (
        <div key={i} className="mt-6 rounded-xl border border-slate-300 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold" style={{ color: NAVY }}>ESSAI {i + 1}</h4>
            <button type="button" onClick={() => set('essais', essais.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
          </div>
          <label className="mt-2 block text-sm">Bâtiment / niveau
            <input className={input} value={e.niveau} onChange={(x) => setEssai(i, { niveau: x.target.value })} placeholder="Bâtiment A — R+1" /></label>
          <label className="mt-2 block text-sm">Essai réalisé
            <textarea rows={3} className={input} value={e.essai_realise} onChange={(x) => setEssai(i, { essai_realise: x.target.value })} /></label>
          <div className="mt-2 grid gap-3 md:grid-cols-3">
            <label className="text-sm">Date et heure de mise en eau
              <input type="datetime-local" className={input} value={e.debut} onChange={(x) => setEssai(i, { debut: x.target.value })} /></label>
            <label className="text-sm">Date et heure de fin de l'essai
              <input type="datetime-local" className={input} value={e.fin} onChange={(x) => setEssai(i, { fin: x.target.value })} /></label>
            <label className="text-sm">Pente mesurée vers les évacuations (%)
              <input type="number" step="0.1" className={input} value={e.pente} onChange={(x) => setEssai(i, { pente: x.target.value })} /></label>
          </div>

          <fieldset className="mt-3 text-sm">
            <legend className="font-semibold">Constats</legend>
            <label className="mt-1 flex items-center gap-2"><input type="radio" checked={!e.infiltrations} onChange={() => setEssai(i, { infiltrations: false })} /> Pas d'infiltrations</label>
            <label className="mt-1 flex items-center gap-2"><input type="radio" checked={e.infiltrations} onChange={() => setEssai(i, { infiltrations: true })} /> Infiltrations et/ou fuites par :</label>
            {e.infiltrations && <textarea rows={2} className={`${input} mt-1`} value={e.infiltrations_par} onChange={(x) => setEssai(i, { infiltrations_par: x.target.value })} />}
          </fieldset>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold">Plan annoté :</span>
            <UploadButton pvId={pvId} label={e.plan ? 'Remplacer le plan' : 'Ajouter le plan'} onDone={(d) => setEssai(i, { plan: d[0].id })} />
            {e.plan && <DocImage id={e.plan} className="h-12 rounded border" />}
          </div>

          <h5 className="mt-4 text-sm font-semibold">Annotations (photos et remarques)</h5>
          {e.annotations.map((a, k) => (
            <div key={k} className="mt-2 rounded-lg border border-slate-200 bg-white p-3">
              <div className="grid gap-2 md:grid-cols-[2rem_1fr_2fr_9rem_auto]">
                <span className="mt-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: RED }}>{k + 1}</span>
                <input className={input} placeholder="Lot (ex. Toiture-terrasse accessible)" value={a.lot} onChange={(x) => setAnnot(i, k, { lot: x.target.value })} />
                <input className={input} placeholder="Remarque" value={a.remarque} onChange={(x) => setAnnot(i, k, { remarque: x.target.value })} />
                <select className={input} value={a.statut} onChange={(x) => setAnnot(i, k, { statut: x.target.value })}>
                  <option value="conforme">Conforme</option><option value="non_conforme">Non conforme</option>
                </select>
                <button type="button" onClick={() => setEssai(i, { annotations: e.annotations.filter((_, j) => j !== k) })} className="px-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {a.photos.map((p) => (
                  <div key={p} className="relative">
                    <DocImage id={p} className="h-16 w-20 rounded object-cover" />
                    <button type="button" onClick={() => setAnnot(i, k, { photos: a.photos.filter((x) => x !== p) })} className="absolute right-0 top-0 rounded bg-white/90 p-0.5 text-red-600"><Trash2 size={12} /></button>
                  </div>
                ))}
                <UploadButton pvId={pvId} multiple label="Ajouter des photos" onDone={(d) => setAnnot(i, k, { photos: [...a.photos, ...d.map((x) => x.id)] })} />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setEssai(i, { annotations: [...e.annotations, newAnnot()] })} className="mt-2 inline-flex items-center gap-1 text-sm font-medium" style={{ color: NAVY }}><Plus size={14} /> Ajouter une annotation</button>
        </div>
      ))}
      <button type="button" onClick={() => set('essais', [...essais, newEssai()])} className="mt-4 inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-white" style={{ backgroundColor: NAVY }}>
        <Plus size={14} /> Ajouter un essai
      </button>
    </div>
  );
}

/* =====================================================================
   MISE EN PAGE IMPRIMABLE (reproduit le modèle PLAN DE CONTRÔLE)
   ===================================================================== */
function PageHeader({ pv }) {
  const d = pv.details || {};
  const sub = [d.operation || pv.projet?.nom, d.batiment].filter(Boolean).join(' — ');
  return (
    <div className="pv-header mb-4 border border-[#1e3a5f]">
      <div className="bg-[#1e3a5f] py-1 text-center text-[11px] font-bold tracking-widest text-white">PLAN DE CONTRÔLE</div>
      <div className="grid grid-cols-[130px_1fr_150px] items-center">
        <div className="flex h-16 items-center justify-center border-r border-[#1e3a5f] px-2">
          <img src="/logo-pv.png" alt="" className="max-h-12" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'block'; }} />
          <span style={{ display: 'none', color: RED }} className="text-lg font-extrabold">E-KAJY</span>
        </div>
        <div className="px-4">
          <div className="text-base font-bold text-slate-800">{pv.titre}</div>
          <div className="text-xs text-slate-500">{sub}</div>
        </div>
        <div className="px-3 text-right text-xs text-slate-600">
          <div className="font-medium">{d.maitre_ouvrage}</div>
          <div>{fmtD(pv.date_pv)}</div>
        </div>
      </div>
    </div>
  );
}

function PresentsTable({ rows }) {
  const list = rows?.length ? rows : [{ nom: '' }];
  return (
    <table className="w-full border-collapse text-sm">
      <thead><tr className="bg-[#dbe3f1] text-[#1e3a5f]"><th className="border border-slate-300 p-2">Nom / Prénom / Organisme</th><th className="w-1/4 border border-slate-300 p-2">Visa</th></tr></thead>
      <tbody>{list.map((r, i) => <tr key={i}><td className="border border-slate-300 p-3">{r.nom}</td><td className="border border-slate-300" /></tr>)}</tbody>
    </table>
  );
}

function SignatureBoxes({ signatures = [] }) {
  const pick = (re) => signatures.filter((s) => re.test(`${s.fonction || ''}`.toLowerCase()));
  const box = (label, list) => (
    <div className="h-28 rounded-lg border border-slate-300 p-2">
      <div className="text-xs font-bold text-[#1e3a5f]">{label}</div>
      <div className="flex gap-2">{list.map((s) => (s.signature ? <img key={s.id} src={s.signature} alt="" className="h-14" /> : <span key={s.id} className="text-xs">{s.nom}</span>))}</div>
    </div>
  );
  return (
    <div className="mt-6 border-t-2 border-[#1e3a5f] pt-3">
      <div className="mb-2 text-xs font-bold tracking-wide text-[#1e3a5f]">SIGNATURES</div>
      <div className="grid grid-cols-2 gap-4">{box('Entreprise', pick(/entreprise|etanch|étanch/))}{box("Maître d'œuvre", pick(/ma[iî]tre|moe|œuvre/))}</div>
    </div>
  );
}

export function MiseEauPrint({ pv }) {
  const d = pv.details || {};
  const essais = d.essais || [];
  return (
    <div className="mx-auto max-w-[210mm] bg-white p-6 text-sm text-slate-800 shadow-sm print:shadow-none">
      {/* Page 1 : opération + présents */}
      <section className="pv-page">
        <PageHeader pv={pv} />
        <p className="mt-6 text-base"><b>Nom de l'opération :</b> {d.operation || pv.projet?.nom}</p>
        <p className="mt-2 text-base"><b>Entreprise titulaire du lot :</b> {d.entreprise_lot}</p>

        <h3 className="mb-2 mt-6 font-bold text-[#1e3a5f]">Personnes présentes lors de la mise en eau :</h3>
        <PresentsTable rows={d.presents_debut} />
        <p className="mt-1 whitespace-pre-line text-xs italic text-slate-500">{d.notes_presence ?? DEFAULT_NOTES}</p>

        <h3 className="mb-2 mt-6 font-bold text-[#1e3a5f]">Personnes présentes lors de la fin de la mise en eau :</h3>
        <PresentsTable rows={d.presents_fin} />
        <p className="mt-1 whitespace-pre-line text-xs italic text-slate-500">{d.notes_presence ?? DEFAULT_NOTES}</p>
      </section>

      {essais.map((e, i) => (
        <div key={i}>
          {/* Page essai */}
          <section className="pv-page">
            <PageHeader pv={pv} />
            <div className="border border-slate-300 bg-slate-100 py-2 text-center font-bold tracking-wide text-[#1e3a5f]">ESSAI {i + 1}</div>
            <p className="mt-4">{e.niveau}</p>
            <p className="mt-1 font-bold">Essai réalisé :</p>
            <p className="mt-2">{e.essai_realise}</p>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1">
              <b>Date et heure de mise en eau :</b><span className="border-b border-slate-400">{fmtDT(e.debut)}</span>
              <b>Date et heure de fin de l'essai :</b><span className="border-b border-slate-400">{fmtDT(e.fin)}</span>
            </div>
            <p className="mt-4"><b>Pente mesurée</b> <i>(vers les évacuations)</i> : <span className="border-b border-slate-400 px-4">{e.pente}</span> %</p>
            <p className="mt-3 font-bold">Constats :</p>
            <p className="mt-1">{e.infiltrations ? '☐' : '☒'} Pas d'infiltrations</p>
            <p className="mt-1">{e.infiltrations ? '☒' : '☐'} <b>Infiltrations et/ou fuites par :</b></p>
            <p className="ml-6 min-h-[2rem] border-b border-slate-400">{e.infiltrations ? e.infiltrations_par : ''}</p>
            {e.annotations.length > 0 && <p className="mt-3 text-right" style={{ color: RED }}>Photos et constats ci-dessous</p>}
            <SignatureBoxes signatures={pv.signatures} />
          </section>

          {/* Page annotations */}
          {e.annotations.length > 0 && (
            <section className="pv-page">
              <PageHeader pv={pv} />
              <div className="flex items-center justify-between rounded border border-slate-300 bg-[#dbe3f1] px-4 py-3 text-[#1e3a5f]">
                <span>{e.niveau}</span>
                <span className="rounded-full border bg-white px-3 py-0.5 text-xs">{e.annotations.length} annotation(s)</span>
              </div>
              {e.plan && <DocImage id={e.plan} className="mx-auto mt-4 max-h-[110mm] border" />}
              <h3 className="mb-2 mt-5 border-b-2 border-[#1e3a5f] pb-1 text-xs font-bold tracking-wide text-[#1e3a5f]">DÉTAIL DES ANNOTATIONS</h3>
              <table className="w-full border-collapse text-sm">
                <thead><tr className="bg-[#dbe3f1] text-xs text-[#1e3a5f]">
                  <th className="w-10 border border-slate-300 p-2">N°</th><th className="border border-slate-300 p-2">LOT</th><th className="border border-slate-300 p-2">REMARQUE</th>
                  <th className="w-24 border border-slate-300 p-2">STATUT</th><th className="w-1/3 border border-slate-300 p-2">PHOTO</th></tr></thead>
                <tbody>
                  {e.annotations.map((a, k) => (
                    <tr key={k} style={{ breakInside: 'avoid' }}>
                      <td className="border border-slate-300 p-2 text-center align-top"><span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: RED }}>{k + 1}</span></td>
                      <td className="border border-slate-300 p-2 align-top">{a.lot}</td>
                      <td className="border border-slate-300 p-2 align-top">{a.remarque}</td>
                      <td className="border border-slate-300 p-2 text-center align-top font-semibold" style={{ color: a.statut === 'conforme' ? '#16a34a' : RED }}>{a.statut === 'conforme' ? 'conforme' : 'non conforme'}</td>
                      <td className="border border-slate-300 p-2 align-top"><div className="space-y-2">{a.photos.map((p) => <DocImage key={p} id={p} className="w-full rounded border" />)}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      ))}
    </div>
  );
}
