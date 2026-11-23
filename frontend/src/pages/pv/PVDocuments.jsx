import { useEffect, useRef, useState } from 'react';
import { FileText, Trash2, Upload } from 'lucide-react';
import { api } from '../../lib/api';
import { NAVY } from './pvConfig';

// Miniature d'une photo : on récupère le fichier via l'API (cookie d'authentification) puis on l'affiche en blob
function Photo({ doc }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    let url;
    api.get(`/pv/documents/${doc.id}/download`, { responseType: 'blob' })
      .then((r) => { url = URL.createObjectURL(r.data); setSrc(url); }).catch(() => {});
    return () => url && URL.revokeObjectURL(url);
  }, [doc.id]);
  return src ? <img src={src} alt={doc.nom} className="h-28 w-full rounded-lg object-cover" /> : <div className="h-28 animate-pulse rounded-lg bg-slate-100" />;
}

export default function PVDocuments({ pvId, documents, canEdit, onChange, onError }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const upload = async (e) => {
    const files = [...e.target.files];
    if (!files.length) return;
    const fd = new FormData();
    files.forEach((f) => fd.append('fichiers', f));
    setBusy(true);
    try { await api.post(`/pv/${pvId}/fichiers`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }); onChange(); }
    catch (err) { onError(err.response?.data?.message || 'Envoi impossible'); }
    finally { setBusy(false); e.target.value = ''; }
  };

  const download = async (d) => {
    const r = await api.get(`/pv/documents/${d.id}/download`, { responseType: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(r.data); a.download = d.nom; a.click();
    URL.revokeObjectURL(a.href);
  };

  const remove = async (d) => {
    if (!window.confirm(`Supprimer « ${d.nom} » ?`)) return;
    try { await api.delete(`/pv/documents/${d.id}`); onChange(); }
    catch (err) { onError(err.response?.data?.message || 'Suppression impossible'); }
  };

  const photos = documents.filter((d) => d.type === 'photo');
  const others = documents.filter((d) => d.type !== 'photo');

  return (
    <section className="mt-6 rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold" style={{ color: NAVY }}>Photos et documents</h3>
        {canEdit && (
          <>
            <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={upload} />
            <button onClick={() => inputRef.current.click()} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50">
              <Upload size={16} /> {busy ? 'Envoi…' : 'Ajouter'}
            </button>
          </>
        )}
      </div>
      {documents.length === 0 && <p className="mt-3 text-sm text-slate-400">Aucun fichier.</p>}

      {photos.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((d) => (
            <div key={d.id} className="relative">
              <Photo doc={d} />
              {canEdit && <button onClick={() => remove(d)} className="absolute right-1 top-1 rounded bg-white/90 p-1 text-red-600"><Trash2 size={14} /></button>}
            </div>
          ))}
        </div>
      )}

      <ul className="mt-3 space-y-1 text-sm">
        {others.map((d) => (
          <li key={d.id} className="flex items-center justify-between rounded border border-slate-100 px-3 py-2">
            <button onClick={() => download(d)} className="inline-flex items-center gap-2 hover:underline"><FileText size={16} /> {d.nom}</button>
            {canEdit && <button onClick={() => remove(d)} className="text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>}
          </li>
        ))}
      </ul>
    </section>
  );
}
