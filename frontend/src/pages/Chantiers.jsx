import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { CFG, COLONNES, colonneDe, lire } from '../../../Backend/src/config/chantiers';
import ChantierCard, { CarteContenu } from '../../../Backend/src/components/ChantierCard';
import Modal from '../../../Backend/src/components/ui/Modal';
import { useToast } from '../../../Backend/src/components/ui/Toast';


const liste = (d) => (Array.isArray(d) ? d : d?.projets ?? d?.data ?? []);

function Colonne({ col, items, children, onAjouter, peutAjouter }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });
  return (
    <section ref={setNodeRef} className={`ek-col ${isOver ? 'is-over' : ''}`}>
      <header style={{ borderTopColor: col.couleur }}>
        <h3>{col.titre}</h3>
        <span className="ek-count" style={{ background: col.couleur }}>{items}</span>
        {peutAjouter && <button className="ek-icon-btn" onClick={onAjouter} aria-label={`Ajouter dans ${col.titre}`}><Plus size={16} /></button>}
      </header>
      <div className="ek-col__body">{children}</div>
    </section>
  );
}

export default function Chantiers() {
  const outletContext = useOutletContext() ?? {};
  const recherche = outletContext.recherche ?? "";
  const { peut } = useAuth();
  const toast = useToast();
  const [data, setData] = useState([]);
  const [etat, setEtat] = useState('chargement'); // chargement | ok | erreur
  const [actif, setActif] = useState(null);
  const [creer, setCreer] = useState(null);       // id de la colonne cible
  const [aSupprimer, setASupprimer] = useState(null);
  const [client, setClient] = useState('');
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } })
  );
  const editeur = peut('superadmin', 'editeur');

  const charger = useCallback(() => {
    setEtat('chargement');
    api.get(CFG.routeListe).then((r) => { setData(liste(r.data)); setEtat('ok'); }).catch(() => setEtat('erreur'));
  }, []);
  useEffect(() => { charger(); }, [charger]);

  const clients = useMemo(() => [...new Set(data.map((p) => lire(p).client).filter(Boolean))].sort(), [data]);
  const filtres = useMemo(() => data.filter((p) => {
    const c = lire(p);
    return (!recherche || c.nom.toLowerCase().includes(recherche.toLowerCase())) && (!client || c.client === client);
  }), [data, recherche, client]);
  const parCol = (id) => filtres.filter((p) => colonneDe(p[CFG.champStatut]) === id);

  async function onDragEnd({ active, over }) {
    setActif(null);
    if (!over || !editeur) return;
    const p = data.find((x) => x.id === active.id);
    if (!p || colonneDe(p[CFG.champStatut]) === over.id) return;
    const ancien = p[CFG.champStatut];
    setData((l) => l.map((x) => (x.id === p.id ? { ...x, [CFG.champStatut]: over.id } : x))); // affichage immédiat
    try {
      await api.patch(CFG.routeStatut(p.id), { [CFG.champStatut]: over.id });
      toast(`« ${lire(p).nom} » déplacé vers ${COLONNES.find((c) => c.id === over.id).titre}`);
    } catch {
      setData((l) => l.map((x) => (x.id === p.id ? { ...x, [CFG.champStatut]: ancien } : x))); // restauration
      toast('Échec de la sauvegarde : le chantier est revenu à sa place', 'err');
    }
  }

  async function confirmerSuppression() {
    const p = aSupprimer; setASupprimer(null);
    try {
      await api.delete(CFG.routeItem(p.id));
      setData((l) => l.filter((x) => x.id !== p.id));
      toast('Chantier supprimé');
    } catch (e) { toast(e.response?.data?.error ?? 'Suppression impossible', 'err'); }
  }

  async function soumettre(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    if (!f.nom.trim()) return toast('Le nom est obligatoire', 'err');
    try {
      const { data: cree } = await api.post(CFG.routeListe, { ...f, [CFG.champStatut]: creer });
      setData((l) => [{ ...cree, [CFG.champStatut]: cree?.[CFG.champStatut] ?? creer }, ...l]);
      setCreer(null); toast('Chantier créé');
    } catch (err) { toast(err.response?.data?.error ?? 'Création impossible', 'err'); }
  }

  if (etat === 'chargement') return <div className="ek-center">Chargement des chantiers…</div>;
  if (etat === 'erreur') return <div className="ek-center">Impossible de charger les chantiers. <button className="ek-btn" onClick={charger}>Réessayer</button></div>;

  return (
    <div className="ek-page">
      <div className="ek-toolbar">
        <h2>Chantiers <small>{data.length}</small></h2>
        <select value={client} onChange={(e) => setClient(e.target.value)} aria-label="Filtrer par client">
          <option value="">Tous les clients</option>
          {clients.map((c) => <option key={c}>{c}</option>)}
        </select>
        {editeur && <button className="ek-btn ek-btn--primary" onClick={() => setCreer('nouveau')}><Plus size={16} /> Nouveau chantier</button>}
      </div>
      {data.length === 0 && <div className="ek-empty">Aucun chantier pour le moment.{editeur && ' Créez le premier pour démarrer.'}</div>}

      <DndContext sensors={sensors} onDragStart={(e) => setActif(data.find((x) => x.id === e.active.id))} onDragEnd={onDragEnd} onDragCancel={() => setActif(null)}>
        <div className="ek-board">
          {COLONNES.map((col) => {
            const items = parCol(col.id);
            return (
              <Colonne key={col.id} col={col} items={items.length} peutAjouter={editeur} onAjouter={() => setCreer(col.id)}>
                {items.map((p) => <ChantierCard key={p.id} p={p} couleur={col.couleur} peutSupprimer={editeur} onSupprimer={setASupprimer} />)}
              </Colonne>
            );
          })}
        </div>
        <DragOverlay>
          {actif && <article className="ek-card ek-card--overlay"><CarteContenu p={actif} couleur="var(--ek-primary)" /></article>}
        </DragOverlay>
      </DndContext>

      {creer && (
        <Modal titre="Nouveau chantier" onClose={() => setCreer(null)}>
          <form onSubmit={soumettre} className="ek-form">
            <label>Nom du chantier *<input name="nom" required autoFocus /></label>
            <label>Client<input name="client" /></label>
            <label>Adresse<input name="adresse" /></label>
            <div className="ek-actions">
              <button type="button" className="ek-btn" onClick={() => setCreer(null)}>Annuler</button>
              <button className="ek-btn ek-btn--primary">Créer</button>
            </div>
          </form>
        </Modal>
      )}
      {aSupprimer && (
        <Modal titre="Confirmer la suppression" onClose={() => setASupprimer(null)}>
          <p>Supprimer « {lire(aSupprimer).nom} » ? Cette action peut échouer si des constats y sont rattachés.</p>
          <div className="ek-actions">
            <button className="ek-btn" onClick={() => setASupprimer(null)}>Annuler</button>
            <button className="ek-btn ek-btn--danger" onClick={confirmerSuppression}>Supprimer</button>
          </div>
        </Modal>
      )}
    </div>
  );
}