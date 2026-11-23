import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Calendar, MapPin, MoreVertical, Trash2, User } from 'lucide-react';
import { lire } from '../config/chantiers';

export function CarteContenu({ p, couleur }) {
  const c = lire(p);
  return (
    <>
      <span className="ek-card__bar" style={{ background: couleur }} />
      <h4>{c.nom}</h4>
      {c.client && <p><User size={14} />{c.client}</p>}
      {c.responsable && <p className="ek-muted">Resp. {c.responsable}</p>}
      {c.adresse && <p><MapPin size={14} />{c.adresse}</p>}
      {c.date && <p className="ek-muted"><Calendar size={14} />{new Date(c.date).toLocaleDateString('fr-FR')}</p>}
    </>
  );
}

export default function ChantierCard({ p, couleur, onSupprimer, peutSupprimer }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: p.id });
  const [m, setM] = useState(false);
  return (
    <article ref={setNodeRef} {...attributes} {...listeners} className={`ek-card ${isDragging ? 'is-dragging' : ''}`}>
      <CarteContenu p={p} couleur={couleur} />
      {peutSupprimer && (
        <div className="ek-card__menu" onPointerDown={(e) => e.stopPropagation()}>
          <button className="ek-icon-btn" onClick={() => setM(!m)} aria-label="Actions"><MoreVertical size={16} /></button>
          {m && (
            <div className="ek-dropdown">
              <button className="ek-dd-item ek-danger" onClick={() => { setM(false); onSupprimer(p); }}>
                <Trash2 size={15} /> Supprimer
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}