import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Download, Pencil, Printer, Trash2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import PVForm from './PVForm';
import PVDocuments from './PVDocuments';
import { MiseEauPrint } from './PVMiseEau';
import './pv-print.css';
import { PVSpecificView } from './PVSpecific';
import { STATUTS, NAVY, RED, canWrite, canReview, normRole } from './pvConfig';

// Actions de workflow par statut courant (le backend revérifie les droits)
const ACTIONS = {
  brouillon:       [{ to: 'soumis', label: 'Soumettre', review: false }],
  soumis:          [{ to: 'en_verification', label: 'Prendre en vérification', review: true }, { to: 'brouillon', label: 'Renvoyer en brouillon', review: true }],
  en_verification: [{ to: 'valide', label: 'Valider', review: true }, { to: 'rejete', label: 'Rejeter', review: true, danger: true }],
  valide:          [{ to: 'signe', label: 'Marquer comme signé', review: true }],
  rejete:          [{ to: 'brouillon', label: 'Repasser en brouillon', review: false }],
  signe:           [{ to: 'archive', label: 'Archiver', superadmin: true }],
  archive:         [],
};

function SignaturePad({ onChange }) {
  const ref = useRef(null);
  const drawing = useRef(false);
  const pos = (e) => {
    const r = ref.current.getBoundingClientRect();
    const t = e.touches?.[0] || e;
    return [t.clientX - r.left, t.clientY - r.top];
  };
  const start = (e) => { drawing.current = true; const c = ref.current.getContext('2d'); c.beginPath(); c.moveTo(...pos(e)); };
  const move = (e) => { if (!drawing.current) return; const c = ref.current.getContext('2d'); c.lineWidth = 2; c.lineCap = 'round'; c.lineTo(...pos(e)); c.stroke(); };
  const end = () => { if (drawing.current) { drawing.current = false; onChange(ref.current.toDataURL('image/png')); } };
  const clear = () => { ref.current.getContext('2d').clearRect(0, 0, 400, 120); onChange(null); };
  return (
    <div>
      <canvas ref={ref} width={400} height={120} className="w-full max-w-[400px] touch-none rounded-lg border border-dashed border-slate-400 bg-white"
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end} />
      <button type="button" onClick={clear} className="mt-1 text-xs text-slate-500 underline">Effacer</button>
    </div>
  );
}

export default function PVDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const printRef = useRef(null);
  const [pv, setPv] = useState(null);
  const [error, setError] = useState('');
  const [edit, setEdit] = useState(false);
  const [sig, setSig] = useState({ nom: '', fonction: '', signature: null });

  const role = normRole(user?.role);
  const load = useCallback(() => api.get(`/pv/${id}`).then((r) => setPv(r.data)).catch((e) => setError(e.response?.data?.message || 'PV introuvable')), [id]);
  useEffect(() => { load(); }, [load]);

  const changeStatut = async (to) => {
    let commentaire;
    if (to === 'rejete') { commentaire = window.prompt('Motif du rejet (obligatoire) :'); if (!commentaire) return; }
    try { await api.post(`/pv/${id}/statut`, { statut: to, commentaire }); setError(''); load(); }
    catch (e) { setError(e.response?.data?.message || 'Action impossible'); }
  };

  const addSig = async () => {
    try { await api.post(`/pv/${id}/signatures`, sig); setSig({ nom: '', fonction: '', signature: null }); setError(''); load(); }
    catch (e) { setError(e.response?.data?.message || 'Signature impossible'); }
  };

  const remove = async () => {
    if (!window.confirm('Supprimer ce PV ?')) return;
    try { await api.delete(`/pv/${id}`); navigate('/pv/liste'); } catch (e) { setError(e.response?.data?.message || 'Suppression impossible'); }
  };

  const downloadPdf = () =>
    html2pdf().set({ margin: 10, filename: `${pv.numero}.pdf`, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4' }, pagebreak: { mode: ['css'] } })
      .from(printRef.current).save();

  if (error && !pv) return <p className="p-8 text-center text-red-600">{error}</p>;
  if (!pv) return <p className="p-8 text-center text-slate-400">Chargement…</p>;

  const actions = (ACTIONS[pv.statut] || []).filter((a) => (a.superadmin ? role === 'superadmin' : a.review ? canReview(role) : canWrite(role)));
  const editable = ['brouillon', 'rejete'].includes(pv.statut) && canWrite(role);
  const fmt = (d) => (d ? new Date(d).toLocaleDateString('fr-FR') : '—');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link to={`/pv/${pv.type_code}`} className="text-sm text-slate-500 hover:underline">← {pv.type_libelle}</Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-slate-500">{pv.numero}</p>
          <h1 className="text-2xl font-bold" style={{ color: NAVY }}>{pv.titre}</h1>
          <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${STATUTS[pv.statut].cls}`}>{STATUTS[pv.statut].label}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"><Printer size={16} /> Imprimer</button>
          <button onClick={downloadPdf} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"><Download size={16} /> PDF</button>
          {editable && <button onClick={() => setEdit(true)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"><Pencil size={16} /> Modifier</button>}
          {editable && canReview(role) && <button onClick={remove} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"><Trash2 size={16} /> Supprimer</button>}
        </div>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {actions.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 rounded-xl bg-[#EFF6FF] p-4">
          {actions.map((a) => (
            <button key={a.to} onClick={() => changeStatut(a.to)} className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: a.danger ? RED : NAVY }}>{a.label}</button>
          ))}
        </div>
      )}

      {/* Contenu imprimable (sert aussi au PDF) */}
      {pv.type_code === 'mise-en-eau' ? (
        <div ref={printRef} id="pv-print" className="mt-6"><MiseEauPrint pv={pv} /></div>
      ) : (
      <div ref={printRef} id="pv-print" className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-sm">
        <div className="border-b pb-3 text-center">
          <h2 className="text-lg font-bold uppercase" style={{ color: NAVY }}>{pv.type_libelle}</h2>
          <p className="font-mono text-xs">{pv.numero}</p>
        </div>
        <dl className="mt-4 grid gap-2 sm:grid-cols-2">
          <div><dt className="text-slate-500">Chantier</dt><dd className="font-medium">{pv.projet?.nom || pv.projet?.titre || pv.projet?.intitule || `#${pv.projet_id}`}</dd></div>
          <div><dt className="text-slate-500">Date</dt><dd className="font-medium">{fmt(pv.date_pv)}</dd></div>
          <div><dt className="text-slate-500">Lieu</dt><dd className="font-medium">{pv.lieu || '—'}</dd></div>
          {pv.avancement != null && <div><dt className="text-slate-500">Avancement</dt><dd className="font-medium">{pv.avancement} %</dd></div>}
        </dl>
        {pv.objet && <><h3 className="mt-5 font-semibold">Objet</h3><p className="whitespace-pre-wrap">{pv.objet}</p></>}

        <PVSpecificView typeCode={pv.type_code} details={pv.details} />

        <h3 className="mt-5 font-semibold">Participants</h3>
        {pv.participants.length === 0 ? <p className="text-slate-400">Aucun participant.</p> : (
          <table className="mt-1 w-full text-left"><tbody>
            {pv.participants.map((p) => <tr key={p.id} className="border-t"><td className="py-1">{p.nom}</td><td>{p.fonction}</td><td>{p.entreprise}</td></tr>)}
          </tbody></table>
        )}

        <h3 className="mt-5 font-semibold">Observations</h3>
        <p className="whitespace-pre-wrap">{pv.observations || '—'}</p>

        <h3 className="mt-5 font-semibold">Réserves</h3>
        {pv.reserves.length === 0 ? <p className="text-slate-400">Aucune réserve.</p> : (
          <ul className="list-disc pl-5">
            {pv.reserves.map((r) => <li key={r.id}>{r.description} {r.responsable && `— ${r.responsable}`} {r.echeance && `(échéance ${fmt(r.echeance)})`} {r.levee && <b className="text-emerald-600">[levée]</b>}</li>)}
          </ul>
        )}

        <h3 className="mt-5 font-semibold">Signatures</h3>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          {pv.signatures.length === 0 && <p className="text-slate-400">Aucune signature.</p>}
          {pv.signatures.map((s) => (
            <div key={s.id} className="rounded border p-2 text-center">
              {s.signature && <img src={s.signature} alt="" className="mx-auto h-16" />}
              <p className="font-medium">{s.nom}</p><p className="text-xs text-slate-500">{s.fonction} · {fmt(s.signe_le)}</p>
            </div>
          ))}
        </div>
      </div>
      )}

      <PVDocuments pvId={pv.id} documents={pv.documents} canEdit={canWrite(role) && pv.statut !== 'archive'} onChange={load} onError={setError} />

      {/* Ajout de signature */}
      {['valide', 'signe'].includes(pv.statut) && canWrite(role) && (
        <div className="mt-6 rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold" style={{ color: NAVY }}>Ajouter une signature</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input placeholder="Nom du signataire" value={sig.nom} onChange={(e) => setSig({ ...sig, nom: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input placeholder="Fonction" value={sig.fonction} onChange={(e) => setSig({ ...sig, fonction: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div className="mt-3"><SignaturePad onChange={(s) => setSig((p) => ({ ...p, signature: s }))} /></div>
          <button onClick={addSig} disabled={!sig.nom.trim()} className="mt-3 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" style={{ backgroundColor: NAVY }}>Signer</button>
        </div>
      )}

      {/* Validations + historique */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold" style={{ color: NAVY }}>Validations</h3>
          {pv.validations.length === 0 && <p className="mt-2 text-sm text-slate-400">Aucune décision.</p>}
          <ul className="mt-2 space-y-2 text-sm">
            {pv.validations.map((v) => <li key={v.id}><b>{STATUTS[v.decision]?.label}</b> par {v.valideur} — {fmt(v.created_at)}{v.commentaire && <span className="block text-slate-500">{v.commentaire}</span>}</li>)}
          </ul>
        </section>
        <section className="rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold" style={{ color: NAVY }}>Historique des modifications</h3>
          <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto text-sm">
            {pv.historique.map((h) => (
              <li key={h.id}><span className="text-slate-500">{new Date(h.created_at).toLocaleString('fr-FR')}</span> — {h.auteur} : <b>{h.action}</b>
                {h.details?.vers && <> ({STATUTS[h.details.de]?.label} → {STATUTS[h.details.vers]?.label})</>}</li>
            ))}
          </ul>
        </section>
      </div>

      {edit && <PVForm initial={pv} onClose={() => setEdit(false)} onSaved={() => { setEdit(false); load(); }} />}
    </div>
  );
}
